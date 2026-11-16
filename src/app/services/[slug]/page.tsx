import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/content/studio';
import { pageMeta } from '@/lib/metadata';
import { PageHero } from '@/components/sections/page-hero';
import { Contact } from '@/components/sections/contact';
import { ServiceArt } from '@/components/sections/services';
import { AIFlow } from '@/components/sections/ai-flow';
import { Button } from '@/components/ui';
import { projects } from '@/content/projects';
import Image from 'next/image';
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((s) => s.id === slug);
  return s ? pageMeta(s.title, s.description, s.href) : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params,
    s = services.find((s) => s.id === slug);
  if (!s) notFound();
  return (
    <>
      <PageHero label={s.title} title={s.headline} description={s.detail} />
      <div className="container service-hero-action"><Button href="#contact">Обсудить задачу</Button></div>
      <section className="service-detail container">
        <div className="service-detail-art">
          <ServiceArt type={s.shape} />
          <span>{s.english}</span>
        </div>
        <div>
          <h2>Что можем сделать</h2>
          <ul className="feature-list">
            {s.items.map((i) => (
              <li key={i}>
                {i}
              </li>
            ))}
          </ul>
          <p className="muted">
            Состав, сроки и стоимость определяем под задачу. Работа может начаться с консультации
            или отдельного этапа.
          </p>
        </div>
      </section>
      {s.id === 'web' ? <section className="container service-case section">
        <div><span className="eyebrow">Пример работы</span><h2>Сайт, который объединяет предложения агентства.</h2><p>{projects.find((project) => project.slug === 'stonebridge')!.summary}</p><Link className="text-link" href="/projects/stonebridge">Кейс Stone Bridge estate <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <Link href="/projects/stonebridge"><Image src="/images/projects/stonebridge/1.webp" width={800} height={404} unoptimized alt="Сайт Stone Bridge estate" /></Link>
      </section> : null}
      {s.id === 'ai' ? (
        <section className="container section">
          <h2 className="mb-10">Как это может работать</h2>
          <AIFlow />
        </section>
      ) : null}
      <section className="section container service-stages">
        <h2>От задачи к решению</h2>
        <ol>
          {s.stages.map((text, i) => (
            <li key={text}>
              <span>0{i + 1}</span>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="container result-section">
        <span className="eyebrow">
          <i />
          На выходе
        </span>
        <h2>Что вы получаете</h2>
        <ul>
          {s.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>
      <section className="container related">
        <h2>Другие направления</h2>
        {services
          .filter((item) => item.id !== s.id)
          .map((item) => (
            <Link href={item.href} key={item.id}>
              {item.title}
              <ArrowUpRight size={18} />
            </Link>
          ))}
      </section>
      <Contact service={s.title} />
    </>
  );
}
