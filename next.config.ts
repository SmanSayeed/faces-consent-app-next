import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async headers() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Fallback or empty if not set (though it should be)
    const socketUrl = supabaseUrl ? supabaseUrl.replace('https://', 'wss://') : '';

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: ${supabaseUrl};
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              connect-src 'self' ${supabaseUrl} ${socketUrl} https://va.vercel-scripts.com;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ]
  },
};

export default nextConfig;
