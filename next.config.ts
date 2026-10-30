import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        // AVIF where the browser supports it (roughly 20–30% smaller than WebP for the same quality), WebP otherwise.
        formats: ["image/avif", "image/webp"],
        // Optimized images are cached for 31 days instead of the default 60 seconds, so repeat visits don't refetch.
        // Replacing an image means giving it a new filename.
        minimumCacheTTL: 2678400,
        // Next 16 only serves listed qualities; project pages request 90.
        qualities: [75, 90],
        // Some project diagrams are SVGs. They are first-party files, so serving them through the optimizer is fine.
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    async headers() {
        return [
            {
                // Papers open in the browser instead of downloading.
                source: "/:path*\\.pdf",
                headers: [
                    { key: "Content-Type", value: "application/pdf" },
                    { key: "Content-Disposition", value: "inline" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                ],
            },
        ];
    },
    async redirects() {
        // The journal used to live under /blog.
        return [{ source: "/blog/:slug*", destination: "/writing/:slug*", permanent: true }];
    },
    skipTrailingSlashRedirect: true,
};

export default nextConfig;
