'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Brand } from '../ui';
const links = [
  ['Услуги', '/services'],
  ['Проекты', '/projects'],
  ['Студия', '/about'],
  ['Контакты', '/#contact'],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () =>
      Array.from(menu.current?.querySelectorAll<HTMLAnchorElement>('a') || []);
    focusable()[0]?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
      if (event.key === 'Tab') {
        const all: HTMLElement[] = [trigger.current!, ...focusable()];
        const current = all.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        all[(current + (event.shiftKey ? -1 : 1) + all.length) % all.length]?.focus();
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', key);
    };
  }, [open]);
  return (
    <header className="header" data-scrolled={scrolled} data-menu-open={open}>
      <Link href="/" aria-label="G. DESIGN — главная" onClick={() => setOpen(false)}>
        <Brand />
      </Link>
      <nav className="desktop-nav" aria-label="Основная навигация">
        {links.map(([name, href]) => (
          <Link key={href} href={href} aria-current={href === path ? 'page' : undefined}>
            {name}
          </Link>
        ))}
      </nav>
      <Link className="header-cta" href="/#contact">
        Обсудить проект <ArrowUpRight size={15} />
      </Link>
      <button
        className="menu-trigger"
        ref={trigger}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      {open ? (
        <nav ref={menu} id="mobile-menu" className="mobile-menu" aria-label="Мобильная навигация">
          {links.map(([name, href], i) => (
            <Link
              key={href}
              href={href}
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              <span>0{i + 1}</span>
              {name}
              <ArrowUpRight />
            </Link>
          ))}
          <p>Дизайн. Технологии. Возможности.</p>
        </nav>
      ) : null}
    </header>
  );
}
