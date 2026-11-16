import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import 'lenis/dist/lenis.css';
import './globals.css';
import './art-direction.css';
import './refinement.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteUrl } from '@/lib/metadata';
import { SmoothScroll } from '@/components/motion/smooth-scroll';
import { SiteAnalytics } from '@/components/site-analytics';
const cyrillic = localFont({ src: './fonts/manrope-cyrillic.woff2', variable: '--font-manrope-cyrillic', display: 'swap', weight: '200 800' });
const latin = localFont({ src: './fonts/manrope-latin.woff2', variable: '--font-manrope-latin', display: 'swap', weight: '200 800' });
export const viewport: Viewport = { themeColor: '#09090f' };
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'G. DESIGN — Digital & AI Studio', template: '%s — G. DESIGN' },
  description: 'Сайты, цифровые продукты, Telegram и AI-решения для бизнеса.',
  robots: siteUrl.includes('localhost') || process.env.VERCEL_ENV === 'preview'
    ? { index: false, follow: false }
    : { index: true, follow: true },
  twitter: { card: 'summary_large_image' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // Wallet extensions add document attributes before hydration. Keep the exception at html;
    // React must still report mismatches inside the application's components.
    <html lang="ru" className={`${cyrillic.variable} ${latin.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body id="top">
        <a className="skip-link" href="#main">
          Перейти к содержимому
        </a>
        <Header />
        <SmoothScroll />
        <main id="main">{children}</main>
        <Footer />
        <SiteAnalytics enabled={process.env.VERCEL_ENV === 'production' && process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'} />
      </body>
    </html>
  );
}
