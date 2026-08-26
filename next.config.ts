import type { NextConfig } from "next";

// Baseline security headers. Deliberately NOT a Content-Security-Policy yet:
// Next inlines scripts and the embedded Sanity Studio needs eval/blob/
// websockets, so a hasty CSP silently breaks /studio - it gets its own
// pass, report-only first. See HANDOFF.md.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
