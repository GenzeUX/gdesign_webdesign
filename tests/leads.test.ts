import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryAbuseStore, submitLead, leadSchema, RedisAbuseStore } from '../src/lib/leads';
const now = Date.now();
const valid = {
  name: 'Анна',
  contact: '@example_user',
  service: 'Веб-разработка',
  description: 'Нужен сайт для компании',
  consent: true,
  website: '',
  startedAt: now - 10000,
};
const success: typeof fetch = async () =>
  new Response(JSON.stringify({ ok: true }), { status: 200 });
const options = () => ({
  store: new MemoryAbuseStore(),
  token: 'test-token',
  chatId: 'test-chat',
  fetcher: success,
  now: () => now,
});
test('validates contact, consent, lengths, honeypot and allowed service', () => {
  assert.equal(leadSchema.safeParse(valid).success, true);
  for (const change of [
    { contact: '???' },
    { consent: false },
    { website: 'spam' },
    { service: 'invalid' },
    { description: 'x'.repeat(3001) },
    { name: '' },
  ])
    assert.equal(leadSchema.safeParse({ ...valid, ...change }).success, false);
  for (const contact of ['user@example.com', '+7 913 949-07-53', 'https://t.me/example_user'])
    assert.equal(leadSchema.safeParse({ ...valid, contact }).success, true);
  assert.equal(leadSchema.safeParse({ ...valid, description: '' }).success, true);
});
test('unconfigured Telegram never returns success', async () => {
  assert.equal((await submitLead(valid, 'ip', { store: new MemoryAbuseStore() })).status, 503);
});
test('blocks implausibly fast or stale submissions', async () => {
  for (const startedAt of [now, now + 10000, now - 90000000])
    assert.equal((await submitLead({ ...valid, startedAt }, 'ip', options())).status, 400);
});
test('success occurs only after Telegram confirms delivery, with unformatted user text', async () => {
  let called = false;
  const deps = options();
  deps.fetcher = async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    assert.equal(body.chat_id, 'test-chat');
    assert.match(body.text, /Анна/);
    assert.equal(body.parse_mode, undefined);
    called = true;
    return success('');
  };
  assert.equal((await submitLead(valid, 'ip', deps)).status, 200);
  assert.equal(called, true);
});
test('Telegram rejection allows retry; concurrent duplicates do not send twice', async () => {
  const deps = options();
  deps.fetcher = async () => new Response(JSON.stringify({ ok: false }), { status: 200 });
  assert.equal((await submitLead(valid, 'ip', deps)).status, 502);
  let count = 0;
  deps.fetcher = async () => {
    count++;
    return success('');
  };
  const results = await Promise.all([submitLead(valid, 'ip', deps), submitLead(valid, 'ip', deps)]);
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 409]);
  assert.equal(count, 1);
});
test('network uncertainty blocks blind duplicate retries', async () => {
  const deps = options();
  deps.fetcher = async () => {
    throw new Error('network');
  };
  assert.equal((await submitLead(valid, 'ip', deps)).status, 502);
  assert.equal((await submitLead(valid, 'ip', deps)).status, 409);
});
test('rate limiting rejects sixth request and expires after window', async () => {
  let time = now;
  const deps = options();
  deps.store = new MemoryAbuseStore(() => time);
  for (let i = 0; i < 5; i++)
    assert.equal(
      (await submitLead({ ...valid, description: `${valid.description} ${i}` }, 'ip', deps)).status,
      200,
    );
  assert.equal(
    (await submitLead({ ...valid, description: `${valid.description} sixth` }, 'ip', deps)).status,
    429,
  );
  time += 901000;
  assert.equal((await submitLead(valid, 'ip', deps)).status, 200);
});
test('Redis is an atomic shared counter and fails closed on outage', async () => {
  const original = global.fetch;
  let args: unknown[] = [];
  try {
    global.fetch = async (_url, init) => {
      args = JSON.parse(String(init?.body));
      return new Response('{"result":6}');
    };
    const store = new RedisAbuseStore('https://redis.example', 'token');
    assert.equal(await store.take('rate:ip', 5, 900), false);
    assert.equal(args[0], 'EVAL');
    assert.equal(args[4], 900);
    global.fetch = async () => new Response('bad', { status: 503 });
    await assert.rejects(() => store.take('rate:ip', 5, 900));
  } finally {
    global.fetch = original;
  }
});
