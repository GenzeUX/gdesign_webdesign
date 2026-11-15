import { PageHero } from '@/components/sections/page-hero';
import { Projects } from '@/components/sections/projects';
import { Contact } from '@/components/sections/contact';
import { pageMeta } from '@/lib/metadata';
export const metadata = pageMeta(
  'Проекты',
  'Кейсы G. DESIGN: сайты для строительных компаний, девелоперов, агентства недвижимости и сервиса ремонта.',
  '/projects',
);
export default function Page() {
  return (
    <>
      <PageHero
        label="Проекты"
        title="Идеи, получившие форму."
        description="Восемь историй о том, как дизайн, структура и технологии помогают бизнесу. Строительство, недвижимость и ремонт — в работах Артёма Гензе и команды G. DESIGN."
      />
      <Projects intro={false} />
      <Contact />
    </>
  );
}
