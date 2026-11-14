import { PageHero } from '@/components/sections/page-hero';
import { Services } from '@/components/sections/services';
import { Contact } from '@/components/sections/contact';
import { pageMeta } from '@/lib/metadata';
export const metadata = pageMeta(
  'Услуги',
  'Четыре направления G. DESIGN: веб-разработка, цифровые продукты, Telegram и AI-автоматизация.',
  '/services',
);
export default function Page() {
  return (
    <>
      <PageHero
        label="Услуги"
        title="Собираем ваше цифровое будущее."
        description="Четыре направления. Общий подход: понять задачу, найти решение и довести его до работающего результата."
      />
      <Services full />
      <section className="service-note container">
        <h2>Начнём с вашей задачи</h2>
        <p>
          Не обязательно заранее выбирать технологию. Обсудим ситуацию и предложим подходящий набор
          инструментов. Стоимость и сроки рассчитываем индивидуально после определения объёма.
        </p>
      </section>
      <Contact />
    </>
  );
}
