'use client';
import { useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, LoaderCircle } from 'lucide-react';
import { studio } from '@/content/studio';
export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const locked = useRef(false);
  const startedAt = useRef(0);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    locked.current = true;
    setStatus('sending');
    setMessage('');
    const form = event.currentTarget,
      data = new FormData(form);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          contact: data.get('contact'),
          service: data.get('service'),
          description: data.get('description'),
          consent: data.get('consent') === 'on',
          website: data.get('website'),
          startedAt: startedAt.current,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.message ||
            'Не удалось отправить заявку. Попробуйте ещё раз или напишите в Telegram.',
        );
      setStatus('success');
      setMessage('Заявка отправлена. Мы свяжемся с вами по указанному контакту.');
      form.reset();
      startedAt.current = 0;
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error ? error.message : 'Соединение прервалось. Напишите нам в Telegram.',
      );
    } finally {
      locked.current = false;
    }
  }
  return (
    <section className="contact section container" id="contact">
      <div className="contact-copy">
        <span className="eyebrow">
          <i />
          Начнём с разговора
        </span>
        <h2>
          Давайте создадим
          <br />
          что-то выдающееся<span className="accent">.</span>
        </h2>
        <p>Расскажите о своём проекте — обсудим задачу и найдём подходящее решение.</p>
        <a href={studio.telegram} target="_blank" rel="noreferrer" className="telegram-link">
          Написать в Telegram <ArrowUpRight size={20} />
        </a>
        <a href={`mailto:${studio.email}`} className="contact-email">
          {studio.email}
        </a>
      </div>
      <form
        onSubmit={submit}
        onFocus={() => {
          if (!startedAt.current) startedAt.current = Date.now();
        }}
        className="contact-form"
      >
        <div className="form-heading">
          <span>Ваш следующий шаг</span>
          <span>↗</span>
        </div>
        <label>
          Как вас зовут
          <input
            autoComplete="name"
            name="name"
            placeholder="Ваше имя"
            required
            minLength={2}
            maxLength={80}
          />
        </label>
        <label>
          Как с вами связаться
          <input
            name="contact"
            autoComplete="email"
            placeholder="Telegram, email или телефон"
            required
            minLength={3}
            maxLength={150}
          />
        </label>
        <label>
          Что планируете?
          <select name="service" defaultValue="" required>
            <option value="" disabled>
              Выберите направление
            </option>
            <option>Веб-разработка</option>
            <option>Цифровые продукты</option>
            <option>Telegram и контент</option>
            <option>AI и автоматизация</option>
            <option>Консультация</option>
          </select>
        </label>
        <label>
          Несколько слов о проекте
          <textarea
            name="description"
            placeholder="Задача, идея или вопрос"
            rows={2}
            required
            minLength={10}
            maxLength={3000}
          />
        </label>
        <div className="honeypot" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="consent">
          <input type="checkbox" name="consent" required />
          <span>
            Согласен на обработку имени, контакта и описания проекта студией G. DESIGN для ответа на
            обращение. Заявка передаётся через Telegram. Отозвать согласие можно письмом на{' '}
            {studio.email}.
          </span>
        </label>
        <button type="submit" disabled={status === 'sending'} className="button submit-button">
          {status === 'sending' ? 'Отправляем…' : 'Обсудить проект'}
          {status === 'sending' ? (
            <LoaderCircle className="spin" size={18} />
          ) : (
            <ArrowUpRight size={18} />
          )}
        </button>
        <p className={`form-status ${status}`} role="status" aria-live="polite">
          {message}
        </p>
      </form>
    </section>
  );
}
