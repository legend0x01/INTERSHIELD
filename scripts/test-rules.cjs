#!/usr/bin/env node
/**
 * Regression tests for InternShield's scoring.
 *
 * Run with:  npm run test:rules
 *
 * Each case runs through the same steps as POST /api/check (link reader, email
 * header analysis, deep search, then the rules engine), so a test can't pass by
 * skipping the parts of the pipeline that have caused real bugs:
 *  - a textbook fee scam scored 0/100 (fee patterns needed tidy wording)
 *  - the site's own "Legitimate Offer" sample scored 85/100, because
 *    "Razorpay never asks for ... bank passwords" was read as a credential demand
 *  - a spoofed Infosys email scored 25/100, because deep search trusted the
 *    forged From: header and subtracted points
 *
 * Deep search queries public RDAP for domain age. If the network is down the
 * lookup degrades to "Unable to Verify", which scores nothing, so results stay
 * stable offline.
 */
'use strict';

const { execFileSync } = require('child_process');
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
   'src/lib/rules.ts', 'src/lib/emailReader.ts', 'src/lib/deepSearch.ts', 'src/lib/linkReader.ts',
   '--outDir', OUT, '--target', 'es2020', '--module', 'commonjs',
   '--skipLibCheck', '--esModuleInterop'],
  { cwd: ROOT, stdio: 'inherit' }
);

const { runRuleBasedChecks } = require(path.join(OUT, 'lib', 'rules.js'));
const { analyzeEmailHeadersAndContent } = require(path.join(OUT, 'lib', 'emailReader.js'));
const { runDeepSearchInvestigation } = require(path.join(OUT, 'lib', 'deepSearch.js'));
const { analyzeLink } = require(path.join(OUT, 'lib', 'linkReader.js'));
const { cases } = require('./rules-cases.cjs');

/** Mirrors src/app/api/check/route.ts steps 1-4, minus the AI layer. */
async function runPipeline(input) {
  const body = { consent: true, enableDeepSearch: true, ...input };
  let text = body.text || '';
  let linkAnalysis, emailAnalysis, deepSearch;

  if (body.internshipUrl && body.internshipUrl.trim()) {
    try {
      const { analysis, extractedText } = await analyzeLink(body.internshipUrl, body.companyName);
      linkAnalysis = analysis;
      if (extractedText) text += `\n[Content Extracted from Link: ${body.internshipUrl}]\n` + extractedText;
    } catch { /* same as the route: a failed fetch is not evidence */ }
  }
  if (body.inputType === 'email' || body.recruiterEmail || (body.text && body.text.includes('From:'))) {
    const { analysis } = analyzeEmailHeadersAndContent(body.text || '', body.recruiterEmail);
    emailAnalysis = analysis;
    if (analysis.fromAddress && !body.recruiterEmail) body.recruiterEmail = analysis.fromAddress;
  }
  if (body.enableDeepSearch !== false) {
    try { deepSearch = await runDeepSearchInvestigation(body); } catch { /* offline */ }
  }
  return runRuleBasedChecks({ ...body, text: text.trim() }, linkAnalysis, emailAnalysis, undefined, deepSearch);
}

const ORDER = ['Lower Risk', 'Caution', 'High Risk', 'Very High Risk'];
const rank = (l) => ORDER.indexOf(l);

// Maps a case's `mustFlag` / `mustNotFlag` keyword onto the emitted red flags.
const FLAG_PATTERNS = {
  fee: /monetary payment|payment channel/i,
  urgency: /urgency/i,
  credentials: /secret credential|identity or bank documents/i,
  secret: /secret credential/i,
  impersonation: /impersonat|free webmail service|lookalike|spoof/i
};

(async () => {
  let failures = 0;

  for (const c of cases) {
    const r = await runPipeline(c.submission);
    const signals = (r.redFlags || []).join(' | ');
    const problems = [];

    if (c.expect && rank(r.riskLevel) < rank(c.expect)) {
      problems.push(`risk level ${r.riskLevel} is below the required ${c.expect}`);
    }
    if (c.maxLevel && rank(r.riskLevel) > rank(c.maxLevel)) {
      problems.push(`risk level ${r.riskLevel} exceeds the allowed ${c.maxLevel} (false positive)`);
    }
    if (typeof c.maxScore === 'number' && r.riskScore > c.maxScore) {
      problems.push(`score ${r.riskScore} exceeds the allowed ${c.maxScore}`);
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
    if (problems.length || process.env.VERBOSE) console.log(`        red flags: ${signals || '(none)'}`);
  }

  fs.rmSync(OUT, { recursive: true, force: true });
  console.log(`\n${cases.length - failures}/${cases.length} passed`);
  process.exit(failures ? 1 : 0);
})();
