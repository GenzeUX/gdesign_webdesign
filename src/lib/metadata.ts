import type { Metadata } from 'next';
import { resolveSiteUrl } from './site-url';
export const siteUrl = resolveSiteUrl(process.env);
export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — G. DESIGN`,
      description,
      url: path,
      locale: 'ru_RU',
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  };
}
