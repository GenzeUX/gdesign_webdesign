import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/content/studio';
import { SectionIntro } from '../ui';
export function ProjectPlaceholder({ large = false }: { large?: boolean }) {
  return (
    <div className={`project-placeholder ${large ? 'project-placeholder-large' : ''}`}>
      <div className="architectural-grid" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="project-monogram" aria-hidden="true">
        SB
      </div>
      <div className="placeholder-caption">
        <span className="status-dot" />
        Визуальные материалы готовятся
      </div>
    </div>
  );
}
export function Projects({ intro = true }: { intro?: boolean }) {
  return (
    <section className="projects section container" id="projects">
      {intro ? (
        <SectionIntro
          label="Избранный проект"
          title="Проекты, в которых идеи становятся реальностью"
        />
      ) : null}
      {projects.map((project) => (
        <article className="project-entry" key={project.slug}>
          <Link href={`/projects/${project.slug}`} className="project-link">
            {project.screenshots[0] ? (
              <div className="project-image">
                <Image
                  src={project.screenshots[0]}
                  alt={`Сайт ${project.name}`}
                  fill
                  sizes="(max-width: 767px) 90vw, 90vw"
                />
              </div>
            ) : (
              <ProjectPlaceholder />
            )}
            <div className="project-caption">
              <div>
                <h3>{project.name}</h3>
                <p>{project.category}</p>
              </div>
              <span className="project-category">Веб-разработка</span>
              <span className="round-arrow">
                <ArrowUpRight />
                <span className="sr-only">О проекте {project.name}</span>
              </span>
            </div>
          </Link>
          {!project.screenshots.length ? (
            <p className="project-disclaimer">
              Здесь появятся реальные изображения и подробности проекта. Сейчас представлена
              графическая обложка, а не скриншот сайта.
            </p>
          ) : null}
        </article>
      ))}
    </section>
  );
}
