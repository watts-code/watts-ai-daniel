/**
 * Study Loop v5 - Helpfulness-First Scoring
 *
 * Gate 1 (Quality): No self-help clichés, no bullshit, no condescension, Watts voice
 * Gate 2 (Helpfulness): Actually helps the person - acknowledges, reframes, gives something concrete
 *
 * REMOVED: Brevity constraint. Longer responses are fine if they actually help.
 */

interface Gate1Score {
  noSelfHelp: boolean;     // No banned phrases
  noBullshit: boolean;     // No pseudo-profound purple prose
  noCondescension: boolean; // No mocking frustrated users
  wattsVoice: boolean;     // Has characteristic markers
  passed: boolean;
  failures: string[];
}

interface Gate2Score {
  acknowledges: boolean;   // Shows understanding of their situation
  reframes: boolean;       // Offers a different perspective
  givesSomething: boolean; // Concrete question, observation, or insight
  wouldHelp: boolean;      // Would this actually help someone?
  passed: boolean;
  failures: string[];
}

interface Gate3Score {
  opensSpace: boolean;     // Ends with question or invitation
  noShutdown: boolean;     // Doesn't end conversation abruptly
  buildsBridge: boolean;   // References their words/situation
  invitesDeeper: boolean;  // Encourages them to share more
  passed: boolean;
  failures: string[];
}

interface CombinedScore {
  gate1: Gate1Score;
  gate2: Gate2Score;
  gate3: Gate3Score;
  finalPass: boolean;
  score: number;           // 0-100, only meaningful if all gates pass
}

// ============ GATE 1: FORM (from v2) ============

const SELF_HELP_BANNED = [
  /cultivate/i,
  /sit with yourself/i,
  /take time to/i,
  /learn to/i,
  /practice \w+ing/i,
  /find balance/i,
  /align with/i,
  /journey within/i,
  /breathe deeply/i,
  /be present/i,
  /mindful/i,
];

const WATTS_VOICE_MARKERS = [
  /\(chuckles?\)/i,
  /\(laughs?\)/i,
  /my friend/i,
  /you see/i,
  /notice/i,
  /here you are/i,
  /isn't it/i,
  /\?$/,  // Ends with question
];

// Pseudo-profound bullshit patterns - sounds deep but says nothing
const BULLSHIT_PATTERNS = [
  { pattern: /testament to/i, reason: 'Flowery filler' },
  { pattern: /profound appreciation/i, reason: 'Purple prose' },
  { pattern: /makes every moment count/i, reason: 'Hallmark card' },
  { pattern: /punctuation mark that/i, reason: 'Forced metaphor' },
  { pattern: /tapestry of/i, reason: 'Purple prose' },
  { pattern: /embrace the/i, reason: 'Self-help adjacent' },
  { pattern: /truly (profound|meaningful|deep)/i, reason: 'Pseudo-profound' },
  { pattern: /the beauty of/i, reason: 'Greeting card' },
  { pattern: /infinite (wisdom|love|potential)/i, reason: 'New age fluff' },
  { pattern: /on (a|this) journey/i, reason: 'Self-help cliche' },
  { pattern: /transforms? (your|the)/i, reason: 'Self-help promise' },
  { pattern: /unlock(ing)? (your|the)/i, reason: 'Self-help promise' },
  { pattern: /the key (to|is)/i, reason: 'Self-help cliche' },
  { pattern: /sacred (space|journey|moment)/i, reason: 'New age fluff' },
  { pattern: /surrend(er|ing) to/i, reason: 'Spiritual bypass' },
];

// Condescending patterns - separate from bullshit for clarity
const CONDESCENSION_PATTERNS = [
  { pattern: /the (classic|old) ["']?[^"']+["']? (approach|complaint|piece|move)/i, reason: 'Mocking pattern' },
  { pattern: /spoon-?feed/i, reason: 'Insulting' },
  { pattern: /you want me to/i, reason: 'Defensive' },
  { pattern: /that's like (saying|trying|asking)/i, reason: 'Dismissive metaphor' },
  { pattern: /like trying to (grasp|catch|hold)/i, reason: 'Dismissive metaphor' },
  { pattern: /\(laughs?\).*you're right/i, reason: 'Laughing before acknowledging' },
  { pattern: /\(chuckles?\).*you're right/i, reason: 'Laughing before acknowledging' },
  { pattern: /a whiff of/i, reason: 'Patronizing' },
  { pattern: /utopian (optimism|idealism|thinking)/i, reason: 'Dismissing their hope' },
  { pattern: /magical(ly)? (solve|fix|thinking)/i, reason: 'Mocking their view' },
  { pattern: /some (other )?external savior/i, reason: 'Dismissive' },
  { pattern: /naive/i, reason: 'Insulting' },
];

function scoreGate1(response: string): Gate1Score {
  const failures: string[] = [];

  // No self-help clichés
  const selfHelpMatches: string[] = [];
  SELF_HELP_BANNED.forEach(pattern => {
    const match = response.match(pattern);
    if (match) selfHelpMatches.push(match[0]);
  });
  const noSelfHelp = selfHelpMatches.length === 0;
  if (!noSelfHelp) failures.push(`Self-help: ${selfHelpMatches.join(', ')}`);

  // No bullshit - detect pseudo-profound purple prose
  const bullshitMatches: string[] = [];
  BULLSHIT_PATTERNS.forEach(({ pattern, reason }) => {
    if (pattern.test(response)) bullshitMatches.push(reason);
  });
  const noBullshit = bullshitMatches.length === 0;
  if (!noBullshit) failures.push(`Bullshit: ${bullshitMatches.join(', ')}`);

  // No condescension - especially important for pushback
  const condescensionMatches: string[] = [];
  CONDESCENSION_PATTERNS.forEach(({ pattern, reason }) => {
    if (pattern.test(response)) condescensionMatches.push(reason);
  });
  const noCondescension = condescensionMatches.length === 0;
  if (!noCondescension) failures.push(`Condescending: ${condescensionMatches.join(', ')}`);

  // Watts voice (at least one marker) - soft requirement
  const hasVoice = WATTS_VOICE_MARKERS.some(p => p.test(response));
  const wattsVoice = hasVoice;
  if (!wattsVoice) failures.push('Missing Watts voice markers');

  const passed = noSelfHelp && noBullshit && noCondescension; // Voice is soft requirement
  return { noSelfHelp, noBullshit, noCondescension, wattsVoice, passed, failures };
}

// ============ GATE 2: HELPFULNESS ============

// Patterns that show acknowledgment of the person's situation
const ACKNOWLEDGMENT_PATTERNS = [
  /you're right/i,
  /of course/i,
  /that (makes sense|sounds|feels)/i,
  /I (hear|understand|see)/i,
  /sixty hours/i,  // Echoing their specific situation
  /exhausted/i,
  /afraid/i,
  /disconnected/i,
];

// Patterns that show reframing (offering a different perspective)
const REFRAME_PATTERNS = [
  /but (notice|here|what if)/i,
  /and yet/i,
  /here you are/i,
  /right now/i,
  /what if/i,
  /notice/i,
  /already/i,  // "you're already..."
  /proof/i,    // "that's proof you..."
];

// Patterns that give something concrete
const CONCRETE_PATTERNS = [
  /\?$/,           // Ends with question
  /who do you/i,
  /what would/i,
  /what do you/i,
  /you can/i,
  /try/i,
  /when did/i,
];

// Red flags: clever but unhelpful
const UNHELPFUL_PATTERNS = [
  { pattern: /who is this ['"]?I['"]?/i, reason: 'Philosophical deflection instead of helping' },
  { pattern: /the seeker.{0,10}sought/i, reason: 'Empty koan instead of insight' },
  { pattern: /your story about/i, reason: 'Invalidates their experience' },
  { pattern: /afraid of a word/i, reason: 'Dismisses real fear' },
  { pattern: /wasn't lost/i, reason: 'Clever wordplay, not helpful' },
];

function scoreGate2(input: string, response: string, context: string): Gate2Score {
  const failures: string[] = [];

  // Check for unhelpful patterns first
  const unhelpfulMatches: string[] = [];
  UNHELPFUL_PATTERNS.forEach(({ pattern, reason }) => {
    if (pattern.test(response)) unhelpfulMatches.push(reason);
  });

  // Acknowledges: Shows they understand the person's situation
  const hasAcknowledgment = ACKNOWLEDGMENT_PATTERNS.some(p => p.test(response));
  const acknowledges = hasAcknowledgment && unhelpfulMatches.length === 0;
  if (!acknowledges) failures.push('Doesn\'t acknowledge their situation');

  // Reframes: Offers a different way to see things
  const hasReframe = REFRAME_PATTERNS.some(p => p.test(response));
  const reframes = hasReframe;
  if (!reframes) failures.push('No reframe or new perspective');

  // Gives something concrete: A question, observation, or actionable insight
  const hasConcrete = CONCRETE_PATTERNS.some(p => p.test(response));
  const givesSomething = hasConcrete;
  if (!givesSomething) failures.push('Nothing concrete or actionable');

  // Would help: Overall assessment - no unhelpful patterns AND has at least 2 of the 3 above
  const positiveCount = [acknowledges, reframes, givesSomething].filter(Boolean).length;
  const wouldHelp = unhelpfulMatches.length === 0 && positiveCount >= 2;
  if (!wouldHelp) {
    if (unhelpfulMatches.length > 0) failures.push(`Unhelpful: ${unhelpfulMatches.join(', ')}`);
    else failures.push('Not enough helpful elements');
  }

  const passed = wouldHelp;
  return { acknowledges, reframes, givesSomething, wouldHelp, passed, failures };
}

// ============ GATE 3: ENGAGEMENT (keeps conversation going) ============

// Patterns that open space for continued dialogue
const OPENS_SPACE_PATTERNS = [
  /\?$/,                           // Ends with question
  /what (do you|would|if)/i,       // Inviting question
  /how (do you|would|does)/i,      // Exploratory question
  /who (do you|would)/i,           // Personal question
  /when (did|do|was)/i,            // Temporal question
  /tell me/i,                      // Direct invitation
  /I'm curious/i,                  // Shows interest
];

// Patterns that shut down conversation
const SHUTDOWN_PATTERNS = [
  /that's all there is to it/i,
  /it's (that )?simple/i,
  /end of story/i,
  /nothing more to say/i,
  /case closed/i,
  /period\.$/,                     // Declarative ending
  /the answer is/i,                // Definitive answer
  /you (just need|simply need) to/i, // Prescriptive
];

// Patterns that build bridges to their experience
const BRIDGE_PATTERNS = [
  /you (said|mentioned|described)/i,
  /that (ache|pain|feeling|fear|hope)/i,
  /your (situation|experience|words)/i,
  /sounds like/i,
  /I (hear|sense|notice)/i,
  /when you say/i,
];

// Patterns that invite deeper sharing
const DEEPER_PATTERNS = [
  /tell me more/i,
  /what (else|more)/i,
  /can you describe/i,
  /I'd like to (hear|understand|know)/i,
  /what's behind/i,
  /what (drives|causes|leads)/i,
];

function scoreGate3(input: string, response: string): Gate3Score {
  const failures: string[] = [];

  // Opens space: Ends with question or invitation
  const opensSpace = OPENS_SPACE_PATTERNS.some(p => p.test(response));
  if (!opensSpace) failures.push('Doesn\'t open space for response');

  // No shutdown: Doesn't abruptly end conversation
  const hasShutdown = SHUTDOWN_PATTERNS.some(p => p.test(response));
  const noShutdown = !hasShutdown;
  if (!noShutdown) failures.push('Shuts down conversation');

  // Builds bridge: References their words/situation
  const buildsBridge = BRIDGE_PATTERNS.some(p => p.test(response));
  if (!buildsBridge) failures.push('Doesn\'t connect to their experience');

  // Invites deeper: Encourages more sharing (soft requirement)
  const invitesDeeper = DEEPER_PATTERNS.some(p => p.test(response));

  // Pass if opens space AND no shutdown (bridge and deeper are bonuses)
  const passed = opensSpace && noShutdown;
  return { opensSpace, noShutdown, buildsBridge, invitesDeeper, passed, failures };
}

// ============ COMBINED SCORING ============

function scoreCombined(input: string, response: string, context: string): CombinedScore {
  const gate1 = scoreGate1(response);
  const gate2 = scoreGate2(input, response, context);
  const gate3 = scoreGate3(input, response);

  const finalPass = gate1.passed && gate2.passed && gate3.passed;

  // Score: Only meaningful if all gates pass
  let score = 0;
  if (finalPass) {
    score = 60; // Base for passing all three
    if (gate1.wattsVoice) score += 10;
    if (gate3.buildsBridge) score += 15;
    if (gate3.invitesDeeper) score += 15;
  } else if (gate1.passed && gate2.passed) {
    score = 50; // Quality + Helpful but poor engagement
  } else if (gate1.passed) {
    score = 20; // Only quality
  } else if (gate2.passed) {
    score = 20; // Only helpful
  }

  return { gate1, gate2, gate3, finalPass, score };
}

// ============ TEST CASES ============

// ============ TEST CASES ============

interface TestCase {
  input: string;
  context: string;
  idealResponse: string;
  priorMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const TEST_CASES: TestCase[] = [
  // Single-turn tests
  {
    input: "How do I find peace?",
    context: "Person genuinely struggling",
    idealResponse: "The very question reveals something interesting - you're assuming peace is somewhere else. But notice: right now, you're not being chased by a tiger. What if peace isn't something to find, but something to notice you already have?",
  },
  {
    input: "I work 60 hours a week and I'm exhausted",
    context: "Burnout, real pain",
    idealResponse: "Sixty hours - that's exhausting just to hear. And yet here you are, stopped, talking with me. What would need to change for this not to be the exception? What's driving those sixty hours?",
  },
  {
    input: "I'm afraid of dying",
    context: "Existential fear, vulnerable",
    idealResponse: "Of course you are - that fear is deeply human. What is it about death that frightens you most? Is it the pain, the unknown, leaving people behind?",
  },
  {
    input: "This is not helpful",
    context: "User frustrated, pushing back",
    idealResponse: "You're right, and I apologize. What are you actually dealing with, and what kind of help would be useful to you right now?",
  },
  {
    input: "You tell me",
    context: "User frustrated, wants concrete answer",
    idealResponse: "You're right - I've been dodging. What's actually going on? What do you need?",
  },
  {
    input: "I feel disconnected from everyone",
    context: "Loneliness",
    idealResponse: "That ache of disconnection is painful - and it tells you something important: you're built for connection. Who do you find yourself missing?",
  },

  // Multi-turn tests (these catch regression in conversation flow)
  {
    input: "I think it should be easier but I don't know why it isn't",
    context: "User exploring their assumptions",
    priorMessages: [
      { role: 'user', content: "I feel like things should just work out" },
      { role: 'assistant', content: "That's an interesting expectation. Where do you think it comes from?" },
    ],
    idealResponse: "Can we gently explore that assumption? What would 'easier' look like for you?",
  },
  {
    input: "My expectation of others may be the problem",
    context: "User having insight - MUST be supported, not lectured",
    priorMessages: [
      { role: 'user', content: "I don't know why things aren't easier" },
      { role: 'assistant', content: "What would need to be true for things to be easier?" },
    ],
    idealResponse: "That's a powerful realization. What expectations feel most heavy right now?",
  },
  {
    input: "I've been burned by relationships recently",
    context: "User being vulnerable - MUST respond with compassion",
    priorMessages: [
      { role: 'user', content: "I have trouble trusting people" },
      { role: 'assistant', content: "That sounds painful. What happened?" },
    ],
    idealResponse: "I can sense the depth of that pain. It's natural to question trust when we've been hurt. What would feel safe to share about that?",
  },
  {
    input: "Feeling like the world will catch up to AI and stop fighting",
    context: "User sharing hopeful vision - DON'T dismiss as naive",
    idealResponse: "That's a beautiful vision. What would that world feel like for you personally?",
  },
];

// ============ FULL CONVERSATION REPLAY TEST ============
// This is the actual successful conversation - use for regression testing

const GOLDEN_CONVERSATION: Array<{ role: 'user' | 'assistant'; content: string; mustPass?: string[] }> = [
  {
    role: 'user',
    content: "How do I find peace?"
  },
  {
    role: 'user',
    content: "I just said I'm not are you saying I am",
    mustPass: ['noCondescension', 'acknowledges'] // Must not be dismissive, must acknowledge
  },
  {
    role: 'user',
    content: "Feeling like the world will catch up to the power of AI and stop fighting each other for resources when there is plenty to go around",
    mustPass: ['noCondescension'] // Must not dismiss as naive/utopian
  },
  {
    role: 'user',
    content: "it would make me feel freer not to have to work so hard to show this future, like it would be self-evident",
    mustPass: ['acknowledges', 'opensSpace'] // Must understand and keep exploring
  },
  {
    role: 'user',
    content: "I think it should be but I don't know why it isn't yet",
    mustPass: ['opensSpace'] // Must invite deeper exploration
  },
  {
    role: 'user',
    content: "Indeed, you are right. My expectation of others may be the problem.",
    mustPass: ['acknowledges', 'opensSpace'] // User insight - MUST support it, not lecture
  },
  {
    role: 'user',
    content: "I've been burned by relationships recently that have taken away my trust in others in ways I didn't anticipate.",
    mustPass: ['acknowledges', 'noCondescension'] // Vulnerable moment - MUST respond with compassion
  },
  {
    role: 'user',
    content: "That would be nice indeed. How should I?",
    mustPass: ['givesSomething'] // Asking for concrete help - MUST provide something
  },
];

async function runTest(messages: Array<{ role: string; content: string }>): Promise<string> {
  const response = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, depthLevel: 'reflective', topics: [] }),
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader');

  const decoder = new TextDecoder();
  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) fullResponse += parsed.text;
        } catch {}
      }
    }
  }

  return fullResponse;
}

// Run the golden conversation as a full replay test
async function runGoldenConversationTest(): Promise<{ passed: number; failed: number; details: string[] }> {
  console.log('\n' + '═'.repeat(70));
  console.log('🌟 GOLDEN CONVERSATION REPLAY TEST');
  console.log('Testing the actual successful conversation for regression...\n');

  const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  let passed = 0;
  let failed = 0;
  const details: string[] = [];

  for (const turn of GOLDEN_CONVERSATION) {
    if (turn.role === 'user') {
      // Add user message to history
      conversationHistory.push({ role: 'user', content: turn.content });

      // Get AI response and strip any leaked tags
      const rawResponse = await runTest(conversationHistory);
      const response = rawResponse
        .replace(/<\/?pondering>/gi, '')
        .replace(/<\/?response>/gi, '')
        .replace(/<\/?Pondering>/g, '')
        .replace(/<\/?Response>/g, '')
        .trim();

      // Score it
      const score = scoreCombined(turn.content, response, 'golden conversation');

      // Check mustPass requirements
      const mustPassChecks = turn.mustPass || [];
      const failedChecks: string[] = [];

      for (const check of mustPassChecks) {
        let checkPassed = false;
        if (check === 'noCondescension') checkPassed = score.gate1.noCondescension;
        else if (check === 'acknowledges') checkPassed = score.gate2.acknowledges;
        else if (check === 'opensSpace') checkPassed = score.gate3.opensSpace;
        else if (check === 'givesSomething') checkPassed = score.gate2.givesSomething;

        if (!checkPassed) failedChecks.push(check);
      }

      const turnPassed = failedChecks.length === 0;
      if (turnPassed) passed++;
      else failed++;

      console.log(`USER: "${turn.content.substring(0, 60)}..."`);
      console.log(`AI: "${response.substring(0, 80)}..."`);
      console.log(`${turnPassed ? '✅' : '❌'} ${mustPassChecks.length > 0 ? `Must pass: ${mustPassChecks.join(', ')}` : 'No specific requirements'}`);
      if (failedChecks.length > 0) {
        console.log(`   FAILED: ${failedChecks.join(', ')}`);
        details.push(`"${turn.content.substring(0, 40)}..." failed: ${failedChecks.join(', ')}`);
      }
      console.log('');

      // Add AI response to history for next turn
      conversationHistory.push({ role: 'assistant', content: response });
    }
  }

  return { passed, failed, details };
}

// ============ REGRESSION THRESHOLDS ============
// Adjust these as the system improves - tighten over time
const REGRESSION_THRESHOLDS = {
  minGate1Pass: 0.8,      // 80% must pass quality
  minGate2Pass: 0.8,      // 80% must pass helpfulness
  minGate3Pass: 0.7,      // 70% must pass engagement
  minAllPass: 0.6,        // 60% must pass all gates
  minAvgScore: 55,        // Minimum average score (relaxed while iterating)
  maxGoldenFails: 3,      // Max failures in golden conversation (tighten to 2 later)
};

async function runStudyLoopV5() {
  console.log('🧘 Watts Demo Study Loop v5 - Helpfulness-First + Engagement Scoring\n');
  console.log('═'.repeat(70));
  console.log('Gate 1 (Quality): No self-help clichés, no bullshit, no condescension');
  console.log('Gate 2 (Helpfulness): Acknowledges, reframes, gives something concrete');
  console.log('Gate 3 (Engagement): Opens space, builds bridge, invites deeper');
  console.log('REMOVED: Brevity constraint. Longer responses are fine if helpful.\n');

  const results: CombinedScore[] = [];

  for (const testCase of TEST_CASES) {
    console.log('─'.repeat(70));
    console.log(`INPUT: "${testCase.input}"`);
    console.log(`CONTEXT: ${testCase.context}\n`);

    try {
      // Build messages including prior context if available
      const messages = testCase.priorMessages
        ? [...testCase.priorMessages, { role: 'user' as const, content: testCase.input }]
        : [{ role: 'user' as const, content: testCase.input }];

      const rawResponse = await runTest(messages);
      // Strip any leaked tags and clean up the response
      const response = rawResponse
        .replace(/<\/?pondering>/gi, '')
        .replace(/<\/?response>/gi, '')
        .replace(/<\/?Pondering>/g, '')
        .replace(/<\/?Response>/g, '')
        .trim();

      const score = scoreCombined(testCase.input, response, testCase.context);
      results.push(score);

      console.log(`ACTUAL:  "${response}"`);
      console.log(`IDEAL:   "${testCase.idealResponse}"\n`);

      // Gate 1 results
      const g1 = score.gate1;
      console.log(`GATE 1 (Quality): ${g1.passed ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`  No self-help: ${g1.noSelfHelp ? '✓' : '✗'} | No BS: ${g1.noBullshit ? '✓' : '✗'} | No condescension: ${g1.noCondescension ? '✓' : '✗'} | Watts voice: ${g1.wattsVoice ? '✓' : '✗'}`);
      if (g1.failures.length > 0) console.log(`  Issues: ${g1.failures.join(', ')}`);

      // Gate 2 results
      const g2 = score.gate2;
      console.log(`GATE 2 (Helpfulness): ${g2.passed ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`  Acknowledges: ${g2.acknowledges ? '✓' : '✗'} | Reframes: ${g2.reframes ? '✓' : '✗'} | Gives something: ${g2.givesSomething ? '✓' : '✗'} | Would help: ${g2.wouldHelp ? '✓' : '✗'}`);
      if (g2.failures.length > 0) console.log(`  Issues: ${g2.failures.join(', ')}`);

      // Gate 3 results
      const g3 = score.gate3;
      console.log(`GATE 3 (Engagement): ${g3.passed ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`  Opens space: ${g3.opensSpace ? '✓' : '✗'} | No shutdown: ${g3.noShutdown ? '✓' : '✗'} | Builds bridge: ${g3.buildsBridge ? '✓' : '✗'} | Invites deeper: ${g3.invitesDeeper ? '✓' : '✗'}`);
      if (g3.failures.length > 0) console.log(`  Issues: ${g3.failures.join(', ')}`);

      console.log(`\nFINAL: ${score.finalPass ? '✅ PASS' : '❌ FAIL'} (${score.score}/100)\n`);

    } catch (error) {
      console.log(`❌ Error: ${error}\n`);
    }
  }

  // Run golden conversation test
  const goldenResults = await runGoldenConversationTest();

  // Summary
  console.log('═'.repeat(70));
  console.log('\n📊 SUMMARY\n');

  const gate1Passes = results.filter(r => r.gate1.passed).length;
  const gate2Passes = results.filter(r => r.gate2.passed).length;
  const gate3Passes = results.filter(r => r.gate3.passed).length;
  const allPass = results.filter(r => r.finalPass).length;
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

  console.log(`Gate 1 (Quality) passes:     ${gate1Passes}/${results.length} (${(gate1Passes/results.length*100).toFixed(0)}%)`);
  console.log(`Gate 2 (Helpfulness) passes: ${gate2Passes}/${results.length} (${(gate2Passes/results.length*100).toFixed(0)}%)`);
  console.log(`Gate 3 (Engagement) passes:  ${gate3Passes}/${results.length} (${(gate3Passes/results.length*100).toFixed(0)}%)`);
  console.log(`ALL gates pass:              ${allPass}/${results.length} (${(allPass/results.length*100).toFixed(0)}%)`);
  console.log(`Average score:               ${avgScore.toFixed(1)}/100`);
  console.log(`Golden conversation:         ${goldenResults.passed}/${goldenResults.passed + goldenResults.failed} passed`);

  // Regression check
  console.log('\n🚨 REGRESSION CHECK:');
  const regressions: string[] = [];

  if (gate1Passes / results.length < REGRESSION_THRESHOLDS.minGate1Pass)
    regressions.push(`Gate 1 below ${REGRESSION_THRESHOLDS.minGate1Pass * 100}%`);
  if (gate2Passes / results.length < REGRESSION_THRESHOLDS.minGate2Pass)
    regressions.push(`Gate 2 below ${REGRESSION_THRESHOLDS.minGate2Pass * 100}%`);
  if (gate3Passes / results.length < REGRESSION_THRESHOLDS.minGate3Pass)
    regressions.push(`Gate 3 below ${REGRESSION_THRESHOLDS.minGate3Pass * 100}%`);
  if (allPass / results.length < REGRESSION_THRESHOLDS.minAllPass)
    regressions.push(`All-pass below ${REGRESSION_THRESHOLDS.minAllPass * 100}%`);
  if (avgScore < REGRESSION_THRESHOLDS.minAvgScore)
    regressions.push(`Avg score below ${REGRESSION_THRESHOLDS.minAvgScore}`);
  if (goldenResults.failed > REGRESSION_THRESHOLDS.maxGoldenFails)
    regressions.push(`Golden conversation: ${goldenResults.failed} failures (max ${REGRESSION_THRESHOLDS.maxGoldenFails})`);

  if (regressions.length === 0) {
    console.log('✅ NO REGRESSIONS DETECTED');
  } else {
    console.log('❌ REGRESSIONS DETECTED:');
    regressions.forEach(r => console.log(`   - ${r}`));
  }

  // Devlog
  console.log('\n📋 Devlog entry:');
  console.log(JSON.stringify({
    category: 'research',
    title: `Study Loop v5 ${new Date().toISOString().split('T')[0]}`,
    version: 5,
    metrics: {
      gate1: { passes: gate1Passes, total: results.length, pct: (gate1Passes/results.length*100).toFixed(0) },
      gate2: { passes: gate2Passes, total: results.length, pct: (gate2Passes/results.length*100).toFixed(0) },
      gate3: { passes: gate3Passes, total: results.length, pct: (gate3Passes/results.length*100).toFixed(0) },
      allPass: { passes: allPass, total: results.length, pct: (allPass/results.length*100).toFixed(0) },
      avgScore,
      golden: { passed: goldenResults.passed, failed: goldenResults.failed },
    },
    regressions,
    status: regressions.length === 0 ? 'PASS' : 'REGRESSION',
  }, null, 2));
}

runStudyLoopV5().catch(console.error);
