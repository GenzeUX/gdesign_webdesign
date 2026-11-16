import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { featuredProjects, projects, projectCover, restoredPreviews } from '@/content/projects';
import { ImageProvenance } from './image-provenance';
import { SectionIntro } from '../ui';

export function Projects({ intro = true }: { intro?: boolean }) {
  const selection = intro ? featuredProjects.slice(0, 2) : projects;
  return (
    <section className={`projects section container ${intro ? 'projects-featured' : ''}`} id="projects">
      {intro ? <SectionIntro label="Избранные проекты" title="Работы, которые рассказывают за нас." /> : null}
      <div className="projects-grid">
        {selection.map((project) => {
          const cover = projectCover(project);
          return (
            <article className="portfolio-entry" key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="project-link">
                <div className="portfolio-image">
                  <Image src={cover.src} alt={cover.caption} width={cover.width} height={cover.height} unoptimized={!restoredPreviews[project.slug]} quality={90} sizes="(max-width: 767px) 88vw, (max-width: 1500px) 42vw, 640px" />
                </div>
                <div className="project-caption">
                  <div>{intro ? <h3>{project.name}</h3> : <h2>{project.name}</h2>}<p>{project.category}</p></div>
                  <span className="round-arrow"><ArrowUpRight aria-hidden="true" /><span className="sr-only">О проекте {project.name}</span></span>
                </div>
                <p className="portfolio-summary">{project.summary}</p>
              </Link>
              <ImageProvenance project={project} compact />
            </article>
          );
        })}
      </div>
      {intro ? <Link href="/projects" className="text-link portfolio-all">Все проекты <span aria-hidden="true">↗</span></Link> : null}
    </section>
  );
}
