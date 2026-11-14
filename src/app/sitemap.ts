import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/metadata';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '/',
    '/services',
    '/services/web',
    '/services/digital',
    '/services/telegram',
    '/services/ai',
    '/projects',
    '/projects/stonebridge',
    '/about',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
