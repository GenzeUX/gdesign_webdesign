import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/metadata';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: siteUrl.includes('localhost') ? '/' : '/api/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
