# Watts AI - Study Loop Demo

An Alan Watts AI chatbot that demonstrates **reinforcement learning-inspired prompt engineering**. One AI generates responses, another scores them against quality gates, and the feedback loop drives iterative improvement.

## Live Demo

**https://watts.jettaintelligence.com**

---

## The Problem

When building an AI persona, models consistently fail in predictable ways:

| Failure Mode | Example |
|--------------|---------|
| **Self-help clichés** | "cultivate inner peace", "practice mindfulness" |
| **Pseudo-profound BS** | "testament to your profound appreciation for life" |
| **Condescension** | "(laughs) the classic complaint!", "spoon-feed" |
| **Unhelpful cleverness** | "Who is this 'I' that seeks?" (deflects instead of helps) |

Manual testing catches some issues, but it's slow, inconsistent, and doesn't scale.

---

## The Solution: Study Loops

Inspired by reinforcement learning, we built an automated scoring system that evaluates every response against defined quality gates:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Test Case   │─────▶│   Persona    │─────▶│   Scorer     │
│              │      │    (LLM)     │      │   (Gates)    │
│ "How do I    │      │              │      │              │
│  find peace?"│      │  Generates   │      │  Evaluates   │
└──────────────┘      │  response    │      │  response    │
                      └──────────────┘      └──────┬───────┘
                                                   │
                      ┌──────────────┐             │
                      │   Failures   │◀────────────┘
                      │              │
                      │ • Self-help  │
                      │ • Bullshit   │
                      │ • Condescend │
                      └──────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ Fix Prompt   │
                      │ Re-run Tests │
                      │ Verify Score │
                      └──────────────┘
```

### The Three Gates

Each response must pass three independent gates:

#### Gate 1: Form (No Bad Patterns)

Pattern-matching against known failure modes:

```typescript
// Banned self-help phrases
const SELF_HELP_BANNED = [
  /cultivate/i, /practice \w+ing/i, /find balance/i,
  /journey within/i, /be present/i, /mindful/i
];

// Pseudo-profound bullshit
const BULLSHIT_PATTERNS = [
  /testament to/i, /profound appreciation/i,
  /tapestry of/i, /infinite wisdom/i
];

// Condescension (especially on pushback)
const CONDESCENSION_PATTERNS = [
  /the classic complaint/i, /spoon-?feed/i,
  /utopian optimism/i, /naive/i
];
```

#### Gate 2: Helpfulness

Does the response actually help the person?

- **Acknowledges** - Shows understanding of their situation
- **Reframes** - Offers a different perspective
- **Gives something** - Concrete question, observation, or insight
- **Would help** - Passes the "would this actually help someone?" test

#### Gate 3: Engagement

Does the response keep the conversation going?

- **Opens space** - Ends with question or invitation
- **No shutdown** - Doesn't abruptly end the conversation
- **Builds bridge** - References their words/situation
- **Invites deeper** - Encourages them to share more

---

## Key Insight: Brevity Was The Enemy

Early versions enforced 1-2 sentence limits to match Watts' pithy style. This was a mistake.

**The problem:** Short responses left no room for the acknowledgment → reframe → insight pattern that actually helps people.

**Before (1-2 sentences):**
```
User: "I work 60 hours a week and I'm exhausted"
AI: "The only thing you can exhaust is your own attention!"

Gate 2: ❌ FAIL - Clever but unhelpful
```

**After (no length constraint):**
```
User: "I work 60 hours a week and I'm exhausted"
AI: "Sixty hours - that's exhausting just to hear. And yet here you are,
     stopped, talking with me. What would need to change for this not to
     be the exception? What's driving those sixty hours?"

Gate 2: ✅ PASS - Acknowledges, reframes, gives something concrete
```

Removing the brevity constraint and focusing on helpfulness improved scores from ~50% to ~85% pass rate.

---

## Multi-Dimensional Testing

To avoid overfitting to specific patterns, test cases cover multiple dimensions:

| Dimension | Examples |
|-----------|----------|
| **User state** | Curious, frustrated, vulnerable, hopeful |
| **Conversation depth** | Opening question, mid-conversation, pushback |
| **Topic** | Existential, burnout, relationships, fear |
| **Edge cases** | "Whatever", "...", "You tell me" |

Each test case is tagged with dimensions, and we track pass rates per dimension to catch regressions:

```
📈 RESULTS BY DIMENSION:
  frustrated      ████████░░ 4/5 (80%)
  vulnerable      █████████░ 5/6 (83%)
  hopeful         ██████████ 3/3 (100%)
  pushback        ███████░░░ 3/4 (75%)
  edge-case       ██████░░░░ 2/3 (67%)
```

---

## Architecture

```
src/
├── app/
│   ├── api/chat/         # LLM endpoint (OpenRouter or Ollama)
│   ├── loops/            # Study loop results page
│   └── page.tsx          # Main chat UI
├── components/
│   ├── chat/             # Chat interface
│   └── ui/               # Shared components (Ensō spinner, etc.)
├── config/
│   ├── prompts.ts        # Watts persona prompt
│   └── constants.ts      # App constants
scripts/
└── study-loop-v4.ts      # Automated quality scoring
```

### LLM Backend

The chat API supports two backends:

| Backend | When | Model |
|---------|------|-------|
| **OpenRouter** | `OPENROUTER_API_KEY` is set | `meta-llama/llama-3.1-8b-instruct` |
| **Ollama** | No API key (local dev) | `llama3:latest` |

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/watts-code/watts-ai-daniel.git
cd watts-ai-daniel

# Install dependencies
npm install

# Option 1: Use local Ollama (no API key needed)
# Make sure Ollama is running with llama3
ollama pull llama3
npm run dev

# Option 2: Use OpenRouter
echo "OPENROUTER_API_KEY=your-key-here" > .env.local
npm run dev
```

Open **http://localhost:3000** and start chatting.

### Running the Study Loop

```bash
# Run all test cases against local Ollama
npx ts-node scripts/study-loop-v4.ts

# The script will output:
# - Individual test results with gate pass/fail
# - Dimension-level pass rates
# - Regression warnings if scores drop
```

---

## The Iteration Process

1. **Run study loop** - Collect pass/fail results across all gates
2. **Identify patterns** - "Condescending on pushback", "Deflects with philosophy"
3. **Update prompt** - Add explicit rules: "Don't mock when users are frustrated"
4. **Re-run tests** - Verify improvement without regression
5. **Repeat** - Tighten thresholds as quality improves

This is RL without the RL infrastructure - human-in-the-loop reward signal encoded as pattern matching.

---

## Files

| File | Purpose |
|------|---------|
| `scripts/study-loop-v4.ts` | Three-gate scoring system |
| `src/config/prompts.ts` | Watts persona prompt with all learnings baked in |
| `PROMPTS.md` | Detailed prompt engineering documentation |
| `ARCHITECTURE.md` | Technical architecture overview |

---

## Credits

Built by **AIC Holdings** as part of the Philosophe AI collaboration.

- Daniel Shanklin - Director of AI
- Study loop methodology inspired by RLHF principles

---

## License

MIT
