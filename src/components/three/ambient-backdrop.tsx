'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { AmbientVariant } from './ambient-scene';

const Scene = dynamic(() => import('./ambient-scene').then((module) => module.AmbientScene), {
  ssr: false,
});

function StaticEnvironment({ variant }: { variant: AmbientVariant }) {
  return (
    <svg className="ambient-fallback" viewBox="0 0 500 500" fill="none" focusable="false">
      {variant === 'orbits' ? (
        <g transform="translate(250 250) rotate(-24)">
          <ellipse rx="188" ry="92" />
          <ellipse rx="181" ry="105" transform="rotate(27)" />
          <ellipse rx="174" ry="118" transform="rotate(54)" />
          <ellipse rx="167" ry="130" transform="rotate(81)" />
          <path className="ambient-static-highlight" d="M-183-22c24-57 122-92 221-62" />
        </g>
      ) : (
        <g>
          <path d="m250 100 114 65 19 121-90 99-124-22-60-102 40-109Zm0 0 0 150 114-85M250 250l133 36m-133-36 43 135m-43-135-81 113m81-113-141 11m141-11-101-98m20 211 195-198M149 152l144 233" />
          {[
            [250, 100],
            [364, 165],
            [383, 286],
            [293, 385],
            [169, 363],
            [109, 261],
            [149, 152],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3" />
          ))}
          <circle className="ambient-static-core" cx="250" cy="250" r="6" />
          <circle cx="250" cy="250" r="18" />
        </g>
      )}
    </svg>
  );
}

export function AmbientBackdrop({ variant }: { variant: AmbientVariant }) {
  const stage = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const desktop = matchMedia('(min-width: 768px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () =>
      setEligible(
        desktop.matches &&
          !reduced.matches &&
          !('deviceMemory' in navigator && (navigator.deviceMemory as number) <= 2) &&
          !('connection' in navigator && (navigator.connection as { saveData?: boolean }).saveData),
      );
    update();
    desktop.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!eligible || !stage.current || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '180px' },
    );
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [eligible, near]);

  return (
    <div className={`ambient-backdrop ambient-backdrop--${variant}`} aria-hidden="true">
      <div className="ambient-stage" ref={stage}>
        <StaticEnvironment variant={variant} />
        {eligible && near ? <Scene variant={variant} /> : null}
      </div>
    </div>
  );
}
