import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/content/projects';
import { PageHero } from '@/components/sections/page-hero';
import { Contact } from '@/components/sections/contact';
import { pageMeta } from '@/lib/metadata';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return pageMeta(project.name, project.summary, `/projects/${slug}`);
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const cover = project.images[project.cover];
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <PageHero label="Портфолио" title={project.name} description={project.summary} />
      <div className="container case-overview">
        <div className="case-navigation"><Link className="text-link" href="/projects">← Все проекты</Link><span>{project.category}</span></div>
        <Image className="case-image" src={cover.src} alt={cover.caption} width={cover.width} height={cover.height} sizes="(max-width: 767px) 90vw, 1200px" preload />
      </div>
      <section className="case-details section container">
        <h2>О проекте</h2>
        <div>
          <div className="case-block"><h3>Задача</h3><p>{project.task}</p></div>
          <div className="case-block"><h3>Решение</h3><p>{project.solution}</p></div>
          <div className="case-block"><h3>Результат</h3><ul className="case-results">{project.results.map((result) => <li key={result}>{result}</li>)}</ul></div>
          <p className="case-source">Результаты — по данным опубликованного кейса. <a href={project.source} target="_blank" rel="noreferrer">Кейс в Telegram ↗</a></p>
        </div>
      </section>
      {project.images.length > 1 ? (
        <section className="container case-gallery" aria-label={`Материалы проекта ${project.name}`}>
          <h2>Детали проекта</h2>
          {project.images.map((image) => (
            <figure key={image.src}>
              <Image src={image.src} alt={image.caption} width={image.width} height={image.height} sizes="(max-width: 767px) 90vw, 1200px" />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </section>
      ) : null}
      <div className="container case-next"><span>Следующий проект</span><Link href={`/projects/${next.slug}`}>{next.name}<span aria-hidden="true">↗</span></Link></div>
      <Contact />
    </>
  );
}
