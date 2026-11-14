import { Hero, Manifesto, AISection, AboutSection } from '@/components/sections/home';
import { Services } from '@/components/sections/services';
import { Projects } from '@/components/sections/projects';
import { Process } from '@/components/sections/process';
import { Contact } from '@/components/sections/contact';
import { pageMeta } from '@/lib/metadata';
export const metadata = pageMeta(
  'Digital & AI Studio',
  'Технологии, которые работают на ваш бизнес. Веб-разработка, цифровые продукты, Telegram и AI-автоматизация.',
  '/',
);
export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <AISection />
      <Projects />
      <AboutSection />
      <Process />
      <Contact />
    </>
  );
}
