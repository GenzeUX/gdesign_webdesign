import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contactMessage, isContactAddress, telegramDraft } from '../src/lib/contact-message';
test('Telegram draft preserves Cyrillic and reserved characters with the chosen recipient', () => {
  const details = { name: 'Анна & Иван', contact: '@example_user', description: 'Сайт? Цена #1 + CRM', service: 'Веб-разработка', project: 'Stone Bridge estate' };
  const url = new URL(telegramDraft(details));
  assert.equal(url.origin, 'https://t.me');
  assert.equal(url.pathname, '/gen_design');
  assert.equal(url.searchParams.get('text'), contactMessage(details));
  assert.match(url.searchParams.get('text')!, /Кейс|кейс/);
  assert.match(contactMessage(details), /Сайт\? Цена #1 \+ CRM/);
});
test('optional description does not block a short first contact or invent project context', () => {
  const result = contactMessage({ name: ' Анна ', contact: '@example_user', description: '', service: 'Консультация' });
  assert.ok(result.includes('Имя: Анна'));
  assert.ok(!result.includes('О проекте:'));
  assert.ok(!result.includes('Заинтересовал кейс:'));
  assert.ok(!result.includes('undefined'));
});
test('contact validation accepts supported channels and rejects meaningless contact text', () => {
  for (const value of ['@example_user','user@example.com','+7 913 949-07-53','https://t.me/example_user']) assert.equal(isContactAddress(value), true);
  for (const value of ['???','@x','name@','javascript:alert(1)']) assert.equal(isContactAddress(value), false);
});
