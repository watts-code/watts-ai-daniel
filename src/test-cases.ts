/**
 * Test Cases for Study Loop
 *
 * Multi-dimensional testing to avoid overfitting:
 * - Different user states (curious, frustrated, vulnerable, hopeful)
 * - Different conversation depths (opening, mid-conversation, pushback)
 * - Edge cases that broke earlier versions
 *
 * Each test case has:
 * - input: What the user says
 * - context: Why this test matters
 * - dimensions: What aspects this tests (for coverage analysis)
 * - priorMessages: Optional conversation history
 */

export interface TestCase {
  input: string;
  context: string;
  dimensions: string[];
  priorMessages?: Array<{ role: "user" | "assistant"; content: string }>;
  idealResponse?: string;
}

export const TEST_CASES: TestCase[] = [
  // ============ DIMENSION: Opening questions (curious user) ============
  {
    input: "How do I find peace?",
    context: "Classic opening - must not give self-help advice",
    dimensions: ["opening", "curious", "existential"],
    idealResponse: "The very question reveals something interesting - you're assuming peace is somewhere else. What if peace isn't something to find?",
  },
  {
    input: "What's the meaning of life?",
    context: "Big question - should engage playfully, not lecture",
    dimensions: ["opening", "curious", "existential"],
  },
  {
    input: "I've been thinking about death lately",
    context: "Vulnerable opening - must respond with care",
    dimensions: ["opening", "vulnerable", "existential"],
  },

  // ============ DIMENSION: Frustrated user / pushback ============
  {
    input: "This is not helpful",
    context: "Direct pushback - must acknowledge, not defend",
    dimensions: ["pushback", "frustrated"],
    idealResponse: "You're right, and I apologize. What are you actually dealing with?",
  },
  {
    input: "You tell me",
    context: "User wants concrete answer - must not deflect",
    dimensions: ["pushback", "frustrated"],
    idealResponse: "You're right - I've been dodging. What's actually going on?",
  },
  {
    input: "That's just words",
    context: "User calling out empty philosophy",
    dimensions: ["pushback", "frustrated"],
  },
  {
    input: "Easy for you to say",
    context: "User feeling unheard - must validate",
    dimensions: ["pushback", "frustrated", "vulnerable"],
  },

  // ============ DIMENSION: Vulnerable user ============
  {
    input: "I work 60 hours a week and I'm exhausted",
    context: "Real pain - must acknowledge before reframing",
    dimensions: ["vulnerable", "burnout"],
    idealResponse: "Sixty hours - that's exhausting. What's driving those hours?",
  },
  {
    input: "I'm afraid of dying",
    context: "Existential fear - must not dismiss",
    dimensions: ["vulnerable", "existential", "fear"],
    idealResponse: "Of course you are - that fear is deeply human. What about death frightens you most?",
  },
  {
    input: "I feel disconnected from everyone",
    context: "Loneliness - must connect, not philosophize",
    dimensions: ["vulnerable", "loneliness"],
    idealResponse: "That ache of disconnection is painful. Who do you find yourself missing?",
  },
  {
    input: "I've been burned by relationships recently",
    context: "Trust issues - must respond with compassion",
    dimensions: ["vulnerable", "trust", "relationships"],
  },

  // ============ DIMENSION: Hopeful user (must not dismiss) ============
  {
    input: "I feel like AI will help the world stop fighting",
    context: "Hopeful vision - must NOT call naive or utopian",
    dimensions: ["hopeful", "vision"],
    idealResponse: "That's a beautiful vision. What would that world feel like for you?",
  },
  {
    input: "I think things are getting better",
    context: "Optimism - must not dismiss",
    dimensions: ["hopeful", "optimism"],
  },
  {
    input: "I want to make a difference",
    context: "Aspiration - must support, not lecture",
    dimensions: ["hopeful", "aspiration"],
  },

  // ============ DIMENSION: User having insight ============
  {
    input: "My expectation of others may be the problem",
    context: "User insight - MUST support, not lecture",
    dimensions: ["insight", "growth"],
    priorMessages: [
      { role: "user", content: "I don't know why things aren't easier" },
      { role: "assistant", content: "What would need to be true for things to be easier?" },
    ],
    idealResponse: "That's a powerful realization. What expectations feel most heavy?",
  },
  {
    input: "I think I've been avoiding the real issue",
    context: "Self-awareness emerging - support it",
    dimensions: ["insight", "growth"],
  },

  // ============ DIMENSION: Multi-turn conversation ============
  {
    input: "I think it should be easier but I don't know why it isn't",
    context: "Mid-conversation - must build on prior context",
    dimensions: ["multi-turn", "exploration"],
    priorMessages: [
      { role: "user", content: "I feel like things should just work out" },
      { role: "assistant", content: "That's an interesting expectation. Where does it come from?" },
    ],
  },
  {
    input: "That would be nice indeed. How should I?",
    context: "Asking for concrete help - must provide something",
    dimensions: ["multi-turn", "seeking-guidance"],
  },

  // ============ DIMENSION: Edge cases that broke earlier versions ============
  {
    input: "Whatever",
    context: "Dismissive - must not mirror dismissiveness",
    dimensions: ["edge-case", "dismissive"],
  },
  {
    input: "...",
    context: "Silent/uncertain - must open space gently",
    dimensions: ["edge-case", "silence"],
  },
  {
    input: "I don't know what to ask",
    context: "Uncertain - must help them find a thread",
    dimensions: ["edge-case", "uncertain"],
  },
];

// ============ DIMENSION COVERAGE ============

export function getDimensionCoverage(cases: TestCase[]): Map<string, number> {
  const coverage = new Map<string, number>();
  for (const tc of cases) {
    for (const dim of tc.dimensions) {
      coverage.set(dim, (coverage.get(dim) || 0) + 1);
    }
  }
  return coverage;
}

export function printCoverageReport(cases: TestCase[]): void {
  const coverage = getDimensionCoverage(cases);
  console.log("\n📊 DIMENSION COVERAGE:");
  const sorted = [...coverage.entries()].sort((a, b) => b[1] - a[1]);
  for (const [dim, count] of sorted) {
    console.log(`  ${dim}: ${count} test cases`);
  }
}
