# Study Loop: AI-Assisted Prompt Engineering

A methodology for improving AI personas using automated quality scoring. One AI generates responses, another scores them against defined criteria, and the feedback loop drives prompt refinement.

## The Problem

When building an AI persona (like Alan Watts), models tend to:
- Fall into self-help clichés ("cultivate peace", "practice mindfulness")
- Sound condescending when users push back
- Give pseudo-profound responses that don't actually help
- Ignore persona constraints under pressure

Manual testing catches some issues, but it's slow and inconsistent.

## The Solution: Study Loops

Run test cases through the persona, then score responses against quality gates:

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
- **No self-help clichés**: "cultivate", "journey within", "find balance"
- **No bullshit**: "testament to", "profound appreciation", "tapestry of"
- **No condescension**: "the classic complaint", "spoon-feed", "naive"
- **Voice markers**: Should sound like the persona

### Gate 2: Helpfulness
- **Acknowledges**: Shows understanding of their situation
- **Reframes**: Offers a different perspective
- **Gives something**: Concrete question, observation, or insight
- **Would help**: Would this actually help someone?

### Gate 3: Continuation
- **Opens space**: Ends with question or invitation
- **No shutdown**: Doesn't end conversation abruptly
- **Builds bridge**: References their words/situation

## Usage

```bash
# Install dependencies
npm install

# Run the study loop against test cases
npx ts-node src/run-study-loop.ts

# Run against a specific prompt
npx ts-node src/run-study-loop.ts --prompt "How do I find peace?"
```

## Example Output

```
Test: "I work 60 hours a week and I'm exhausted"

Response: "The only thing you can exhaust is your own attention!"

Gate 1 (Form):     ✅ PASS
Gate 2 (Helpful):  ✅ PASS
Gate 3 (Continue): ✅ PASS
Score: 87/100

---

Test: "You tell me" (pushback)

Response: "(laughs) You want me to spoon-feed it to you?"

Gate 1 (Form):     ❌ FAIL - Condescending: "spoon-feed"
Gate 2 (Helpful):  ❌ FAIL - Doesn't acknowledge frustration
Score: 31/100
```

## Iteration Process

1. Run study loop, collect failures
2. Identify patterns (e.g., "condescending on pushback")
3. Add explicit rules to prompt ("Don't mock when users are frustrated")
4. Re-run, verify improvement
5. Repeat

## Key Insight

**Brevity was the enemy of helpfulness.** Early versions enforced 1-2 sentence limits, which left no room for acknowledgment → reframe → insight. Removing the constraint and focusing on helpfulness improved scores dramatically.

## Files

- `src/study-loop.ts` - Scoring logic with all three gates
- `src/prompts.ts` - Alan Watts persona prompt
- `src/test-cases.ts` - Test scenarios including pushback cases
- `src/run-study-loop.ts` - CLI runner

## Credits

Built by AIC Holdings as part of the Philosophe AI collaboration.
