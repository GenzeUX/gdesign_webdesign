import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { studio } from '@/content/studio';
export function Footer() {
  return (
    <footer className="footer container">
      <div className="footer-top">
        <p>
          Дизайн. Технологии.
          <br />
          Новые возможности.
        </p>
        <nav aria-label="Навигация в подвале">
          <Link href="/services">Услуги</Link>
          <Link href="/projects">Проекты</Link>
          <Link href="/about">Студия</Link>
          <Link href="/#contact">Контакты</Link>
        </nav>
        <div>
          <a href={studio.telegram} target="_blank" rel="noreferrer">
            Telegram <ArrowUpRight size={14} />
          </a>
          <a href={`mailto:${studio.email}`}>{studio.email}</a>
          <a href="tel:+79139490753">{studio.phone}</a>
        </div>
      </div>
      <Link href="/" className="footer-wordmark" aria-label="G. DESIGN — главная">
        G<span>.</span> DESIGN
      </Link>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} G. DESIGN</span>
        <span>Независимая digital & AI студия</span>
        <a href="#top">Наверх ↑</a>
      </div>
    </footer>
  );
}
