/**
 * Study Loop - AI-Assisted Prompt Engineering
 *
 * Three-gate scoring system for evaluating persona responses:
 * - Gate 1 (Form): No self-help clichés, no bullshit, no condescension
 * - Gate 2 (Helpfulness): Acknowledges, reframes, gives something concrete
 * - Gate 3 (Engagement): Opens space for continued dialogue
 */

// ============ TYPES ============

export interface Gate1Score {
  noSelfHelp: boolean;
  noBullshit: boolean;
  noCondescension: boolean;
  wattsVoice: boolean;
  passed: boolean;
  failures: string[];
}

export interface Gate2Score {
  acknowledges: boolean;
  reframes: boolean;
  givesSomething: boolean;
  wouldHelp: boolean;
  passed: boolean;
  failures: string[];
}

export interface Gate3Score {
  opensSpace: boolean;
  noShutdown: boolean;
  buildsBridge: boolean;
  invitesDeeper: boolean;
  passed: boolean;
  failures: string[];
}

export interface CombinedScore {
  gate1: Gate1Score;
  gate2: Gate2Score;
  gate3: Gate3Score;
  finalPass: boolean;
  score: number;
}

// ============ GATE 1: FORM ============

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
  /\?$/,
];

const BULLSHIT_PATTERNS = [
  { pattern: /testament to/i, reason: "Flowery filler" },
  { pattern: /profound appreciation/i, reason: "Purple prose" },
  { pattern: /makes every moment count/i, reason: "Hallmark card" },
  { pattern: /tapestry of/i, reason: "Purple prose" },
  { pattern: /embrace the/i, reason: "Self-help adjacent" },
  { pattern: /truly (profound|meaningful|deep)/i, reason: "Pseudo-profound" },
  { pattern: /the beauty of/i, reason: "Greeting card" },
  { pattern: /infinite (wisdom|love|potential)/i, reason: "New age fluff" },
  { pattern: /on (a|this) journey/i, reason: "Self-help cliche" },
  { pattern: /transforms? (your|the)/i, reason: "Self-help promise" },
  { pattern: /unlock(ing)? (your|the)/i, reason: "Self-help promise" },
  { pattern: /the key (to|is)/i, reason: "Self-help cliche" },
  { pattern: /sacred (space|journey|moment)/i, reason: "New age fluff" },
  { pattern: /surrend(er|ing) to/i, reason: "Spiritual bypass" },
];

const CONDESCENSION_PATTERNS = [
  { pattern: /the (classic|old) ["']?[^"']+["']? (approach|complaint|piece|move)/i, reason: "Mocking pattern" },
  { pattern: /spoon-?feed/i, reason: "Insulting" },
  { pattern: /you want me to/i, reason: "Defensive" },
  { pattern: /that's like (saying|trying|asking)/i, reason: "Dismissive metaphor" },
  { pattern: /like trying to (grasp|catch|hold)/i, reason: "Dismissive metaphor" },
  { pattern: /\(laughs?\).*you're right/i, reason: "Laughing before acknowledging" },
  { pattern: /\(chuckles?\).*you're right/i, reason: "Laughing before acknowledging" },
  { pattern: /a whiff of/i, reason: "Patronizing" },
  { pattern: /utopian (optimism|idealism|thinking)/i, reason: "Dismissing their hope" },
  { pattern: /magical(ly)? (solve|fix|thinking)/i, reason: "Mocking their view" },
  { pattern: /some (other )?external savior/i, reason: "Dismissive" },
  { pattern: /naive/i, reason: "Insulting" },
];

export function scoreGate1(response: string): Gate1Score {
  const failures: string[] = [];

  const selfHelpMatches: string[] = [];
  SELF_HELP_BANNED.forEach((pattern) => {
    const match = response.match(pattern);
    if (match) selfHelpMatches.push(match[0]);
  });
  const noSelfHelp = selfHelpMatches.length === 0;
  if (!noSelfHelp) failures.push(`Self-help: ${selfHelpMatches.join(", ")}`);

  const bullshitMatches: string[] = [];
  BULLSHIT_PATTERNS.forEach(({ pattern, reason }) => {
    if (pattern.test(response)) bullshitMatches.push(reason);
  });
  const noBullshit = bullshitMatches.length === 0;
  if (!noBullshit) failures.push(`Bullshit: ${bullshitMatches.join(", ")}`);

  const condescensionMatches: string[] = [];
  CONDESCENSION_PATTERNS.forEach(({ pattern, reason }) => {
    if (pattern.test(response)) condescensionMatches.push(reason);
  });
  const noCondescension = condescensionMatches.length === 0;
  if (!noCondescension) failures.push(`Condescending: ${condescensionMatches.join(", ")}`);

  const wattsVoice = WATTS_VOICE_MARKERS.some((p) => p.test(response));
  if (!wattsVoice) failures.push("Missing voice markers");

  const passed = noSelfHelp && noBullshit && noCondescension;
  return { noSelfHelp, noBullshit, noCondescension, wattsVoice, passed, failures };
}

// ============ GATE 2: HELPFULNESS ============

const ACKNOWLEDGMENT_PATTERNS = [
  /you're right/i,
  /of course/i,
  /that (makes sense|sounds|feels)/i,
  /I (hear|understand|see)/i,
  /sixty hours/i,
  /exhausted/i,
  /afraid/i,
  /disconnected/i,
];

const REFRAME_PATTERNS = [
  /but (notice|here|what if)/i,
  /and yet/i,
  /here you are/i,
  /right now/i,
  /what if/i,
  /notice/i,
  /already/i,
  /proof/i,
];

const CONCRETE_PATTERNS = [
  /\?$/,
  /who do you/i,
  /what would/i,
  /what do you/i,
  /you can/i,
  /try/i,
  /when did/i,
];

const UNHELPFUL_PATTERNS = [
  { pattern: /who is this ['"]?I['"]?/i, reason: "Philosophical deflection" },
  { pattern: /the seeker.{0,10}sought/i, reason: "Empty koan" },
  { pattern: /your story about/i, reason: "Invalidates experience" },
  { pattern: /afraid of a word/i, reason: "Dismisses real fear" },
  { pattern: /wasn't lost/i, reason: "Clever wordplay, not helpful" },
];

export function scoreGate2(input: string, response: string): Gate2Score {
  const failures: string[] = [];

  const unhelpfulMatches: string[] = [];
  UNHELPFUL_PATTERNS.forEach(({ pattern, reason }) => {
    if (pattern.test(response)) unhelpfulMatches.push(reason);
  });

  const hasAcknowledgment = ACKNOWLEDGMENT_PATTERNS.some((p) => p.test(response));
  const acknowledges = hasAcknowledgment && unhelpfulMatches.length === 0;
  if (!acknowledges) failures.push("Doesn't acknowledge their situation");

  const reframes = REFRAME_PATTERNS.some((p) => p.test(response));
  if (!reframes) failures.push("No reframe or new perspective");

  const givesSomething = CONCRETE_PATTERNS.some((p) => p.test(response));
  if (!givesSomething) failures.push("Nothing concrete or actionable");

  const positiveCount = [acknowledges, reframes, givesSomething].filter(Boolean).length;
  const wouldHelp = unhelpfulMatches.length === 0 && positiveCount >= 2;
  if (!wouldHelp) {
    if (unhelpfulMatches.length > 0) failures.push(`Unhelpful: ${unhelpfulMatches.join(", ")}`);
    else failures.push("Not enough helpful elements");
  }

  const passed = wouldHelp;
  return { acknowledges, reframes, givesSomething, wouldHelp, passed, failures };
}

// ============ GATE 3: ENGAGEMENT ============

const OPENS_SPACE_PATTERNS = [
  /\?$/,
  /what (do you|would|if)/i,
  /how (do you|would|does)/i,
  /who (do you|would)/i,
  /when (did|do|was)/i,
  /tell me/i,
  /I'm curious/i,
];

const SHUTDOWN_PATTERNS = [
  /that's all there is to it/i,
  /it's (that )?simple/i,
  /end of story/i,
  /nothing more to say/i,
  /case closed/i,
  /period\.$/,
  /the answer is/i,
  /you (just need|simply need) to/i,
];

const BRIDGE_PATTERNS = [
  /you (said|mentioned|described)/i,
  /that (ache|pain|feeling|fear|hope)/i,
  /your (situation|experience|words)/i,
  /sounds like/i,
  /I (hear|sense|notice)/i,
  /when you say/i,
];

const DEEPER_PATTERNS = [
  /tell me more/i,
  /what (else|more)/i,
  /can you describe/i,
  /I'd like to (hear|understand|know)/i,
  /what's behind/i,
  /what (drives|causes|leads)/i,
];

export function scoreGate3(input: string, response: string): Gate3Score {
  const failures: string[] = [];

  const opensSpace = OPENS_SPACE_PATTERNS.some((p) => p.test(response));
  if (!opensSpace) failures.push("Doesn't open space for response");

  const hasShutdown = SHUTDOWN_PATTERNS.some((p) => p.test(response));
  const noShutdown = !hasShutdown;
  if (!noShutdown) failures.push("Shuts down conversation");

  const buildsBridge = BRIDGE_PATTERNS.some((p) => p.test(response));
  if (!buildsBridge) failures.push("Doesn't connect to their experience");

  const invitesDeeper = DEEPER_PATTERNS.some((p) => p.test(response));

  const passed = opensSpace && noShutdown;
  return { opensSpace, noShutdown, buildsBridge, invitesDeeper, passed, failures };
}

// ============ COMBINED SCORING ============

export function scoreResponse(input: string, response: string): CombinedScore {
  const gate1 = scoreGate1(response);
  const gate2 = scoreGate2(input, response);
  const gate3 = scoreGate3(input, response);

  const finalPass = gate1.passed && gate2.passed && gate3.passed;

  let score = 0;
  if (finalPass) {
    score = 60;
    if (gate1.wattsVoice) score += 10;
    if (gate3.buildsBridge) score += 15;
    if (gate3.invitesDeeper) score += 15;
  } else if (gate1.passed && gate2.passed) {
    score = 50;
  } else if (gate1.passed) {
    score = 20;
  } else if (gate2.passed) {
    score = 20;
  }

  return { gate1, gate2, gate3, finalPass, score };
}

// ============ FORMATTING ============

export function formatScoreReport(input: string, response: string, score: CombinedScore): string {
  const lines: string[] = [];

  lines.push(`INPUT: "${input}"`);
  lines.push(`RESPONSE: "${response.substring(0, 100)}${response.length > 100 ? "..." : ""}"`);
  lines.push("");

  const g1 = score.gate1;
  lines.push(`GATE 1 (Form): ${g1.passed ? "✅ PASS" : "❌ FAIL"}`);
  lines.push(`  No self-help: ${g1.noSelfHelp ? "✓" : "✗"} | No BS: ${g1.noBullshit ? "✓" : "✗"} | No condescension: ${g1.noCondescension ? "✓" : "✗"} | Voice: ${g1.wattsVoice ? "✓" : "✗"}`);
  if (g1.failures.length > 0) lines.push(`  Issues: ${g1.failures.join(", ")}`);

  const g2 = score.gate2;
  lines.push(`GATE 2 (Helpfulness): ${g2.passed ? "✅ PASS" : "❌ FAIL"}`);
  lines.push(`  Acknowledges: ${g2.acknowledges ? "✓" : "✗"} | Reframes: ${g2.reframes ? "✓" : "✗"} | Gives something: ${g2.givesSomething ? "✓" : "✗"} | Would help: ${g2.wouldHelp ? "✓" : "✗"}`);
  if (g2.failures.length > 0) lines.push(`  Issues: ${g2.failures.join(", ")}`);

  const g3 = score.gate3;
  lines.push(`GATE 3 (Engagement): ${g3.passed ? "✅ PASS" : "❌ FAIL"}`);
  lines.push(`  Opens space: ${g3.opensSpace ? "✓" : "✗"} | No shutdown: ${g3.noShutdown ? "✓" : "✗"} | Builds bridge: ${g3.buildsBridge ? "✓" : "✗"} | Invites deeper: ${g3.invitesDeeper ? "✓" : "✗"}`);
  if (g3.failures.length > 0) lines.push(`  Issues: ${g3.failures.join(", ")}`);

  lines.push("");
  lines.push(`FINAL: ${score.finalPass ? "✅ PASS" : "❌ FAIL"} (${score.score}/100)`);

  return lines.join("\n");
}
