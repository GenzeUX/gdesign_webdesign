import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge',
  headless: true,
});
await mkdir('test-results', { recursive: true });
const errors = [],
  results = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
      errors.push(message.text());
    }
  });
  const routes = [
    '/',
    '/services',
    '/services/web',
    '/services/digital',
    '/services/ai',
    '/services/telegram',
    '/projects',
    '/projects/stonebridge',
    '/projects/gildiya-stroiteley-sibiri',
    '/projects/technics',
    '/projects/fathers-scandic',
    '/projects/sk-alfa',
    '/projects/svoboda-development',
    '/projects/karkasvl',
    '/projects/dovod',
    '/about',
  ];
  const links = new Set();
  for (const route of routes) {
    const response = await page.goto(base + route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator('h1').count(), 1, `single h1 on ${route}`);
    assert.ok(await page.title(), `title ${route}`);
    assert.equal(await page.locator('link[rel=canonical]').count(), 1, `canonical ${route}`);
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
    if (route.startsWith('/projects/')) {
      assert.equal(await page.getByRole('heading', { name: 'Задача', exact: true }).count(), 1);
      assert.equal(await page.getByRole('heading', { name: 'Результат', exact: true }).count(), 1);
      assert.equal(await page.locator('a[href^="https://t.me/portfolio_sites_gen_design/"]').count(), 1);
      for (const picture of await page.locator('.case-image, .case-gallery img').all()) {
        await picture.scrollIntoViewIfNeeded();
        await picture.evaluate((img) => img.decode());
        assert.ok(await picture.evaluate((img) => img.naturalWidth > 0), `case image loads ${route}`);
      }
    }
    if (route === '/projects') {
      assert.equal(await page.locator('.portfolio-entry').count(), 8, 'all eight channel cases');
      for (const picture of await page.locator('.portfolio-image img').all()) {
        await picture.scrollIntoViewIfNeeded();
        await picture.evaluate((img) => img.decode());
      }
      await page.screenshot({ path: 'test-results/projects-desktop.png', fullPage: true });
    }
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href'))))
      links.add(href.split('#')[0] || '/');
    results.push({ route, status: response.status(), title: await page.title() });
  }
  for (const link of links) assert.ok(routes.includes(link), `known link ${link}`);
  await page.setViewportSize({ width: 375, height: 900 });
  for (const route of routes.filter((route) => route.startsWith('/projects'))) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `portfolio fits mobile ${route}`);
  }
  await page.goto(base + '/projects', { waitUntil: 'networkidle' });
  for (const picture of await page.locator('.portfolio-image img').all()) {
    await picture.scrollIntoViewIfNeeded();
    await picture.evaluate((img) => img.decode());
  }
  await page.screenshot({ path: 'test-results/projects-mobile.png', fullPage: true });
  const missing = await page.goto(base + '/does-not-exist');
  assert.equal(missing.status(), 404);
  assert.equal((await page.goto(base + '/projects/unknown-project')).status(), 404);
  for (const path of ['/sitemap.xml', '/robots.txt', '/icon.svg', '/opengraph-image'])
    assert.equal((await page.request.get(base + path)).status(), 200, path);
  for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 768 ? 900 : 1080 });
    await page.goto(base, { waitUntil: 'networkidle' });
    // Check the same oracle against a deliberately overflowing fixture first.
    const overflow = () =>
      page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    await page.evaluate(() => {
      const el = document.createElement('div');
      el.id = 'overflow-control';
      el.style.cssText = 'width:4000px;height:1px';
      document.body.appendChild(el);
    });
    assert.equal(await overflow(), true, 'positive control for overflow detector');
    await page.locator('#overflow-control').evaluate((el) => el.remove());
    assert.equal(await overflow(), false, `no overflow ${width}`);
    const heading = await page.locator('h1').boundingBox();
    assert.ok(heading.width <= width, `heading fits ${width}`);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
      animations: 'disabled',
    });
  }
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  assert.equal(
    await page.getByRole('button', { name: 'Закрыть меню' }).getAttribute('aria-expanded'),
    'true',
  );
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-menu').count(), 0);
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await page
    .locator('#mobile-menu')
    .getByRole('link', { name: /Услуги/ })
    .click();
  await page.waitForURL('**/services');
  assert.equal(await page.locator('#mobile-menu').count(), 0);
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Поддержка клиентов' }).click();
  assert.match(await page.getByRole('tabpanel').innerText(), /Где найти документы/);
  await page.keyboard.press('ArrowRight');
  assert.match(await page.getByRole('tabpanel').innerText(), /Выдели условия/);
  const form = page.locator('form');
  assert.equal(await form.evaluate((f) => f.checkValidity()), false);
  await form.getByLabel('Как вас зовут').fill('Анна');
  await form.getByLabel('Как с вами связаться').fill('@example_user');
  await form.getByLabel('Что планируете?').selectOption({ label: 'Консультация' });
  await form.getByLabel('Несколько слов о проекте').fill('Хочу обсудить цифровой продукт');
  await form.locator('input[type=checkbox]').check();
  await page.waitForTimeout(2700);
  const responsePromise = page.waitForResponse('**/api/leads');
  await form.getByRole('button', { name: 'Обсудить проект' }).click();
  const response = await responsePromise;
  assert.equal(response.status(), 503, 'unconfigured delivery never pretends success');
  await page
    .getByRole('status')
    .filter({ hasText: 'Отправка через сайт пока не настроена' })
    .waitFor();
  assert.equal(
    (await page.request.post(base + '/api/leads', { data: {} })).status(),
    403,
    'missing origin blocked',
  );
  assert.equal(
    (
      await page.request.post(base + '/api/leads', { headers: { Origin: base }, data: {} })
    ).status(),
    400,
    'invalid body blocked',
  );
  assert.equal(
    (
      await page.request.post(base + '/api/leads', {
        headers: { Origin: base, 'Content-Type': 'text/plain' },
        data: 'x',
      })
    ).status(),
    415,
  );
  assert.equal(
    (
      await page.request.post(base + '/api/leads', {
        headers: { Origin: base },
        data: { description: 'x'.repeat(17000) },
      })
    ).status(),
    413,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.wave-canvas canvas').count(), 0, 'static reduced-motion scene');
  assert.equal(
    (await page.request.get(base + '/images/light-field.webp')).status(),
    200,
    'static fallback exists',
  );
  // All visible form fields have associated labels and visible images have alternatives.
  assert.equal(await page.locator('img:not([alt])').count(), 0);
  assert.ok(await page.getByRole('link', { name: 'Перейти к содержимому' }).count());
  assert.deepEqual(errors, [], 'no uncaught browser errors');
  await writeFile(
    'test-results/browser-report.json',
    JSON.stringify({ results, widths: [320, 375, 430, 768, 1024, 1440, 1920], errors }, null, 2),
  );
  console.log('BROWSER CHECKS PASSED');
} finally {
  await browser.close();
}

