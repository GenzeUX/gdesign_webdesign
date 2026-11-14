import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource-variable/space-grotesk';
import 'lenis/dist/lenis.css';
import './globals.css';
import './art-direction.css';
import './refinement.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteUrl } from '@/lib/metadata';
import { SmoothScroll } from '@/components/motion/smooth-scroll';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'G. DESIGN — Digital & AI Studio', template: '%s — G. DESIGN' },
  description: 'Сайты, цифровые продукты, Telegram и AI-решения для бизнеса.',
  robots: siteUrl.includes('localhost')
    ? { index: false, follow: false }
    : { index: true, follow: true },
  twitter: { card: 'summary_large_image' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // Wallet extensions add document attributes before hydration. Keep the exception at html;
    // React must still report mismatches inside the application's components.
    <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body id="top">
        <a className="skip-link" href="#main">
          Перейти к содержимому
        </a>
        <Header />
        <SmoothScroll />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
