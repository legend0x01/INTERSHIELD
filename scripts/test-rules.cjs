#!/usr/bin/env node
/**
 * Regression tests for the deterministic rules engine (src/lib/rules.ts).
 *
 * Run with:  npm run test:rules
 *
 * These exist because the engine once scored a textbook scam message
 * ("a refundable registration and onboarding fee of Rs 1,499", "limited seats",
 * "reply immediately") at 0/100 "Lower Risk" — the fee patterns required
 * scammers to use tidy adjacent wording like "registration fee". Every case
 * below is a real phrasing, split between messages that MUST be flagged and
 * honest messages that must NOT be.
 *
 * The engine is TypeScript, so we transpile it to a temp dir and require it.
 */
'use strict';

const { execFileSync } = require('child_process');
const { createRequire } = require('module');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '.tmp-rules-test');

fs.rmSync(OUT, { recursive: true, force: true });
// Run the locally installed tsc through Node directly: spawning the `npx`
// shim is blocked on Windows (EINVAL on .cmd without a shell).
execFileSync(
  process.execPath,
  [require.resolve('typescript/bin/tsc'),
   'src/lib/rules.ts', '--outDir', OUT, '--target', 'es2020',
   '--module', 'commonjs', '--skipLibCheck', '--esModuleInterop'],
  { cwd: ROOT, stdio: 'inherit' }
);

const req = createRequire(path.join(OUT, 'noop.cjs'));
const { runRuleBasedChecks } = req(path.join(OUT, 'lib', 'rules.js'));
const { cases } = require('./rules-cases.cjs');

const ORDER = ['Lower Risk', 'Caution', 'High Risk', 'Very High Risk'];
const rank = (l) => ORDER.indexOf(l);

// Maps a case's `mustFlag` / `mustNotFlag` keyword onto the emitted signals.
const FLAG_PATTERNS = {
  fee: /fee|deposit|charge|upfront|monetary|payment channel|upi/i,
  urgency: /urgency|pressure|deadline/i,
  credentials: /credential|otp|aadhaar|pan|bank/i,
  impersonation: /impersonat|free public email|webmail|lookalike|spoof/i
};

let failures = 0;

for (const c of cases) {
  const r = runRuleBasedChecks(c.submission);
  const signals = (r.redFlags || []).join(' | ');
  const problems = [];

  if (c.expect && rank(r.riskLevel) < rank(c.expect)) {
    problems.push(`risk level ${r.riskLevel} is below the required ${c.expect}`);
  }
  if (c.maxLevel && rank(r.riskLevel) > rank(c.maxLevel)) {
    problems.push(`risk level ${r.riskLevel} exceeds the allowed ${c.maxLevel} (false positive)`);
  }
  for (const f of c.mustFlag || []) {
    if (!FLAG_PATTERNS[f].test(signals)) problems.push(`missing expected flag: ${f}`);
  }
  for (const f of c.mustNotFlag || []) {
    if (FLAG_PATTERNS[f].test(signals)) problems.push(`raised a false "${f}" flag`);
  }

  if (problems.length) failures++;
  console.log(
    `${problems.length ? 'FAIL' : 'PASS'}  ` +
    `[${String(r.riskScore).padStart(3)}/100  ${r.riskLevel.padEnd(15)}]  ${c.name}`
  );
  for (const p of problems) console.log(`        -> ${p}`);
  if (problems.length) console.log(`        red flags: ${signals || '(none)'}`);
}

fs.rmSync(OUT, { recursive: true, force: true });

console.log(`\n${cases.length - failures}/${cases.length} passed`);
process.exit(failures ? 1 : 0);
