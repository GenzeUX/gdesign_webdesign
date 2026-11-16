'use client';
import { useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Copy, LoaderCircle } from 'lucide-react';
import { studio } from '@/content/studio';
import { contactMessage, isContactAddress, telegramDraft, type ContactDetails } from '@/lib/contact-message';
import { trackStudioEvent } from '@/lib/tracking';

export function ContactForm({ project, service, deliveryReady }: { project?: string; service?: string; deliveryReady: boolean }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<ContactDetails | null>(null);
  const locked = useRef(false);
  const startedAt = useRef(0);
  const started = useRef(false);
  const context = { project, service };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const details: ContactDetails = {
      name: String(data.get('name') || '').trim(),
      contact: String(data.get('contact') || '').trim(),
      description: String(data.get('description') || '').trim(),
      service: service || String(data.get('service') || 'Консультация'),
      project,
    };
    const next: Record<string, string> = {};
    if (details.name.length < 2) next.name = 'Укажите имя — не менее двух букв.';
    if (!isContactAddress(details.contact)) next.contact = 'Укажите Telegram username, email или телефон.';
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      trackStudioEvent('form_error', context);
      return;
    }
    if (!deliveryReady) {
      setDraft(details);
      setMessage('Сообщение подготовлено. Откройте Telegram и отправьте его в чате — пока оно не отправлено.');
      trackStudioEvent('telegram_draft_ready', context);
      return;
    }
    locked.current = true;
    setStatus('sending');
    setMessage('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, consent: data.get('consent') === 'on', website: data.get('website') || '', startedAt: startedAt.current }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Не удалось отправить сообщение. Напишите в Telegram.');
      setStatus('success');
      setMessage('Заявка доставлена. Мы свяжемся с вами по указанному контакту.');
      trackStudioEvent('lead_delivered', context);
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Соединение прервалось. Напишите в Telegram.');
      trackStudioEvent('form_error', context);
    } finally { locked.current = false; }
  }
  return (
    <section className="contact section container" id="contact">
      <div className="contact-copy">
        <span className="eyebrow">Начнём с вашей задачи</span>
        <h2>Расскажите,<br />что планируете.</h2>
        <p>Обсудим задачу и определим следующий шаг: консультацию, отдельный этап или проект целиком.</p>
        <a href={project ? `${studio.telegram}?text=${encodeURIComponent(`Здравствуйте! Хочу обсудить проект по примеру кейса ${project}.`)}` : studio.telegram} target="_blank" rel="noreferrer" className="telegram-link">Написать в Telegram <ArrowUpRight size={20} aria-hidden="true" /></a>
        <a href={`mailto:${studio.email}`} className="contact-email">{studio.email}</a>
      </div>
      <form onSubmit={submit} className="contact-form" onFocus={() => {
        if (!startedAt.current) startedAt.current = Date.now();
        if (!started.current) { started.current = true; trackStudioEvent('form_start', context); }
      }} onChange={() => { if (draft) { setDraft(null); setMessage(''); } }}>
        <div className="form-heading"><span>{deliveryReady ? 'Коротко о вашем проекте' : 'Подготовим сообщение для Telegram'}</span><ArrowUpRight size={18} aria-hidden="true" /></div>
        {!deliveryReady ? <p className="contact-explanation">Заполните короткий бриф. Текст подготовится на вашем устройстве, а отправите его вы сами в Telegram.</p> : null}
        {project ? <p className="contact-context">По примеру проекта: <strong>{project}</strong></p> : null}
        {service ? <p className="contact-context">Направление: <strong>{service}</strong></p> : null}
        <label>Как вас зовут<input name="name" autoComplete="name" placeholder="Ваше имя" required minLength={2} maxLength={80} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name ? <span className="field-error" id="name-error">{errors.name}</span> : null}</label>
        <label>Как с вами связаться<input name="contact" autoComplete="off" spellCheck={false} autoCapitalize="none" placeholder="@username, email или телефон" required minLength={3} maxLength={150} aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? 'contact-error' : undefined} />{errors.contact ? <span className="field-error" id="contact-error">{errors.contact}</span> : null}</label>
        {!service ? <label>Направление — по желанию<select name="service" defaultValue="Консультация"><option>Консультация</option><option>Веб-разработка</option><option>Цифровые продукты</option><option>Telegram и контент</option><option>AI и автоматизация</option></select></label> : null}
        <label>О проекте — по желанию<textarea name="description" placeholder="Что хотите создать или улучшить?" rows={3} maxLength={1200} /></label>
        {deliveryReady ? <>
          <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <label className="consent"><input type="checkbox" name="consent" required /><span>Согласен на обработку имени, контакта и описания проекта студией G. DESIGN для ответа на обращение. Заявка передаётся через Telegram. Отозвать согласие можно письмом на {studio.email}.</span></label>
        </> : null}
        <button className="button submit-button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Отправляем…' : deliveryReady ? 'Обсудить проект' : 'Подготовить сообщение'}{status === 'sending' ? <LoaderCircle className="spin" size={18} aria-hidden="true" /> : <ArrowUpRight size={18} aria-hidden="true" />}</button>
        <p className={`form-status ${status}`} role="status" aria-live="polite">{message}</p>
        {draft ? <div className="contact-draft">
          <label>Подготовленное сообщение<textarea readOnly value={contactMessage(draft)} rows={7} onFocus={(event) => event.currentTarget.select()} /></label>
          <a className="button" href={telegramDraft(draft)} target="_blank" rel="noreferrer">Открыть Telegram <ArrowUpRight size={18} aria-hidden="true" /></a>
          <button type="button" className="copy-message" onClick={async () => {
            try { await navigator.clipboard.writeText(contactMessage(draft)); setMessage('Текст скопирован. Вставьте его в чат @gen_design и отправьте.'); }
            catch { setMessage('Выделите и скопируйте подготовленный текст, затем отправьте его в Telegram.'); }
          }}><Copy size={16} aria-hidden="true" /> Скопировать текст</button>
        </div> : null}
      </form>
    </section>
  );
}
