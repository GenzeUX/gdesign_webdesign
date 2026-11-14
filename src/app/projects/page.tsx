import { PageHero } from '@/components/sections/page-hero';
import { Projects } from '@/components/sections/projects';
import { Contact } from '@/components/sections/contact';
import { pageMeta } from '@/lib/metadata';
export const metadata = pageMeta(
  'Проекты',
  'Портфолио G. DESIGN. StoneBridge — сайт для агентства недвижимости.',
  '/projects',
);
export default function Page() {
  return (
    <>
      <PageHero
        label="Проекты"
        title="Идеи, получившие форму."
        description="Проекты на пересечении дизайна, технологий и задач бизнеса. Начинаем с StoneBridge; портфолио будет пополняться."
      />
      <Projects intro={false} />
      <Contact />
    </>
  );
}
