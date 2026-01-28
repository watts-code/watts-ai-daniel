'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DepthLevel, TopicType } from '@/types';
import { DEPTH_LEVELS, TOPICS, OPENING_LINES } from '@/config/constants';
import { EnsoSpinner } from '@/components/ui/EnsoSpinner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  pondering?: string;
}

type FeedbackType = 'up' | 'down' | null;

interface FeedbackData {
  messageIndex: number;
  feedback: FeedbackType;
  userMessage: string;
  assistantResponse: string;
  timestamp: string;
}

// Parse pondering and response from streamed content
function parseWattsResponse(content: string): { pondering: string; response: string } {
  const ponderingMatch = content.match(/<pondering>([\s\S]*?)<\/pondering>/);
  const responseMatch = content.match(/<response>([\s\S]*?)<\/response>/);

  let pondering = '';
  let response = '';

  if (ponderingMatch) {
    pondering = ponderingMatch[1].trim();
  } else if (content.includes('<pondering>')) {
    pondering = content.split('<pondering>')[1]?.split('<')[0]?.trim() || '';
  }

  if (responseMatch) {
    response = responseMatch[1].trim();
  } else if (content.includes('<response>')) {
    response = content.split('<response>')[1]?.split('<')[0]?.trim() || '';
  }

  return { pondering, response };
}

const QUICK_REPLIES = [
  "What is the ego?",
  "How do I find peace?",
  "Tell me about Zen",
  "What happens when we die?",
  "How do I live in the present?",
];

const WAITING_MESSAGES = [
  "Hmm, let me ponder that...",
  "Ah, now that's interesting...",
  "Well now...",
  "Let me see...",
  "The funny thing is...",
];

function getWaitingMessage() {
  return WAITING_MESSAGES[Math.floor(Math.random() * WAITING_MESSAGES.length)];
}

export function TextChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [depthLevel, setDepthLevel] = useState<DepthLevel>('reflective');
  const [selectedTopics, setSelectedTopics] = useState<TopicType[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState('');
  const [feedback, setFeedback] = useState<Record<number, FeedbackType>>({});
  const [showSummaryOption, setShowSummaryOption] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingContentRef = useRef<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('watts-conversation');
    if (saved) {
      try {
        const { messages: savedMessages, depthLevel: savedDepth, topics: savedTopics } = JSON.parse(saved);
        if (savedMessages?.length > 0) {
          setMessages(savedMessages);
          setDepthLevel(savedDepth || 'reflective');
          setSelectedTopics(savedTopics || []);
          setHasStarted(true);
        }
      } catch (e) {
        console.error('Failed to load saved conversation:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (hasStarted && messages.length > 0) {
      localStorage.setItem('watts-conversation', JSON.stringify({
        messages,
        depthLevel,
        topics: selectedTopics,
      }));
    }
  }, [messages, depthLevel, selectedTopics, hasStarted]);

  useEffect(() => {
    setShowSummaryOption(messages.length >= 6);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (hasStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasStarted, isLoading]);

  const startConversation = () => {
    const opening = OPENING_LINES[Math.floor(Math.random() * OPENING_LINES.length)];
    setMessages([{ role: 'assistant', content: `<response>${opening}</response>` }]);
    setHasStarted(true);
  };

  const endConversation = () => {
    localStorage.removeItem('watts-conversation');
    setHasStarted(false);
    setMessages([]);
    setShowSummaryOption(false);
  };

  const toggleTopic = (topic: TopicType) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) return prev.filter((t) => t !== topic);
      if (prev.length >= 3) return [...prev.slice(1), topic];
      return [...prev, topic];
    });
  };

  const handleFeedback = (messageIndex: number, type: FeedbackType) => {
    const newFeedback = feedback[messageIndex] === type ? null : type;
    setFeedback(prev => ({ ...prev, [messageIndex]: newFeedback }));

    const userMessage = messages[messageIndex - 1]?.content || '';
    const assistantResponse = messages[messageIndex]?.content || '';

    const feedbackData: FeedbackData = {
      messageIndex,
      feedback: newFeedback,
      userMessage,
      assistantResponse,
      timestamp: new Date().toISOString(),
    };

    console.log('Feedback:', feedbackData);
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);
    setWaitingMessage(getWaitingMessage());

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: text }],
          depthLevel,
          topics: selectedTopics,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      streamingContentRef.current = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                streamingContentRef.current += parsed.text;
                const content = streamingContentRef.current;
                setMessages((prev) => [
                  ...prev.slice(0, -1),
                  { role: 'assistant', content }
                ]);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Ah, it seems something went amiss. Shall we try again?' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const [hasSavedConversation, setHasSavedConversation] = useState(false);

  useEffect(() => {
    setHasSavedConversation(!!localStorage.getItem('watts-conversation'));
  }, []);

  // Landing page - stripped back
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          {/* Portrait */}
          <div className="mb-6">
            <div className="w-36 h-36 mx-auto rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <Image
                src="/images/watts-portrait.png"
                alt="Alan Watts"
                width={144}
                height={144}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          <h1 className="text-3xl font-serif text-neutral-800 mb-2">
            Alan Watts
          </h1>
          <p className="text-neutral-500 mb-8 text-base">
            an AI exploring his ideas
          </p>

          {/* Resume previous conversation */}
          {hasSavedConversation && (
            <div className="mb-8 p-4 bg-white rounded-lg border border-stone-200">
              <p className="text-stone-500 text-sm mb-3">You have an unfinished conversation</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    const saved = localStorage.getItem('watts-conversation');
                    if (saved) {
                      const { messages: savedMessages, depthLevel: savedDepth, topics: savedTopics } = JSON.parse(saved);
                      setMessages(savedMessages);
                      setDepthLevel(savedDepth || 'reflective');
                      setSelectedTopics(savedTopics || []);
                      setHasStarted(true);
                    }
                  }}
                  className="px-4 py-2 bg-stone-800 text-white rounded text-sm hover:bg-stone-700 transition-colors"
                >
                  Resume
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('watts-conversation');
                    setHasSavedConversation(false);
                  }}
                  className="px-4 py-2 bg-stone-100 text-stone-600 rounded text-sm hover:bg-stone-200 transition-colors"
                >
                  Start Fresh
                </button>
              </div>
            </div>
          )}

          {/* Depth selector */}
          <div className="mb-5">
            <label className="text-xs text-stone-400 uppercase tracking-wide block mb-2">
              Depth
            </label>
            <div className="flex justify-center gap-1.5 flex-wrap">
              {(Object.keys(DEPTH_LEVELS) as DepthLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDepthLevel(level)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    depthLevel === level
                      ? 'bg-stone-800 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {DEPTH_LEVELS[level].label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic chips */}
          <div className="mb-8">
            <label className="text-xs text-stone-400 uppercase tracking-wide block mb-2">
              Topics
            </label>
            <div className="flex justify-center gap-1.5 flex-wrap">
              {(Object.keys(TOPICS) as TopicType[]).map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-2.5 py-1 rounded text-sm transition-colors ${
                    selectedTopics.includes(topic)
                      ? 'bg-stone-800 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {TOPICS[topic].label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startConversation}
            className="px-8 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded text-base transition-colors"
          >
            Begin
          </button>

          <div className="mt-8 space-y-3">
            <div className="flex justify-center gap-4 text-sm text-stone-400">
              <Link href="/technology" className="hover:text-stone-600 transition-colors">
                Technology
              </Link>
              <span>|</span>
              <Link href="/stakeholders" className="hover:text-stone-600 transition-colors">
                Stakeholders
              </Link>
            </div>
            <p className="text-stone-400 text-xs">
              Powered by Artemis
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="p-3 bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden grayscale">
              <Image
                src="/images/watts-portrait.png"
                alt="Alan Watts"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-serif text-base text-stone-800">Alan Watts</h1>
              <p className="text-xs text-stone-400">
                {DEPTH_LEVELS[depthLevel].label}
                {selectedTopics.length > 0 && ` · ${selectedTopics.map(t => TOPICS[t].label).join(', ')}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {showSummaryOption && (
              <button
                onClick={() => sendMessage("Can you summarize our conversation so far?")}
                className="text-stone-400 hover:text-stone-600 text-sm px-2 py-1 rounded hover:bg-stone-100 transition-colors"
              >
                Summary
              </button>
            )}
            <button
              onClick={endConversation}
              className="text-stone-400 hover:text-stone-600 text-sm px-2 py-1 rounded hover:bg-stone-100 transition-colors"
            >
              End
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {messages.map((msg, i) => {
            const isAssistant = msg.role === 'assistant';
            const { pondering, response } = isAssistant
              ? parseWattsResponse(msg.content)
              : { pondering: '', response: msg.content };

            return (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                {isAssistant && (
                  <div className="w-7 h-7 rounded-full overflow-hidden grayscale flex-shrink-0 mt-0.5">
                    <Image
                      src="/images/watts-portrait.png"
                      alt=""
                      width={28}
                      height={28}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Message bubble */}
                <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'space-y-2'}`}>
                  {/* Pondering section */}
                  {isAssistant && pondering && (
                    <div className="bg-stone-100 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
                        <span className="inline-block w-1 h-1 bg-stone-400 rounded-full animate-pulse" />
                        pondering
                      </div>
                      <p className="text-stone-500 italic text-sm leading-relaxed whitespace-pre-wrap">
                        {pondering}
                      </p>
                    </div>
                  )}

                  {/* Response section */}
                  {(response || msg.role === 'user') && (
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        msg.role === 'user'
                          ? 'bg-stone-800 text-white'
                          : 'bg-white border border-stone-200'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
                        {msg.role === 'user' ? msg.content : response}
                      </p>
                    </div>
                  )}

                  {/* Feedback buttons */}
                  {isAssistant && response && !isLoading && (
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => handleFeedback(i, 'up')}
                        className={`p-1 rounded transition-colors ${
                          feedback[i] === 'up'
                            ? 'text-green-600 bg-green-50'
                            : 'text-stone-300 hover:text-stone-500 hover:bg-stone-50'
                        }`}
                        title="Helpful"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleFeedback(i, 'down')}
                        className={`p-1 rounded transition-colors ${
                          feedback[i] === 'down'
                            ? 'text-red-600 bg-red-50'
                            : 'text-stone-300 hover:text-stone-500 hover:bg-stone-50'
                        }`}
                        title="Unhelpful"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full overflow-hidden grayscale flex-shrink-0 mt-0.5">
                <Image
                  src="/images/watts-portrait.png"
                  alt=""
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white border border-stone-200 rounded-lg px-3 py-2">
                <div className="flex gap-2 items-center text-stone-400 italic text-sm">
                  <EnsoSpinner size={16} className="text-stone-400" />
                  {waitingMessage}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick replies */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 pb-2">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-1.5 overflow-x-auto pb-2">
              {QUICK_REPLIES.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(reply)}
                  className="px-3 py-1.5 bg-white border border-stone-200 rounded text-sm text-stone-600 whitespace-nowrap flex-shrink-0 hover:bg-stone-50 hover:border-stone-300 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 bg-white border-t border-stone-200">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Alan anything..."
              disabled={isLoading}
              className="flex-1 bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 disabled:opacity-50 transition-colors"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
