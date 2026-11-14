'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const Scene = dynamic(() => import('./wave-scene').then((m) => m.WaveScene), {
  ssr: false,
});
export function Wave() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () =>
      setEnabled(
        !query.matches &&
          !('deviceMemory' in navigator && (navigator.deviceMemory as number) <= 2) &&
          !('connection' in navigator && (navigator.connection as { saveData?: boolean }).saveData),
      );
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return (
    <div className="wave-art" aria-hidden="true">
      <div className="wave-fallback" />
      {enabled ? <Scene /> : null}
      <div className="wave-shade" />
    </div>
  );
}
