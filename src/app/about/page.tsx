import { PageHero } from '@/components/sections/page-hero';
import { AboutSection } from '@/components/sections/home';
import { Process } from '@/components/sections/process';
import { Contact } from '@/components/sections/contact';
import { SectionIntro } from '@/components/ui';
import { pageMeta } from '@/lib/metadata';
export const metadata = pageMeta(
  'О студии',
  'G. DESIGN — небольшая независимая команда. Дизайн, разработка и AI с вниманием к задачам бизнеса.',
  '/about',
);
export default function Page() {
  return (
    <>
      <PageHero
        label="Студия"
        title="Близко к задаче. Открыто к новому."
        description="Мы объединяем дизайн, разработку и современные технологии, чтобы помогать бизнесу двигаться вперёд."
      />
      <AboutSection />
      <section className="section values container">
        <SectionIntro label="Наши принципы" title="За хорошим продуктом — внимательная работа." />
        <div>
          {[
            [
              'Прямой диалог',
              'Оперативно обсуждаем вопросы и держим вас в курсе того, что происходит с проектом.',
            ],
            [
              'Индивидуальный подход',
              'Начинаем с контекста вашего бизнеса, а затем выбираем форму и технологии.',
            ],
            ['Целостное решение', 'Учитываем и интерфейс, и процессы, которые стоят за ним.'],
            ['Связь после запуска', 'Помогаем пользоваться продуктом и планировать его развитие.'],
          ].map(([t, d]) => (
            <article key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
        <p className="experience-note">
          В предыдущем опыте — ведение Telegram-каналов о психологии, криптовалютах, трейдинге и
          строительстве домов.
        </p>
      </section>
      <Process />
      <Contact />
    </>
  );
}
