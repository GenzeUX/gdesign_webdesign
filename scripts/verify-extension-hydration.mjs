import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Run against the development server, where React reports attribute mismatches.
const base = process.env.HYDRATION_TEST_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'msedge', headless: true });

async function inspect(mode, reducedMotion = 'reduce') {
  const context = await browser.newContext({ viewport: { width: 375, height: 900 }, reducedMotion });
  await context.addInitScript(() => Object.defineProperty(navigator, 'deviceMemory', { get: () => 2, configurable: true }));
  const page = await context.newPage();
  const warnings = [], errors = [];
  page.on('console', message => {
    if (message.type() === 'error' && /hydrat|didn.t match|did not match/i.test(message.text())) warnings.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  if (mode !== 'clean') await context.addInitScript(kind => {
    const apply = () => {
      const node = kind === 'wallet' ? document.documentElement : document.querySelector('.brand-name');
      if (!node) return false;
      if (kind === 'wallet') {
        node.setAttribute('data-bybit-channel-name', 'wallet-extension-regression-test');
        node.setAttribute('data-bybit-is-default-wallet', 'true');
      } else node.setAttribute('data-hydration-control', 'expected-descendant-warning');
      window.__hydrationProbeApplied = true;
      return true;
    };
    if (!apply()) {
      const observer = new MutationObserver(() => { if (apply()) observer.disconnect(); });
      observer.observe(document, { childList: true, subtree: true });
    }
  }, mode);
  try {
    assert.equal((await page.goto(base, { waitUntil: 'networkidle' })).status(), 200);
    if (mode !== 'clean') assert.equal(await page.evaluate(() => window.__hydrationProbeApplied), true);
    await page.waitForTimeout(700);
    assert.deepEqual(errors, []);
    if (mode === 'nested') {
      assert.ok(warnings.some(text => text.includes('data-hydration-control')), 'descendant mismatch must still be diagnosed');
      console.log('DESCENDANT DIAGNOSTICS PRESERVED');
    } else {
      assert.equal(warnings.length, 0, `${mode}: unexpected hydration warning: ${warnings[0]?.slice(-500)}`);
      if (reducedMotion === 'reduce') assert.equal(await page.locator('.process-line > span').evaluate(el => getComputedStyle(el).transform), 'none');
      if (mode === 'wallet') assert.equal(await page.locator('html').getAttribute('data-bybit-is-default-wallet'), 'true', 'wallet attributes must remain intact');
      await page.getByRole('button', { name: 'Открыть меню' }).click();
      assert.equal(await page.locator('#mobile-menu').isVisible(), true, 'client event handlers hydrate');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#mobile-menu').count(), 0);
      console.log(`${mode.toUpperCase()} HYDRATION PASSED`);
    }
  } finally { await context.close(); }
}

try {
  await inspect('clean');
  await inspect('wallet');
  await inspect('wallet', 'no-preference');
  await inspect('nested');
  console.log('EXTENSION HYDRATION CHECKS PASSED');
} finally { await browser.close(); }
