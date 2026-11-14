import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import sharp from 'sharp';

const base = process.env.VISUAL_TEST_URL || 'http://localhost:3100';
const browser = await chromium.launch({
  channel: 'msedge',
  headless: true,
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'],
});
await mkdir('test-results/art-direction', { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !m.text().startsWith('Failed to load resource'))
      errors.push(m.text());
  });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('.wave-canvas[data-ready=true]').waitFor();
  await page.waitForTimeout(2500);
  const canvas = page.locator('.wave-canvas canvas');
  assert.equal(await canvas.count(), 1);
  const before = await page.screenshot();
  await page.waitForTimeout(600);
  const after = await page.screenshot();
  const hash = (b) => createHash('sha256').update(b).digest('hex');
  assert.equal(hash(before), hash(Buffer.from(before)), 'identical-frame control');
  assert.notEqual(hash(before), hash(after), 'GPU frame changes over time');
  // Independently ensure the image contains a visible violet light field, not an empty canvas.
  const { data, info } = await sharp(after)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let luminousPixels = 0;
  for (let i = 0; i < data.length; i += info.channels)
    if (data[i + 2] > 45 && data[i + 2] > data[i + 1] * 1.25) luminousPixels++;
  assert.ok(luminousPixels > info.width * info.height * 0.025, 'light field is visibly rendered');
  await page.mouse.move(100, 200);
  await page.waitForTimeout(150);
  await page.mouse.move(1300, 800);
  await page.waitForTimeout(150);
  await page.screenshot({
    path: 'test-results/art-direction/desktop-live.png',
    animations: 'disabled',
  });
  const opacity = await page
    .locator('.wave-fallback')
    .evaluate((el) => getComputedStyle(el).opacity);
  assert.equal(opacity, '0', 'new static image hidden once WebGL is ready');
  await canvas.evaluate((el) => el.dispatchEvent(new Event('webglcontextlost')));
  assert.equal(await canvas.count(), 0, 'lost context removes unusable canvas');
  await page.waitForFunction(
    () => Number(getComputedStyle(document.querySelector('.wave-fallback')).opacity) >= 0.99,
    undefined,
    { timeout: 8000 },
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const widths = [320, 375, 430, 768, 1024, 1440, 1920];
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 768 ? 900 : 1080 });
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await canvas.count(), 0, 'reduced motion never starts WebGL');
    const dimensions = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    assert.ok(dimensions.scroll <= dimensions.width + 1, `layout fits ${width}px`);
    const heading = await page.locator('h1').boundingBox();
    assert.ok(heading.x >= 0 && heading.x + heading.width <= width + 1);
    assert.equal(await page.locator('h1').count(), 1);
    await page.screenshot({
      path: `test-results/art-direction/home-${width}.png`,
      animations: 'disabled',
    });
  }
  for (const route of [
    '/services',
    '/services/web',
    '/services/digital',
    '/services/ai',
    '/services/telegram',
    '/projects',
    '/projects/stonebridge',
    '/about',
  ]) {
    assert.equal((await page.goto(base + route, { waitUntil: 'networkidle' })).status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({
    path: 'test-results/art-direction/full-page.png',
    fullPage: true,
    animations: 'disabled',
  });
  assert.equal((await page.request.get(base + '/images/light-field.webp')).status(), 200);
  assert.deepEqual(errors, [], 'no runtime, hydration or shader errors');
  await writeFile(
    'test-results/art-direction/report.json',
    JSON.stringify(
      {
        widths,
        luminousPixels,
        shaderAnimated: true,
        contextLossFallback: true,
        routes: 9,
        errors,
      },
      null,
      2,
    ),
  );
  console.log('VISUAL CHECKS PASSED');
} finally {
  await browser.close();
}

