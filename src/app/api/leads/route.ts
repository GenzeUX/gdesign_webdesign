import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { MemoryAbuseStore, RedisAbuseStore, submitLead } from '@/lib/leads';
import { allowedSiteOrigins } from '@/lib/site-url';
export const runtime = 'nodejs';
const store =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new RedisAbuseStore(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN)
    : new MemoryAbuseStore();
const reply = (message: string, status: number) =>
  NextResponse.json(
    { message },
    {
      status,
      headers: { 'Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': '900' } : {}) },
    },
  );
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin || !allowedSiteOrigins(process.env).has(origin))
    return reply('Запрос должен быть отправлен с сайта студии.', 403);
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return reply('Ожидаются данные формы.', 415);
  if (Number(request.headers.get('content-length')) > 16384)
    return reply('Описание слишком большое.', 413);
  const reader = request.body?.getReader();
  if (!reader) return reply('Нет данных формы.', 400);
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        return reply('Описание слишком большое.', 413);
      }
      chunks.push(value);
    }
    const input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const ip =
      process.env.TRUST_PROXY === 'true'
        ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
        : 'shared';
    const key = createHash('sha256').update(ip).digest('hex');
    const result = await submitLead(input, key, {
      store,
      token: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
    });
    return reply(result.message, result.status);
  } catch (error) {
    return reply(
      error instanceof SyntaxError
        ? 'Проверьте данные формы.'
        : 'Сервис временно недоступен. Напишите в Telegram: @gen_design.',
      error instanceof SyntaxError ? 400 : 503,
    );
  }
}
