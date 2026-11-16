import Link from 'next/link';
import { preload } from 'react-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { services } from '@/content/studio';
import { Button, SectionIntro } from '../ui';
import { Wave } from '../three/wave';
import { Reveal } from '../motion/reveal';
import { AIFlow } from './ai-flow';
import { Brand } from '../ui';
import { AmbientBackdrop } from '../three/ambient-backdrop';
export function Hero() {
  preload('/images/light-field.webp', { as: 'image', fetchPriority: 'high' });
  return (
    <section className="hero">
      <Wave />
      <div className="hero-content container">
        <div className="hero-kicker">
          <span className="status-dot" />
          Дизайн, разработка и технологии
        </div>
        <h1>
          <span>Создаём сайты,</span>
          <span>в которых ваш бизнес понятен.</span>
        </h1>
        <div className="hero-bottom">
          <p>От структуры и визуального стиля до запуска. Цифровые продукты, Telegram и AI — когда задача выходит за рамки сайта.</p>
          <div className="hero-actions">
            <Button>Обсудить проект</Button>
            <Button href="/projects" secondary>
              Смотреть проекты
            </Button>
          </div>
        </div>
      </div>
      <div className="hero-foot container">
        <a href="#manifesto">
          <ArrowDown size={15} />
          Листайте, чтобы узнать больше
        </a>
        <span>INDEPENDENT CREATIVE TECHNOLOGY</span>
        <span className="hero-index">01 — 09</span>
      </div>
    </section>
  );
}
export function Manifesto() {
  return (
    <section id="manifesto" className="manifesto section container">
      <span className="eyebrow">
        <i />
        Наш подход
      </span>
      <Reveal>
        <h2>
          Мы создаём не просто цифровые продукты.
          <span> Мы создаём возможности для бизнеса.</span>
        </h2>
      </Reveal>
      <div className="manifesto-bottom">
        <span className="small-symbol" aria-hidden="true">
          ✳
        </span>
        <p>
          Дизайн привлекает внимание. Технологии превращают его в действие. Мы соединяем их, чтобы
          решать вашу задачу — от первого экрана до процессов внутри компании.
        </p>
        <Link href="/about" className="text-link">
          Познакомиться со студией <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}
export function ServicesOverview() {
  return (
    <section className="services-overview container" aria-label="Направления работы">
      {services.map((service) => (
        <Link href={service.href} key={service.id}>
          <span>{service.title}</span><ArrowUpRight size={19} aria-hidden="true" />
        </Link>
      ))}
    </section>
  );
}
export function Approach() {
  return (
    <section className="approach-band">
      <div className="container approach-content">
        <h2>Сначала задача.<br />Затем решение.</h2>
        <div><p>Разбираемся в продукте и аудитории. Согласовываем структуру и визуальное направление. Разрабатываем, проверяем на телефонах и компьютерах, готовим к запуску.</p><p>Состав работ, сроки и бюджет обсуждаем до начала проекта.</p><Link href="/about" className="text-link">Как устроена работа <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </div>
    </section>
  );
}
export function AISection() {
  return (
    <section className="ai-section section">
      <AmbientBackdrop variant="network" />
      <div className="container">
        <SectionIntro
          label="Технологии со смыслом"
          title="Искусственный интеллект. Практические решения."
        >
          <p>
            Подключаем AI там, где он помогает работать: отвечать клиентам, обрабатывать заявки и
            освобождать время команды.
          </p>
        </SectionIntro>
        <AIFlow />
        <div className="ai-bottom">
          <p>
            AI-консультанты · Помощники в продажах · Интеграции с CRM
            <br />
            Внутренние инструменты · Обработка документов
          </p>
          <Button href="/services/ai" secondary>
            Возможности AI
          </Button>
        </div>
      </div>
    </section>
  );
}
export function AboutSection() {
  return (
    <section className="about-section section container">
      <div className="studio-signature" aria-hidden="true">
        <Brand compact />
        <small>
          Дизайн и технологии
          <br />в одной команде.
        </small>
      </div>
      <div className="about-copy">
        <span className="eyebrow">
          <i />
          Независимая студия
        </span>
        <h2>Студия с прямым диалогом.</h2>
        <p>
          За G. DESIGN — Артём Гензе и команда. Соединяем дизайн, разработку и современные технологии вокруг задачи бизнеса.
        </p>
        <p>
          Общаемся напрямую, вникаем в контекст и собираем решение вокруг вашей задачи. Остаёмся
          рядом после запуска.
        </p>
        <Link href="/about" className="text-link">
          Больше о студии <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}

