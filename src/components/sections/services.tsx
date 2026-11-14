import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/content/studio';
import { SectionIntro } from '../ui';
import { Reveal } from '../motion/reveal';
import { ServiceIcon } from '../graphics/service-icons';
import { AmbientBackdrop } from '../three/ambient-backdrop';
export function ServiceArt({ type }: { type: string }) {
  return (
    <div className={`service-art service-drawing drawing-${type}`} aria-hidden="true">
      <ServiceIcon kind={type} />
    </div>
  );
}
export function Services({ full = false }: { full?: boolean }) {
  return (
    <section className="services section container" id="services">
      <AmbientBackdrop variant="orbits" />
      {full ? null : (
        <SectionIntro label="Наши направления" title="От идеи до цифровой экосистемы" />
      )}
      <div className="services-list">
        {services.map((service) => (
          <Reveal key={service.id}>
            <Link href={service.href} className={`service-row service-${service.id}`}>
              <span className="service-number">{service.number}</span>
              <div className="service-main">
                <span className="service-english">{service.english}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <ServiceArt type={service.shape} />
              <span className="round-arrow">
                <ArrowUpRight size={25} />
                <span className="sr-only">Подробнее</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
