import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { featuredProjects, projects } from '@/content/projects';
import { SectionIntro } from '../ui';

export function Projects({ intro = true }: { intro?: boolean }) {
  const selection = intro ? featuredProjects : projects;
  return (
    <section className={`projects section container ${intro ? 'projects-featured' : ''}`} id="projects">
      {intro ? <SectionIntro label="Избранные проекты" title="Проекты, в которых идеи становятся реальностью" /> : null}
      <div className="projects-grid">
        {selection.map((project) => {
          const cover = project.images[project.cover];
          return (
            <article className="portfolio-entry" key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="project-link">
                <div className="portfolio-image">
                  <Image src={cover.src} alt={cover.caption} fill sizes={intro ? '(max-width: 767px) 90vw, 80vw' : '(max-width: 767px) 90vw, 45vw'} />
                </div>
                <div className="project-caption">
                  <div><h3>{project.name}</h3><p>{project.category}</p></div>
                  <span className="round-arrow"><ArrowUpRight aria-hidden="true" /><span className="sr-only">О проекте {project.name}</span></span>
                </div>
                <p className="portfolio-summary">{project.summary}</p>
              </Link>
            </article>
          );
        })}
      </div>
      {intro ? <Link href="/projects" className="text-link portfolio-all">Все проекты <span aria-hidden="true">↗</span></Link> : null}
    </section>
  );
}
