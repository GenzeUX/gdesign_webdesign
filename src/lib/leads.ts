import { createHash } from 'node:crypto';
import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  contact: z
    .string()
    .trim()
    .min(3)
    .max(150)
    .refine(
      (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
        /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(v) ||
        /^https:\/\/t\.me\/[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(v) ||
        /^\+?[\d ()-]{10,25}$/.test(v),
      'Укажите email, телефон или Telegram username.',
    ),
  service: z.enum([
    'Веб-разработка',
    'Цифровые продукты',
    'Telegram и контент',
    'AI и автоматизация',
    'Консультация',
  ]),
  description: z.string().trim().min(10).max(3000),
  consent: z.literal(true),
  website: z.string().max(0),
  startedAt: z.number().finite(),
});
export interface AbuseStore {
  take(key: string, limit: number, ttlSeconds: number): Promise<boolean>;
  remove(key: string): Promise<void>;
}
export class MemoryAbuseStore implements AbuseStore {
  private entries = new Map<string, { count: number; expires: number }>();
  constructor(private now: () => number = Date.now) {}
  async take(key: string, limit: number, ttlSeconds: number) {
    const now = this.now();
    for (const [k, v] of this.entries) {
      if (v.expires <= now) this.entries.delete(k);
    }
    const entry = this.entries.get(key);
    if (entry) {
      if (entry.count >= limit) return false;
      entry.count++;
      return true;
    }
    if (this.entries.size >= 10000) return false;
    this.entries.set(key, { count: 1, expires: now + ttlSeconds * 1000 });
    return true;
  }
  async remove(key: string) {
    this.entries.delete(key);
  }
}
export class RedisAbuseStore implements AbuseStore {
  constructor(
    private url: string,
    private token: string,
  ) {}
  private async command(args: (string | number)[]) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Abuse store unavailable');
    const data = await response.json();
    if (data.error) throw new Error('Abuse store error');
    return data.result;
  }
  async take(key: string, limit: number, ttl: number) {
    const script =
      "local n=redis.call('INCR',KEYS[1]);if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end;return n";
    return Number(await this.command(['EVAL', script, 1, `gdesign:${key}`, ttl])) <= limit;
  }
  async remove(key: string) {
    await this.command(['DEL', `gdesign:${key}`]);
  }
}
interface Dependencies {
  store: AbuseStore;
  token?: string;
  chatId?: string;
  fetcher?: typeof fetch;
  now?: () => number;
}
const result = (status: number, message: string) => ({ status, message });
export async function submitLead(input: unknown, clientKey: string, deps: Dependencies) {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success)
    return result(400, 'Проверьте имя, контакт, описание и согласие на обработку данных.');
  const lead = parsed.data,
    now = (deps.now || Date.now)();
  if (now - lead.startedAt < 2500 || now - lead.startedAt > 86400000)
    return result(400, 'Заполните форму и повторите отправку.');
  if (!deps.token || !deps.chatId)
    return result(
      503,
      'Отправка через сайт пока не настроена. Напишите нам в Telegram: @gen_design.',
    );
  if (!(await deps.store.take(`rate:${clientKey}`, 5, 900)))
    return result(
      429,
      'Слишком много обращений. Попробуйте через 15 минут или напишите в Telegram.',
    );
  const fingerprint = createHash('sha256')
    .update(JSON.stringify([lead.name, lead.contact, lead.service, lead.description]))
    .digest('hex');
  const duplicateKey = `delivery:${fingerprint}`;
  if (!(await deps.store.take(duplicateKey, 1, 600)))
    return result(
      409,
      'Такая заявка уже отправляется или была отправлена. Если нужно уточнение, напишите в Telegram.',
    );
  try {
    const text = `Новая заявка G. DESIGN\n\nИмя: ${lead.name}\nКонтакт: ${lead.contact}\nНаправление: ${lead.service}\n\n${lead.description}\n\nСогласие на обработку данных: получено`;
    const response = await (deps.fetcher || fetch)(
      `https://api.telegram.org/bot${deps.token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: deps.chatId,
          text,
          link_preview_options: { is_disabled: true },
        }),
        signal: AbortSignal.timeout(10000),
        cache: 'no-store',
      },
    );
    const data = await response.json();
    if (!response.ok || data.ok !== true) {
      await deps.store.remove(duplicateKey);
      return result(
        502,
        'Не удалось доставить заявку. Попробуйте ещё раз или напишите в Telegram: @gen_design.',
      );
    }
    return result(200, 'Заявка отправлена.');
  } catch {
    // Keep the short-lived lock on ambiguous network failures: Telegram may have accepted the message.
    return result(
      502,
      'Подтверждение доставки не получено. Напишите в Telegram: @gen_design, чтобы уточнить получение заявки.',
    );
  }
}
