type Environment = Record<string, string | undefined>;

export function resolveSiteUrl(env: Environment): string {
  const hostname = env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
  const value = env.NEXT_PUBLIC_SITE_URL?.trim() || (hostname ? `https://${hostname}` : 'http://localhost:3000');
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Site URL must use HTTP or HTTPS');
  return url.origin;
}

export function allowedSiteOrigins(env: Environment): Set<string> {
  const origins = new Set([resolveSiteUrl(env)]);
  for (const hostname of [env.VERCEL_PROJECT_PRODUCTION_URL, env.VERCEL_URL, env.VERCEL_BRANCH_URL]) {
    if (hostname) origins.add(new URL(`https://${hostname}`).origin);
  }
  return origins;
}
