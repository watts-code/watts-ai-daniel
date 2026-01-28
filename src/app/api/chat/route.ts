import { NextRequest } from 'next/server';
import { buildSystemPrompt } from '@/config/prompts';
import { DepthLevel, TopicType } from '@/types';

// Use Artemis in production, Ollama locally
const ARTEMIS_URL = process.env.ARTEMIS_URL || 'https://artemis.jettaintelligence.com';
const ARTEMIS_API_KEY = process.env.ARTEMIS_API_KEY;
const USE_ARTEMIS = !!ARTEMIS_API_KEY;

// Fallback to local Ollama for development
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      depthLevel = 'reflective',
      topics = []
    } = body as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>;
      depthLevel?: DepthLevel;
      topics?: TopicType[];
    };

    // Get the current user input (last message)
    const currentInput = messages.length > 0
      ? messages[messages.length - 1].content
      : '';

    const systemPrompt = buildSystemPrompt({
      depthLevel,
      selectedTopics: topics,
      currentInput,
      messages,
    });

    if (USE_ARTEMIS) {
      // Production: Use Artemis (OpenAI-compatible API)
      return await streamFromArtemis(systemPrompt, messages);
    } else {
      // Development: Use local Ollama
      return await streamFromOllama(systemPrompt, messages);
    }
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function streamFromArtemis(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<Response> {
  const response = await fetch(`${ARTEMIS_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ARTEMIS_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct', // Via OpenRouter
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: true,
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Artemis error:', error);
    throw new Error(`Artemis API error: ${response.status}`);
  }

  // Transform Artemis SSE to our format
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const transformStream = new TransformStream({
    transform(chunk, controller) {
      const text = decoder.decode(chunk);
      const lines = text.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          } else {
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`));
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    },
  });

  const stream = response.body?.pipeThrough(transformStream);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

async function streamFromOllama(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<Response> {
  // Dynamic import for Ollama (only used in dev)
  const { Ollama } = await import('ollama');
  const ollama = new Ollama({ host: OLLAMA_URL });

  const response = await ollama.chat({
    model: 'llama3:latest',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    stream: true,
    options: {
      num_predict: 400,
      temperature: 0.7,
    },
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const text = chunk.message?.content || '';
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
