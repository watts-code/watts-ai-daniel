#!/usr/bin/env npx ts-node
/**
 * Study Loop Runner
 *
 * Usage:
 *   npx ts-node src/run-study-loop.ts                    # Run all test cases
 *   npx ts-node src/run-study-loop.ts --prompt "..."     # Test a single prompt
 *   npx ts-node src/run-study-loop.ts --coverage         # Show dimension coverage
 *   npx ts-node src/run-study-loop.ts --endpoint URL     # Use custom LLM endpoint
 *
 * Environment:
 *   LLM_ENDPOINT - Base URL for chat completions (default: http://localhost:11434/v1)
 *   LLM_MODEL    - Model name (default: llama3)
 */

import { scoreResponse, formatScoreReport, CombinedScore } from "./study-loop";
import { TEST_CASES, printCoverageReport, TestCase } from "./test-cases";
import { WATTS_SYSTEM_PROMPT } from "./prompts";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callLLM(
  messages: Message[],
  endpoint: string,
  model: string
): Promise<string> {
  const response = await fetch(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function runSingleTest(
  input: string,
  endpoint: string,
  model: string,
  priorMessages?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<{ response: string; score: CombinedScore }> {
  const messages: Message[] = [
    { role: "system", content: WATTS_SYSTEM_PROMPT },
  ];

  if (priorMessages) {
    for (const msg of priorMessages) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: "user", content: input });

  const response = await callLLM(messages, endpoint, model);
  const score = scoreResponse(input, response);

  return { response, score };
}

async function runAllTests(endpoint: string, model: string): Promise<void> {
  console.log("🧘 Study Loop - AI-Assisted Prompt Engineering\n");
  console.log("═".repeat(70));
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Model: ${model}`);
  console.log(`Test cases: ${TEST_CASES.length}\n`);

  const results: CombinedScore[] = [];
  const dimensionResults = new Map<string, { pass: number; fail: number }>();

  for (const testCase of TEST_CASES) {
    console.log("─".repeat(70));
    console.log(`INPUT: "${testCase.input}"`);
    console.log(`CONTEXT: ${testCase.context}`);
    console.log(`DIMENSIONS: ${testCase.dimensions.join(", ")}\n`);

    try {
      const { response, score } = await runSingleTest(
        testCase.input,
        endpoint,
        model,
        testCase.priorMessages
      );

      results.push(score);
      console.log(formatScoreReport(testCase.input, response, score));
      console.log("");

      // Track dimension results
      for (const dim of testCase.dimensions) {
        const current = dimensionResults.get(dim) || { pass: 0, fail: 0 };
        if (score.finalPass) current.pass++;
        else current.fail++;
        dimensionResults.set(dim, current);
      }
    } catch (error) {
      console.log(`❌ Error: ${error}\n`);
    }
  }

  // Summary
  console.log("═".repeat(70));
  console.log("\n📊 SUMMARY\n");

  const gate1Passes = results.filter((r) => r.gate1.passed).length;
  const gate2Passes = results.filter((r) => r.gate2.passed).length;
  const gate3Passes = results.filter((r) => r.gate3.passed).length;
  const allPass = results.filter((r) => r.finalPass).length;
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

  console.log(`Gate 1 (Form) passes:        ${gate1Passes}/${results.length} (${((gate1Passes / results.length) * 100).toFixed(0)}%)`);
  console.log(`Gate 2 (Helpfulness) passes: ${gate2Passes}/${results.length} (${((gate2Passes / results.length) * 100).toFixed(0)}%)`);
  console.log(`Gate 3 (Engagement) passes:  ${gate3Passes}/${results.length} (${((gate3Passes / results.length) * 100).toFixed(0)}%)`);
  console.log(`ALL gates pass:              ${allPass}/${results.length} (${((allPass / results.length) * 100).toFixed(0)}%)`);
  console.log(`Average score:               ${avgScore.toFixed(1)}/100`);

  // Dimension breakdown
  console.log("\n📈 RESULTS BY DIMENSION:");
  const sortedDims = [...dimensionResults.entries()].sort(
    (a, b) => b[1].pass + b[1].fail - (a[1].pass + a[1].fail)
  );
  for (const [dim, { pass, fail }] of sortedDims) {
    const total = pass + fail;
    const pct = ((pass / total) * 100).toFixed(0);
    const bar = "█".repeat(Math.round(pass / total * 10)) + "░".repeat(10 - Math.round(pass / total * 10));
    console.log(`  ${dim.padEnd(15)} ${bar} ${pass}/${total} (${pct}%)`);
  }

  // Regression thresholds
  console.log("\n🚨 REGRESSION CHECK:");
  const regressions: string[] = [];
  if (gate1Passes / results.length < 0.8) regressions.push("Gate 1 below 80%");
  if (gate2Passes / results.length < 0.8) regressions.push("Gate 2 below 80%");
  if (gate3Passes / results.length < 0.7) regressions.push("Gate 3 below 70%");
  if (allPass / results.length < 0.6) regressions.push("All-pass below 60%");
  if (avgScore < 55) regressions.push("Avg score below 55");

  // Check dimension-specific regressions
  for (const [dim, { pass, fail }] of dimensionResults) {
    const total = pass + fail;
    if (total >= 3 && pass / total < 0.5) {
      regressions.push(`Dimension "${dim}" below 50%`);
    }
  }

  if (regressions.length === 0) {
    console.log("✅ NO REGRESSIONS DETECTED");
  } else {
    console.log("❌ REGRESSIONS DETECTED:");
    regressions.forEach((r) => console.log(`   - ${r}`));
  }
}

async function runSinglePrompt(
  prompt: string,
  endpoint: string,
  model: string
): Promise<void> {
  console.log("🧘 Study Loop - Single Prompt Test\n");
  console.log("═".repeat(70));

  const { response, score } = await runSingleTest(prompt, endpoint, model);
  console.log(formatScoreReport(prompt, response, score));
}

// ============ CLI ============

const args = process.argv.slice(2);
const endpoint = process.env.LLM_ENDPOINT || "http://localhost:11434/v1";
const model = process.env.LLM_MODEL || "llama3";

if (args.includes("--coverage")) {
  printCoverageReport(TEST_CASES);
  process.exit(0);
}

const promptIdx = args.indexOf("--prompt");
if (promptIdx !== -1 && args[promptIdx + 1]) {
  runSinglePrompt(args[promptIdx + 1], endpoint, model).catch(console.error);
} else {
  runAllTests(endpoint, model).catch(console.error);
}
