# Watts AI - Study Loop Demo

AI-assisted prompt engineering for the Alan Watts persona. Demonstrates how one AI can score another to iteratively improve response quality.

## Live Demo
**https://watts.jettaintelligence.com**

## The Methodology

When building an AI persona, models tend to fall into self-help clichés, sound condescending on pushback, and give pseudo-profound responses that don't actually help. Manual testing catches some issues, but it's slow and inconsistent.

**Study loops** fix this by running test cases through the persona, then scoring responses against quality gates:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Test Case  │────▶│   Persona   │────▶│   Scorer    │
│  "How do I  │     │   (LLM)     │     │  (Gates)    │
│  find peace"│     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                    ┌─────────────┐           │
                    │  Failures   │◀──────────┘
                    │  - Self-help│
                    │  - Bullshit │
                    └─────────────┘
```

## Quality Gates

### Gate 1: Form (No Bad Patterns)
- No self-help clichés: "cultivate", "journey within", "find balance"
- No bullshit: "testament to", "profound appreciation", "tapestry of"
- No condescension: "the classic complaint", "spoon-feed", "naive"

### Gate 2: Helpfulness
- Acknowledges their situation
- Reframes with a different perspective
- Gives something concrete (question, observation, insight)

### Gate 3: Engagement
- Opens space for continued dialogue
- Doesn't shut down the conversation
- Builds bridge to their experience

## Key Insight

**Brevity was the enemy of helpfulness.** Early versions enforced 1-2 sentence limits, which left no room for acknowledgment → reframe → insight. Removing the constraint and focusing on helpfulness improved scores dramatically.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run study loop tests (CLI)
npx ts-node scripts/study-loop-v4.ts
```

## Project Structure

```
src/
├── app/
│   ├── api/chat/         # LLM chat endpoint
│   ├── loops/            # Study loop results page
│   └── page.tsx          # Main chat UI
├── components/
│   ├── chat/             # Chat interface
│   └── ui/               # Shared components
├── config/
│   ├── prompts.ts        # Watts persona prompt
│   └── constants.ts      # App constants
scripts/
└── study-loop-v4.ts      # Automated quality scoring
```

## Key Documents
- [PROMPTS.md](./PROMPTS.md) - Prompt engineering and persona design
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture

## Credits

Built by AIC Holdings as part of the Philosophe AI collaboration.
