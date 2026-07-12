import type { NextConfig } from 'next';

/**
 * next.config is loaded before the full app tree is available in some Docker images
 * (only next.config.ts is copied). Do not import `lib/config/environment` here — keep
 * env reads inline so `next start` resolves. The app uses {@link ENVIRONMENT} everywhere else.
 */
function buildImageRemotePatterns(): NonNullable<NextConfig['images']>['remotePatterns'] {
  const patterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
    { protocol: 'https', hostname: 'static.crelyst.com.ng', pathname: '/**' },
    { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    { protocol: 'https', hostname: 'via.placeholder.com', pathname: '/**' },
    { protocol: 'https', hostname: 'randomuser.me', pathname: '/**' },
    { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/**' },
    { protocol: 'https', hostname: 'fonts.gstatic.com', pathname: '/**' },
    { protocol: 'https', hostname: '*.r2.dev', pathname: '/**' },
    { protocol: 'https', hostname: '*.r2.cloudflarestorage.com', pathname: '/**' },
  ];

  const r2Url = process.env.R2_PUBLIC_URL ?? process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (r2Url) {
    try {
      const { hostname } = new URL(r2Url);
      if (hostname && !patterns.some(p => 'hostname' in p && p.hostname === hostname)) {
        patterns.push({ protocol: 'https', hostname, pathname: '/**' });
      }
    } catch {
      /* ignore invalid URL */
    }
  }

  return patterns;
}

import type { Redirect } from 'next/dist/lib/load-custom-routes';

function buildCanonicalHostRedirects(): Redirect[] {
  const liveUrl = process.env.live_url || 'https://crelyst.com.ng';

  try {
    const canonical = new URL(liveUrl);
    const host = canonical.hostname;

    if (host.startsWith('www.')) {
      const bareHost = host.slice(4);
      return [
        {
          source: '/:path*',
          has: [{ type: 'host' as const, value: bareHost }],
          destination: `${canonical.protocol}//${host}/:path*`,
          permanent: true,
        },
      ];
    }

    return [
      {
        source: '/:path*',
        has: [{ type: 'host' as const, value: `www.${host}` }],
        destination: `${canonical.protocol}//${host}/:path*`,
        permanent: true,
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: buildImageRemotePatterns(),
  },
  async redirects() {
    return buildCanonicalHostRedirects();
  },
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        // Next.js 16 and some third-party scripts may require unsafe-inline / unsafe-eval.
        // Tighten further only after verifying production script requirements.
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "img-src 'self' data: blob: https:",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
          "style-src 'self' 'unsafe-inline' https:",
          "font-src 'self' data: https:",
          "connect-src 'self' https: wss:",
          "frame-ancestors 'self'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      },
    ];

    if (process.env.NODE_ENV === 'production') {
      security.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      });
    }

    return [
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, ...security],
      },
      {
        source: '/:path*',
        headers: security,
      },
    ];
  },
  // Mark @react-email/render as external to prevent build-time analysis
  // This avoids React 19 compatibility issues during build
  serverExternalPackages: ['@react-email/render'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize @react-email/render for server bundle to avoid React 19 compatibility issues
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('@react-email/render');
      } else {
        config.externals = [config.externals, '@react-email/render'];
      }
    }
    return config;
  },
  experimental: {
    // Ensure server components can use external packages
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
