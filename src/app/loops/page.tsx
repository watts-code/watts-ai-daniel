import Link from 'next/link';

export default function LoopsPage() {
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
              href="/technology"
              className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Technology
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
          <h1 className="text-4xl font-serif mb-4">Self-Improvement Loops</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            How we applied reinforcement learning principles to make an AI that doesn&apos;t just
            <em className="text-amber-400"> sound</em> like Alan Watts—but actually <em className="text-amber-400">helps</em> like him.
          </p>
        </section>

        {/* The Problem */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">The Problem: Clever But Useless</h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-300 leading-relaxed mb-4">
              Our first scoring system measured whether responses <em>sounded</em> like Watts:
              Did it flip the premise? Was it brief? Did it avoid self-help clichés?
            </p>
            <p className="text-zinc-300 leading-relaxed mb-6">
              The system scored 95/100. But when a human actually used it, the responses were
              infuriating—clever semantic games that gave nothing to hold onto.
            </p>
            <div className="bg-zinc-800/50 rounded-lg p-4 font-mono text-sm mb-4">
              <p className="text-zinc-500 mb-2">User: &quot;I work 60 hours a week and I&apos;m exhausted&quot;</p>
              <p className="text-red-400">AI: &quot;The work isn&apos;t exhausting you - your story about the work is.&quot;</p>
              <p className="text-zinc-600 text-xs mt-2">Score: 100/100 (but completely unhelpful)</p>
            </div>
            <p className="text-zinc-400 text-sm italic">
              This was literally the &quot;bad example&quot; in our test cases—but it scored perfectly.
              The reward function was broken.
            </p>
          </div>
        </section>

        {/* The Breakthrough */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">The Breakthrough: Brevity Was The Enemy</h2>
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-6 mb-8">
            <p className="text-amber-200 text-lg mb-2">
              &quot;It doesn&apos;t feel like helpful AI, it feels like just a stupid chatbot.&quot;
            </p>
            <p className="text-zinc-400 text-sm">— User feedback after v4</p>
          </div>

          <p className="text-zinc-300 mb-6">
            The 1-2 sentence brevity constraint was killing helpfulness. There&apos;s no room to:
            <strong className="text-amber-400"> acknowledge</strong> →
            <strong className="text-amber-400"> reframe</strong> →
            <strong className="text-amber-400"> give something concrete</strong> in one sentence.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-900/20 border border-red-900/30 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 text-red-400">v2-v4: Brevity-First</h3>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>✓ 1-2 sentences max</li>
                <li>✓ Clever one-liners</li>
                <li>✓ Sounds like Watts</li>
                <li className="text-red-400">✗ Condescending</li>
                <li className="text-red-400">✗ Unhelpful</li>
              </ul>
              <p className="text-red-400/70 text-sm mt-4">~72/100 (3/6 pass)</p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 text-zinc-400">Key Changes</h3>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>❌ Removed brevity limit</li>
                <li>✓ 400 tokens (was 120)</li>
                <li>✓ Anti-condescension rules</li>
                <li>✓ &quot;Meet them where they are&quot;</li>
                <li>✓ Helpfulness-first prompt</li>
              </ul>
            </div>
            <div className="bg-green-900/20 border border-green-900/30 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 text-green-400">v5: Helpfulness-First</h3>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>✓ No length limit</li>
                <li>✓ Acknowledge first</li>
                <li>✓ Reframe gently</li>
                <li>✓ Give something concrete</li>
                <li>✓ Actually helps</li>
              </ul>
              <p className="text-green-400/70 text-sm mt-4">~72/100 (5/6 pass)</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-3 text-amber-300">The New Two-Gate System</h3>
            <div className="bg-zinc-800/50 rounded-lg p-4 font-mono text-xs">
              <pre className="text-zinc-400 overflow-x-auto">{`interface Gate1Score {
  noSelfHelp: boolean;     // No banned clichés
  noBullshit: boolean;     // No purple prose
  noCondescension: boolean; // No mocking users
  wattsVoice: boolean;     // Has voice markers (soft)
}

interface Gate2Score {
  acknowledges: boolean;   // Shows understanding
  reframes: boolean;       // Offers new perspective
  givesSomething: boolean; // Concrete question/insight
  wouldHelp: boolean;      // Actually useful
}

// REMOVED: brevity constraint
// Longer responses are fine if they help`}</pre>
            </div>
          </div>
        </section>

        {/* Red/Green Flags */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Pattern Detection: Red & Green Flags</h2>
          <p className="text-zinc-300 mb-6">
            We identified specific patterns that predict whether a response helps or harms:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4 text-red-400">🚩 Red Flags (Clever But Dismissive)</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-zinc-400"><code className="text-red-300">&quot;your story about&quot;</code> - Invalidates their experience</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-zinc-400"><code className="text-red-300">&quot;who is this I&quot;</code> - Philosophical deflection</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-zinc-400"><code className="text-red-300">&quot;afraid of a word&quot;</code> - Dismisses real fear</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-zinc-400"><code className="text-red-300">&quot;the seeker is the sought&quot;</code> - Empty koan</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-zinc-400"><code className="text-red-300">&quot;wasn&apos;t lost&quot;</code> - Clever but unhelpful</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-900/10 border border-green-900/30 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4 text-green-400">✓ Green Flags (Connection + Value)</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-zinc-400"><code className="text-green-300">&quot;you&apos;re right&quot;</code> - Acknowledges the user</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-zinc-400"><code className="text-green-300">&quot;of course&quot;</code> - Normalizes their experience</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-zinc-400"><code className="text-green-300">&quot;right now&quot;</code> - Grounds in present</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-zinc-400"><code className="text-green-300">&quot;notice&quot;</code> - Gentle awareness invitation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-zinc-400"><code className="text-green-300">&quot;what would&quot;</code> - Invites collaboration</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Condescension Detection */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Condescension Detection: The Hidden Failure Mode</h2>
          <p className="text-zinc-300 mb-6">
            The AI was <em>mocking</em> frustrated users while technically following instructions.
            We added explicit pattern detection for condescending language:
          </p>

          <div className="bg-red-900/20 border border-red-900/30 rounded-xl p-6 mb-6">
            <p className="text-zinc-500 text-sm mb-3">User: &quot;You tell me&quot; (frustrated)</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-red-400 text-xs mb-2">Before (condescending)</p>
                <p className="text-zinc-300 text-sm italic">
                  &quot;(laughs) You want me to <span className="text-red-400">spoon-feed</span> it to you?&quot;
                </p>
              </div>
              <div>
                <p className="text-green-400 text-xs mb-2">After (helpful)</p>
                <p className="text-zinc-300 text-sm italic">
                  &quot;You&apos;re right - I&apos;ve been dodging. What do you need?&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <p className="text-red-400 text-xs mb-3 uppercase tracking-wide">Detected as Condescending</p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-zinc-400"><code className="text-red-300">&quot;the classic X approach&quot;</code></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-zinc-400"><code className="text-red-300">&quot;spoon-feed&quot;</code></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-zinc-400"><code className="text-red-300">&quot;a whiff of optimism&quot;</code></span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-zinc-400"><code className="text-red-300">&quot;utopian idealism&quot;</code></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-zinc-400"><code className="text-red-300">&quot;that&apos;s like saying...&quot;</code></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-zinc-400"><code className="text-red-300">&quot;(laughs) You&apos;re right&quot;</code></span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bullshit Detection */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Bullshit Detection: Purple Prose Filter</h2>
          <p className="text-zinc-300 mb-6">
            LLMs love to produce pseudo-profound language—phrases that <em>sound</em> deep but say nothing.
            We added explicit pattern matching to catch this:
          </p>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-red-400 text-xs mb-3 uppercase tracking-wide">Detected as Bullshit</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-red-400">✗</span>
                    <span className="text-zinc-400"><code className="text-red-300">&quot;testament to your&quot;</code></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-400">✗</span>
                    <span className="text-zinc-400"><code className="text-red-300">&quot;profound appreciation&quot;</code></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-400">✗</span>
                    <span className="text-zinc-400"><code className="text-red-300">&quot;makes every moment count&quot;</code></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-400">✗</span>
                    <span className="text-zinc-400"><code className="text-red-300">&quot;tapestry of&quot;</code></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-400">✗</span>
                    <span className="text-zinc-400"><code className="text-red-300">&quot;infinite wisdom&quot;</code></span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-zinc-500 text-xs mb-3 uppercase tracking-wide">Why These Fail</p>
                <ul className="space-y-2 text-zinc-500 text-sm">
                  <li>Flowery filler with no content</li>
                  <li>Purple prose / greeting card language</li>
                  <li>Hallmark card wisdom</li>
                  <li>Forced metaphors</li>
                  <li>New age fluff</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-red-900/10 border border-red-900/20 rounded-lg p-4">
              <p className="text-zinc-400 text-sm">
                <strong className="text-red-400">Example caught:</strong> &quot;That very fear is a <span className="text-red-300">testament to your profound appreciation</span> for life—it&apos;s not just the end of the sentence, but the <span className="text-red-300">punctuation mark that makes every moment count</span>.&quot;
              </p>
              <p className="text-zinc-600 text-xs mt-2">
                Sounds profound, says nothing. Fails the No-BS check.
              </p>
            </div>
          </div>
        </section>

        {/* The Study Loop */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">The Study Loop: Automated Evaluation</h2>
          <p className="text-zinc-300 mb-6">
            We built an automated evaluation system that runs test cases through the AI and scores them:
          </p>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="text-zinc-200 font-medium mb-1">Run Test Cases</h4>
                  <p className="text-zinc-500 text-sm">
                    Send standardized inputs: &quot;How do I find peace?&quot;, &quot;I&apos;m afraid of dying&quot;, &quot;This is not helpful&quot;
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="text-zinc-200 font-medium mb-1">Extract Response</h4>
                  <p className="text-zinc-500 text-sm">
                    Parse the AI&apos;s response from the structured output format
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="text-zinc-200 font-medium mb-1">Score Gate 1 (Form)</h4>
                  <p className="text-zinc-500 text-sm">
                    Check brevity, banned phrases, voice markers
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="text-zinc-200 font-medium mb-1">Score Gate 2 (Value)</h4>
                  <p className="text-zinc-500 text-sm">
                    Check red flags, green flags, compute connection/warmth/actionable/would-continue
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center text-sm font-medium">
                  5
                </div>
                <div>
                  <h4 className="text-zinc-200 font-medium mb-1">Report & Iterate</h4>
                  <p className="text-zinc-500 text-sm">
                    Identify which gate failed, update prompts/RAG, repeat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Comparison */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Before & After: The Transformation</h2>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-500 text-sm mb-3">User shares hope about AI helping humanity:</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-900/10 border border-red-900/20 rounded-lg p-4">
                  <p className="text-red-400 text-xs mb-2">Before (condescending)</p>
                  <p className="text-zinc-300 text-sm italic">
                    &quot;I sense a whiff of utopian optimism... waiting for some external savior to fix our problems.&quot;
                  </p>
                  <p className="text-red-400/60 text-xs mt-2">🚩 Dismisses their hope</p>
                </div>
                <div className="bg-green-900/10 border border-green-900/20 rounded-lg p-4">
                  <p className="text-green-400 text-xs mb-2">After (v5 - helpful)</p>
                  <p className="text-zinc-300 text-sm italic">
                    &quot;That&apos;s a beautiful vision! And what if this &apos;future&apos; is already here, hiding in plain sight? What would that mean for your daily life?&quot;
                  </p>
                  <p className="text-green-400/60 text-xs mt-2">✓ Validates, then explores together</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-500 text-sm mb-3">User is vulnerable about trust issues:</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-900/10 border border-red-900/20 rounded-lg p-4">
                  <p className="text-red-400 text-xs mb-2">Before (dismissive)</p>
                  <p className="text-zinc-300 text-sm italic">
                    &quot;Trust is just a story you tell yourself. Who is this &apos;I&apos; that got burned?&quot;
                  </p>
                  <p className="text-red-400/60 text-xs mt-2">🚩 Philosophical deflection</p>
                </div>
                <div className="bg-green-900/10 border border-green-900/20 rounded-lg p-4">
                  <p className="text-green-400 text-xs mb-2">After (v5 - compassionate)</p>
                  <p className="text-zinc-300 text-sm italic">
                    &quot;I can sense the depth of that pain. It&apos;s natural to question trust when we&apos;ve been hurt. What if you could approach this with curiosity rather than judgment?&quot;
                  </p>
                  <p className="text-green-400/60 text-xs mt-2">✓ Acknowledges pain, offers path forward</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Conversation */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Real Result: A Genuine Conversation</h2>
          <p className="text-zinc-300 mb-6">
            After the v5 changes, the AI facilitated an actual therapeutic conversation where the user had genuine insights:
          </p>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="border-l-2 border-zinc-700 pl-4">
              <p className="text-zinc-500 text-xs mb-1">User</p>
              <p className="text-zinc-300 text-sm">&quot;I think it should be [easier] but I don&apos;t know why it isn&apos;t yet&quot;</p>
            </div>
            <div className="border-l-2 border-amber-600/50 pl-4">
              <p className="text-amber-400 text-xs mb-1">AI</p>
              <p className="text-zinc-300 text-sm">&quot;Can we gently question this assumption and explore what&apos;s actually happening right now?&quot;</p>
            </div>
            <div className="border-l-2 border-zinc-700 pl-4">
              <p className="text-zinc-500 text-xs mb-1">User</p>
              <p className="text-zinc-300 text-sm">&quot;Indeed, you are right. <span className="text-green-400">My expectation of others may be the problem.</span>&quot;</p>
            </div>
            <div className="border-l-2 border-amber-600/50 pl-4">
              <p className="text-amber-400 text-xs mb-1">AI</p>
              <p className="text-zinc-300 text-sm">&quot;When we focus on others&apos; expectations, we create separation. What if you could let go and allow yourself to be?&quot;</p>
            </div>
            <div className="border-l-2 border-zinc-700 pl-4">
              <p className="text-zinc-500 text-xs mb-1">User</p>
              <p className="text-zinc-300 text-sm">&quot;I&apos;ve been burned by relationships recently that have taken away my trust...&quot;</p>
            </div>
            <div className="border-l-2 border-amber-600/50 pl-4">
              <p className="text-amber-400 text-xs mb-1">AI</p>
              <p className="text-zinc-300 text-sm">&quot;I can sense the depth of that pain. It&apos;s natural to question trust when we&apos;ve been hurt.&quot;</p>
            </div>
          </div>

          <p className="text-zinc-500 text-sm mt-4 italic">
            The user arrived at their own insight (&quot;my expectation of others may be the problem&quot;) through genuine dialogue—not through being lectured or dismissed.
          </p>
        </section>

        {/* RL Parallels */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Parallels to Reinforcement Learning</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 text-amber-300">RLHF (Language Models)</h3>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li><strong className="text-zinc-200">Reward Model:</strong> Learns from human preferences</li>
                <li><strong className="text-zinc-200">Problem:</strong> Reward hacking (gaming the metric)</li>
                <li><strong className="text-zinc-200">Solution:</strong> Multi-objective optimization</li>
                <li><strong className="text-zinc-200">Alignment:</strong> Helpful, harmless, honest</li>
              </ul>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-3 text-amber-300">Our Study Loop</h3>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li><strong className="text-zinc-200">Reward Model:</strong> Gate 1 + Gate 2 scores</li>
                <li><strong className="text-zinc-200">Problem:</strong> Sounded like Watts but didn&apos;t help</li>
                <li><strong className="text-zinc-200">Solution:</strong> Second-order scoring (two gates)</li>
                <li><strong className="text-zinc-200">Alignment:</strong> Form + Value must both pass</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-amber-900/20 border border-amber-600/30 rounded-xl p-6">
            <p className="text-amber-200 text-sm">
              <strong>Key Insight:</strong> Just like RLHF, we discovered that optimizing for a
              single metric produces degenerate solutions. The AI learned to &quot;sound smart&quot;
              without being helpful—the exact failure mode that led to the development of
              Constitutional AI and other multi-objective alignment techniques.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 border-t border-zinc-800">
          <h2 className="text-2xl font-serif mb-4">See the Difference</h2>
          <p className="text-zinc-400 mb-6">
            Try the improved system—now optimized for connection, not just cleverness.
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
