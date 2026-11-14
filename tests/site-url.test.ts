import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveSiteUrl, allowedSiteOrigins } from '../src/lib/site-url';

test('local development retains its configured origin', () => {
  assert.equal(resolveSiteUrl({}), 'http://localhost:3000');
  assert.equal(resolveSiteUrl({NEXT_PUBLIC_SITE_URL:'http://localhost:3001/'}), 'http://localhost:3001');
});
test('Vercel metadata uses the production domain while preview remains available', () => {
  const env = { VERCEL_PROJECT_PRODUCTION_URL:'studio.vercel.app', VERCEL_URL:'studio-abc-owner.vercel.app', VERCEL_BRANCH_URL:'studio-git-main-owner.vercel.app' };
  assert.equal(resolveSiteUrl(env), 'https://studio.vercel.app');
  const origins = allowedSiteOrigins(env);
  assert.ok(origins.has('https://studio.vercel.app'));
  assert.ok(origins.has('https://studio-abc-owner.vercel.app'));
  assert.ok(origins.has('https://studio-git-main-owner.vercel.app'));
  assert.equal(origins.has('https://unrelated.vercel.app'), false);
  assert.equal(origins.has('https://studio.vercel.app.attacker.example'), false);
});
test('explicit custom domains take precedence and normalize trailing slashes', () => {
  const env = {NEXT_PUBLIC_SITE_URL:' https://example.com/ ',VERCEL_PROJECT_PRODUCTION_URL:'studio.vercel.app'};
  assert.equal(resolveSiteUrl(env), 'https://example.com');
  assert.ok(allowedSiteOrigins(env).has('https://example.com'));
});
test('deployment hostname is a fallback when production hostname is absent', () => {
  assert.equal(resolveSiteUrl({VERCEL_URL:'studio-preview.vercel.app'}), 'https://studio-preview.vercel.app');
  assert.throws(() => resolveSiteUrl({NEXT_PUBLIC_SITE_URL:'file:///private'}));
});
