'use client';
import { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import { process } from '@/content/studio';
import { SectionIntro } from '../ui';
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 65%'] });
  return (
    <section className="section process container">
      <SectionIntro label="Как мы работаем" title="Понятный процесс. Продуманный результат." />
      <div ref={ref} className="process-list">
        <div className="process-line">
          <motion.span style={{ scaleY: scrollYProgress }} />
        </div>
        {process.map(([title, text], i) => (
          <div className="process-step" key={title}>
            <span className="step-number">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
