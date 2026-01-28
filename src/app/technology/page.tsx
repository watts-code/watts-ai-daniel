import Link from 'next/link';

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/50 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-lg">
              🧘
            </div>
            <h1 className="font-serif text-xl">Alan Watts AI</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/loops"
              className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Study Loops
            </Link>
            <Link
              href="/stakeholders"
              className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Stakeholders
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-amber-600/20 text-amber-400 border border-amber-600/50 rounded-lg text-sm hover:bg-amber-600/30 transition-colors"
            >
              Try the Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-serif mb-4">The Technology Behind Alan Watts AI</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            A deep dive into how we recreated the philosophical voice of Alan Watts
            using local LLM inference and advanced persona engineering.
          </p>
        </section>

        {/* Overview */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Project Overview</h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-300 leading-relaxed mb-4">
              This project recreates Alan Watts&apos; distinctive conversational style as an AI chatbot.
              Unlike typical AI assistants that give advice, this AI embodies Watts&apos; approach of
              <strong className="text-amber-400"> challenging the premise</strong> of questions rather than
              answering them directly.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              The result is an AI that responds with the wit, warmth, and philosophical depth
              that made Watts&apos; lectures so memorable—helping users see their questions from
              an entirely different perspective.
            </p>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Technical Architecture</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <span className="text-amber-500">▸</span> Frontend
              </h3>
              <ul className="space-y-2 text-zinc-400">
                <li><strong className="text-zinc-200">Next.js 14</strong> - React framework with App Router</li>
                <li><strong className="text-zinc-200">TypeScript</strong> - Type-safe development</li>
                <li><strong className="text-zinc-200">Tailwind CSS</strong> - Utility-first styling</li>
                <li><strong className="text-zinc-200">Server-Sent Events</strong> - Real-time streaming responses</li>
              </ul>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <span className="text-amber-500">▸</span> AI Backend
              </h3>
              <ul className="space-y-2 text-zinc-400">
                <li><strong className="text-zinc-200">Ollama</strong> - Local LLM inference server</li>
                <li><strong className="text-zinc-200">llama3 (8B)</strong> - Meta&apos;s instruction-tuned model</li>
                <li><strong className="text-zinc-200">Custom System Prompt</strong> - Persona engineering</li>
                <li><strong className="text-zinc-200">Streaming API</strong> - Token-by-token delivery</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Persona Engineering */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Persona Engineering</h2>
          <p className="text-zinc-300 mb-6">
            The core challenge was capturing Watts&apos; unique approach to philosophical dialogue.
            We developed several key techniques:
          </p>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 text-amber-300">1. Premise Challenging</h3>
              <p className="text-zinc-400 mb-4">
                Watts rarely answered questions directly. Instead, he exposed the hidden assumptions
                within the question itself. Our AI is trained to identify and flip these premises.
              </p>
              <div className="bg-zinc-800/50 rounded-lg p-4 font-mono text-sm">
                <p className="text-zinc-500 mb-2">User: &quot;How do I find peace?&quot;</p>
                <p className="text-amber-400">AI: &quot;The seeker IS the sought, my friend.&quot;</p>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 text-amber-300">2. Pondering Phase</h3>
              <p className="text-zinc-400 mb-4">
                Each response includes a visible &quot;pondering&quot; section where the AI thinks through
                the question, echoing the user&apos;s words before flipping them. This mirrors Watts&apos;
                lecture style of restating questions before addressing them.
              </p>
              <div className="bg-zinc-800/50 rounded-lg p-4 font-mono text-sm">
                <p className="text-zinc-500 italic mb-2">&quot;Hmm... &apos;find&apos; peace - as if you&apos;ve misplaced
                your car keys. But who is this &apos;I&apos; doing the searching?&quot;</p>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 text-amber-300">3. Anti-Self-Help Patterns</h3>
              <p className="text-zinc-400 mb-4">
                Modern AI tends toward generic self-help advice. We explicitly banned phrases like
                &quot;cultivate peace,&quot; &quot;practice mindfulness,&quot; and &quot;find balance&quot;—the kind of language
                Watts himself would have found absurd.
              </p>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-red-400/70 text-sm mb-2">Banned patterns:</p>
                <p className="text-zinc-500 font-mono text-sm">
                  &quot;cultivate&quot; | &quot;sit with yourself&quot; | &quot;take time to&quot; | &quot;learn to&quot; | &quot;practice&quot; | &quot;find balance&quot;
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 text-amber-300">4. Brevity Enforcement</h3>
              <p className="text-zinc-400 mb-4">
                Watts&apos; best insights were often one-liners. We enforce a strict 1-2 sentence limit
                on responses, forcing the AI to deliver punchlines rather than lectures.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-3">
                  <p className="text-red-400 text-xs mb-1">Before optimization</p>
                  <p className="text-zinc-400">4.2 sentences avg</p>
                </div>
                <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-3">
                  <p className="text-green-400 text-xs mb-1">After optimization</p>
                  <p className="text-zinc-400">1.8 sentences avg</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Metrics */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Quality Metrics</h2>
          <p className="text-zinc-300 mb-6">
            We developed a second-order &quot;study loop&quot; with two gates that both must pass:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-amber-400 mb-2">98</p>
              <p className="text-zinc-500 text-sm">Overall Score</p>
              <p className="text-zinc-600 text-xs mt-1">out of 100</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-green-400 mb-2">5/5</p>
              <p className="text-zinc-500 text-sm">Gate 1: Form</p>
              <p className="text-zinc-600 text-xs mt-1">brevity, voice, no self-help, no BS</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-green-400 mb-2">5/5</p>
              <p className="text-zinc-500 text-sm">Gate 2: Value</p>
              <p className="text-zinc-600 text-xs mt-1">connection, warmth, actionable</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-4 text-center">
            <Link href="/loops" className="text-amber-400 hover:text-amber-300">
              Learn more about our RL-inspired scoring system →
            </Link>
          </p>
        </section>

        {/* Sample Responses */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Sample Responses</h2>
          <div className="space-y-4">
            {[
              { q: "How do I find peace?", a: "Right now, you're already peaceful - notice you're not fleeing a tiger." },
              { q: "I work 60 hours a week and I'm exhausted", a: "Of course you are. Right now, what does your exhaustion need?" },
              { q: "I'm afraid of dying", a: "Of course you are. Notice though: you've 'died' to yesterday already." },
              { q: "This is not helpful", a: "You're right. What would actually help right now?" },
              { q: "I feel disconnected from everyone", a: "Of course that hurts. The ache means you're built for connection - who do you miss?" },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <p className="text-zinc-400 text-sm mb-2">
                  <span className="text-zinc-600">User:</span> &quot;{item.q}&quot;
                </p>
                <p className="text-amber-300 font-serif text-lg">
                  &quot;{item.a}&quot;
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Future Roadmap */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Future Development</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <span className="text-zinc-600">Phase 2</span>
                <span className="text-amber-400">Voice Integration</span>
              </h3>
              <p className="text-zinc-400 text-sm">
                Audio input/output with voice cloning to recreate Watts&apos; distinctive
                speaking style and British inflection.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <span className="text-zinc-600">Phase 3</span>
                <span className="text-amber-400">Visual Avatar</span>
              </h3>
              <p className="text-zinc-400 text-sm">
                2D animated avatar with lip-sync and expressive gestures to
                accompany spoken responses.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <span className="text-zinc-600">Phase 4</span>
                <span className="text-amber-400">RAG Quote Database</span>
              </h3>
              <p className="text-zinc-400 text-sm">
                Retrieval-augmented generation using Watts&apos; actual quotes and
                lecture transcripts for authentic responses.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <span className="text-zinc-600">Phase 5</span>
                <span className="text-amber-400">Archive Integration</span>
              </h3>
              <p className="text-zinc-400 text-sm">
                Integration with the Alan Watts Organization&apos;s audio archive
                for training on original source material.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 border-t border-zinc-800">
          <h2 className="text-2xl font-serif mb-4">Experience It Yourself</h2>
          <p className="text-zinc-400 mb-6">
            Have a philosophical conversation with Alan Watts AI.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-xl text-white font-medium text-lg transition-all duration-200 shadow-lg shadow-amber-900/30"
          >
            Begin Conversation
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 p-6 text-center text-zinc-600 text-sm">
        <p>Built by AIC Holdings · Powered by Ollama + llama3</p>
      </footer>
    </div>
  );
}
