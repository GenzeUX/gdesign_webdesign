'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { track } from '@vercel/analytics';
import { trackStudioEvent, type EventContext, type StudioEvent } from '@/lib/tracking';

export function SiteAnalytics({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const seen = useRef(new Set<string>());
  useEffect(() => {
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<{ name: StudioEvent; context: EventContext }>).detail;
      if (enabled && process.env.NEXT_PUBLIC_ANALYTICS_CUSTOM_EVENTS === 'true') {
        track(detail.name, { ...detail.context });
      }
    };
    window.addEventListener('studio:analytics', receive);
    return () => window.removeEventListener('studio:analytics', receive);
  }, [enabled]);
  useEffect(() => {
    if (pathname.startsWith('/projects/') && !seen.current.has(pathname)) {
      seen.current.add(pathname);
      trackStudioEvent('case_view', { project: pathname.split('/').at(-1) });
    }
    const projects = document.getElementById('projects');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !seen.current.has(`portfolio:${pathname}`)) {
        seen.current.add(`portfolio:${pathname}`);
        trackStudioEvent('portfolio_view');
      }
    }, { threshold: 0.1 });
    if (projects) observer.observe(projects);
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!link) return;
      if (link.hash === '#contact') trackStudioEvent('contact_click');
      if (link.hostname === 't.me') trackStudioEvent('telegram_open');
    };
    document.addEventListener('click', click);
    return () => { observer.disconnect(); document.removeEventListener('click', click); };
  }, [pathname]);
  return enabled ? <Analytics beforeSend={(event) => {
    const url = new URL(event.url);
    return { ...event, url: `${url.origin}${url.pathname}` };
  }} /> : null;
}
