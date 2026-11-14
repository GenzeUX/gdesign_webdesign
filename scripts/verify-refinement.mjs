import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.REFINEMENT_TEST_URL || 'http://localhost:3300';
const browser = await chromium.launch({
  channel: 'msedge',
  headless: true,
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'],
});
const widths = [320, 375, 430, 768, 1024, 1440, 1920];
await mkdir('test-results/refinement', { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource'))
      errors.push(message.text());
  });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForSelector('html.lenis');
  assert.equal(
    await page.locator('.ambient-canvas').count(),
    0,
    'backgrounds are lazy below the first screen',
  );
  assert.equal(await page.locator('.service-icon').count(), 4);
  assert.deepEqual(
    await page
      .locator('.service-icon')
      .evaluateAll((nodes) => nodes.map((node) => node.dataset.icon)),
    ['web', 'digital', 'telegram', 'ai'],
  );
  assert.equal(
    await page
      .locator('.ambient-backdrop')
      .evaluateAll((nodes) =>
        nodes.every((node) => getComputedStyle(node).pointerEvents === 'none'),
      ),
    true,
  );
  const placeStage = async (variant) => {
    await page.evaluate((kind) => {
      const stage = document.querySelector(`.ambient-backdrop--${kind} .ambient-stage`);
      scrollTo({ top: stage.getBoundingClientRect().top + scrollY - 150, behavior: 'instant' });
    }, variant);
  };
  await placeStage('orbits');
  const orbits = page.locator('.ambient-canvas[data-variant=orbits]');
  await page.waitForFunction(
    () =>
      document.querySelector('.ambient-canvas[data-variant=orbits]')?.dataset.state === 'running',
  );
  await page.waitForTimeout(1000);
  const initialProgress = Number(await orbits.getAttribute('data-progress'));
  await page.evaluate(() => scrollTo({ top: scrollY + 210, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  const nextProgress = Number(await orbits.getAttribute('data-progress'));
  assert.ok(nextProgress > initialProgress + 0.025, 'scene responds to section scroll progress');
  assert.ok(
    await orbits.locator('canvas').evaluate((canvas) => canvas.width / canvas.clientWidth <= 1.26),
    'DPR cap',
  );
  await page
    .locator('.service-digital')
    .evaluate((el) =>
      scrollTo({ top: el.getBoundingClientRect().top + scrollY - 130, behavior: 'instant' }),
    );
  await page.waitForTimeout(900);
  await page.screenshot({
    path: 'test-results/refinement/services-desktop.png',
    animations: 'disabled',
  });
  const web = page.locator('.service-web');
  await web.evaluate((el) =>
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - 130, behavior: 'instant' }),
  );
  await page.waitForTimeout(400);
  await web.hover();
  await page.waitForTimeout(500);
  assert.ok(
    Number(
      await web
        .locator('.icon-trace')
        .first()
        .evaluate((el) => getComputedStyle(el).opacity),
    ) > 0.85,
  );
  await page.keyboard.press('Tab');
  await page.locator('.service-ai').focus();
  await page.waitForTimeout(450);
  assert.ok(
    Number(
      await page.locator('.service-ai .icon-trace').evaluate((el) => getComputedStyle(el).opacity),
    ) > 0.85,
    'keyboard illustration state',
  );
  await page.mouse.move(1350, 90);
  await placeStage('network');
  const network = page.locator('.ambient-canvas[data-variant=network]');
  await page.waitForFunction(
    () =>
      document.querySelector('.ambient-canvas[data-variant=network]')?.dataset.state === 'running',
  );
  await page.waitForTimeout(1000);
  await page.waitForFunction(
    () =>
      document.querySelector('.ambient-canvas[data-variant=orbits]')?.dataset.state === 'paused',
  );
  await page.screenshot({ path: 'test-results/refinement/ai-desktop.png', animations: 'disabled' });
  await network
    .locator('canvas')
    .evaluate((canvas) => canvas.dispatchEvent(new Event('webglcontextlost')));
  assert.equal(await network.locator('canvas').count(), 0);
  await page.waitForFunction(
    () =>
      Number(
        getComputedStyle(document.querySelector('.ambient-backdrop--network .ambient-fallback'))
          .opacity,
      ) > 0.3,
  );
  await page.getByRole('tab', { name: 'Поддержка клиентов' }).click();
  assert.match(await page.getByRole('tabpanel').innerText(), /Где найти документы/);
  await page.keyboard.press('ArrowRight');
  assert.match(await page.getByRole('tabpanel').innerText(), /Выдели условия/);

  // Exercise the existing client form with intercepted responses: no real application is sent.
  let attempts = 0;
  await page.route('**/api/leads', async (route) => {
    attempts++;
    const payload = route.request().postDataJSON();
    assert.equal(payload.consent, true);
    assert.equal(payload.name, 'Проверка интерфейса');
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.fulfill({
      status: attempts === 1 ? 503 : 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: attempts === 1 ? 'Проверка ошибки доставки' : 'Доставлено' }),
    });
  });
  const form = page.locator('.contact-form');
  assert.equal(await form.evaluate((el) => el.checkValidity()), false);
  await form.getByLabel('Как вас зовут').fill('Проверка интерфейса');
  await form.getByLabel('Как с вами связаться').fill('@example_user');
  await form.getByLabel('Что планируете?').selectOption({ label: 'Консультация' });
  await form.getByLabel('Несколько слов о проекте').fill('Проверка формы без реальной отправки');
  await form.locator('input[type=checkbox]').check();
  await form.getByRole('button', { name: 'Обсудить проект' }).click();
  await form.getByRole('status').filter({ hasText: 'Проверка ошибки доставки' }).waitFor();
  assert.equal(attempts, 1);
  await form.getByRole('button', { name: 'Обсудить проект' }).click();
  await form.getByRole('status').filter({ hasText: 'Заявка отправлена' }).waitFor();
  assert.equal(attempts, 2);
  await page.unroute('**/api/leads');

  const footerMetrics = await page.locator('footer').evaluate((footer) => ({
    navigation: parseFloat(getComputedStyle(footer.querySelector('nav')).fontSize),
    contacts: parseFloat(getComputedStyle(footer.querySelector('.footer-top > div')).fontSize),
    secondary: parseFloat(getComputedStyle(footer.querySelector('.footer-bottom')).fontSize),
  }));
  assert.ok(footerMetrics.navigation >= 15 && footerMetrics.navigation <= 17);
  assert.ok(footerMetrics.contacts >= 16 && footerMetrics.contacts <= 18);
  assert.ok(footerMetrics.secondary >= 13 && footerMetrics.secondary <= 14);
  await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(300);
  await page.screenshot({
    path: 'test-results/refinement/footer-desktop.png',
    animations: 'disabled',
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.ambient-canvas canvas').count(), 0);
  assert.equal(await page.locator('.wave-canvas canvas').count(), 0);
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 768 ? 900 : 1000 });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const overflow = () =>
      page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    await page.evaluate(() => {
      const test = document.createElement('div');
      test.id = 'overflow-control';
      test.style.cssText = 'width:4000px;height:1px';
      document.body.appendChild(test);
    });
    assert.equal(await overflow(), true, 'positive overflow control');
    await page.locator('#overflow-control').evaluate((el) => el.remove());
    assert.equal(await overflow(), false, `layout at ${width}`);
    assert.equal(await page.locator('.ambient-canvas canvas').count(), 0);
    await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(100);
    if (width <= 430)
      await page.screenshot({
        path: `test-results/refinement/footer-${width}.png`,
        animations: 'disabled',
      });
    if (width === 375) {
      await page
        .locator('.service-telegram')
        .evaluate((el) =>
          scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: 'instant' }),
        );
      await page.screenshot({
        path: 'test-results/refinement/services-mobile.png',
        animations: 'disabled',
      });
    }
  }
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page
    .locator('.service-ai')
    .evaluate((el) =>
      scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: 'instant' }),
    );
  await page.waitForTimeout(400);
  assert.equal(
    await page.locator('.ambient-canvas canvas').count(),
    0,
    'mobile keeps static backgrounds',
  );
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-menu').count(), 0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const routes = [
    '/services',
    '/services/web',
    '/services/digital',
    '/services/telegram',
    '/services/ai',
    '/projects',
    '/projects/stonebridge',
    '/about',
  ];
  for (const route of routes) {
    assert.equal((await page.goto(base + route, { waitUntil: 'networkidle' })).status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
  }
  for (const href of ['https://t.me/gen_design', 'mailto:genze.03@yandex.ru', 'tel:+79139490753'])
    assert.ok(await page.locator(`footer a[href="${href}"]`).count());
  await page.locator('footer').getByRole('link', { name: 'Проекты', exact: true }).click();
  await page.waitForURL('**/projects');
  assert.equal(await page.locator('h1').count(), 1);
  assert.deepEqual(errors, []);
  await writeFile(
    'test-results/refinement/report.json',
    JSON.stringify(
      {
        footerMetrics,
        widths,
        scrollProgress: [initialProgress, nextProgress],
        routes: 9,
        formResponses: attempts,
        realApplicationsSent: 0,
        errors,
      },
      null,
      2,
    ),
  );
  console.log('REFINEMENT CHECKS PASSED');
} finally {
  await browser.close();
}
