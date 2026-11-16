import { Hero, ServicesOverview, Approach, AISection, AboutSection } from '@/components/sections/home';
import { Projects } from '@/components/sections/projects';
import { Process } from '@/components/sections/process';
import { Contact } from '@/components/sections/contact';
import { pageMeta } from '@/lib/metadata';
import { FAQ } from '@/components/sections/faq';
export const metadata = pageMeta(
  'Digital & AI Studio',
  'Технологии, которые работают на ваш бизнес. Веб-разработка, цифровые продукты, Telegram и AI-автоматизация.',
  '/',
);
export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <Projects />
      <Approach />
      <AISection />
      <AboutSection />
      <Process />
      <FAQ />
      <Contact />
    </>
  );
}
