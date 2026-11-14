import { projects } from '@/content/studio';
import { ProjectPlaceholder } from '@/components/sections/projects';
import { PageHero } from '@/components/sections/page-hero';
import { Contact } from '@/components/sections/contact';
import { pageMeta } from '@/lib/metadata';
import Image from 'next/image';
export const metadata = pageMeta(
  'StoneBridge',
  'StoneBridge — сайт для агентства недвижимости. Подробные материалы кейса готовятся.',
  '/projects/stonebridge',
);
export default function Page() {
  const p = projects[0];
  return (
    <>
      <PageHero label="Проект StoneBridge" title={p.name} description={p.category} />
      <div className="container">
        {p.screenshots[0] ? (
          <Image
            className="case-image"
            src={p.screenshots[0]}
            alt="Сайт StoneBridge"
            width={1600}
            height={1000}
            sizes="90vw"
          />
        ) : (
          <>
            <ProjectPlaceholder large />
            <p className="project-disclaimer">
              Концептуальная графическая обложка. Реальные скриншоты проекта будут добавлены
              отдельно.
            </p>
          </>
        )}
      </div>
      <section className="case-details section container">
        <h2>О проекте</h2>
        <div>
          <p>StoneBridge — сайт для агентства недвижимости.</p>
          {!p.task ? (
            <>
              <p>
                Готовим материалы для подробного рассказа о проекте. После их добавления здесь
                появятся задача, решение, галерея, технологии и ссылка на сайт.
              </p>
              <div className="case-pending">
                <span className="status-dot" />
                Подробности кейса готовятся
              </div>
            </>
          ) : null}
          {[
            ['Задача', p.task],
            ['Решение', p.solution],
            ['Результат', p.result],
          ].map(([label, value]) =>
            value ? (
              <div className="case-block" key={label}>
                <h3>{label}</h3>
                <p>{value}</p>
              </div>
            ) : null,
          )}
          {p.technologies?.length ? (
            <div className="case-block">
              <h3>Технологии</h3>
              <p>{p.technologies.join(', ')}</p>
            </div>
          ) : null}
          {p.url ? (
            <a className="text-link" href={p.url} target="_blank" rel="noreferrer">
              Посмотреть сайт ↗
            </a>
          ) : null}
        </div>
      </section>
      {p.gallery?.length ? (
        <section className="container case-gallery" aria-label="Галерея проекта">
          {p.gallery.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`StoneBridge — изображение ${i + 1}`}
              width={1600}
              height={1000}
              sizes="90vw"
            />
          ))}
        </section>
      ) : null}
      <Contact />
    </>
  );
}
