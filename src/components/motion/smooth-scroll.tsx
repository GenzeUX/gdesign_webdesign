'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type Lenis from 'lenis';

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let instance: Lenis | undefined;
    let disposed = false;
    let generation = 0;

    const syncLock = () => {
      if (document.body.style.overflow === 'hidden') instance?.stop();
      else instance?.start();
    };
    const setup = async () => {
      const current = ++generation;
      instance?.destroy();
      instance = undefined;
      if (reduced.matches) return;
      const { default: Lenis } = await import('lenis');
      if (disposed || reduced.matches || current !== generation) return;
      instance = new Lenis({
        autoRaf: true,
        smoothWheel: true,
        lerp: 0.09,
        syncTouch: false,
        anchors: true,
        stopInertiaOnNavigate: true,
        prevent: (node) => Boolean(node.closest('textarea, select, [data-lenis-prevent]')),
      });
      syncLock();
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    reduced.addEventListener('change', setup);
    void setup();
    return () => {
      disposed = true;
      generation++;
      observer.disconnect();
      reduced.removeEventListener('change', setup);
      instance?.destroy();
    };
  }, [pathname]);

  return null;
}
