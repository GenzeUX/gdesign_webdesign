import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
export function Button({
  children,
  href = '/#contact',
  secondary = false,
  className = '',
}: {
  children: ReactNode;
  href?: string;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`button ${secondary ? 'button-secondary' : ''} ${className}`}>
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}
export function SectionIntro({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-intro">
      <span className="eyebrow">
        <i />
        {label}
      </span>
      <div>
        <h2>{title}</h2>
        {children ? <div className="intro-copy">{children}</div> : null}
      </div>
    </div>
  );
}
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand ${compact ? 'brand-compact' : ''}`}>
      G<span className="brand-dot">.</span>
      {compact ? null : <span className="brand-name">DESIGN</span>}
    </span>
  );
}
