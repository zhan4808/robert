import './globals.css';
import { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Navbar from './components/Navbar';
import { ThemeProvider } from './ThemeContext';

// Define absolute URL for preview images
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://robert.vercel.app';

export const metadata = {
  title: 'robert',
  description: 'Personal website and blog',
  openGraph: {
    title: 'robert',
    description: 'Personal website and blog',
    url: siteUrl,
    siteName: 'robert',
    images: [
      {
        url: '/og-fallback.svg',
        width: 1200,
        height: 630,
        alt: 'robert',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'robert',
    description: 'Personal website and blog',
    images: ['/og-fallback.svg'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/gradient-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/gradient-icon.svg" />
        <meta property="og:image" content={`${siteUrl}/og-fallback.svg`} />
        <meta name="twitter:image" content={`${siteUrl}/og-fallback.svg`} />
      </head>
      <body className="bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        {/* Wrap the app with ThemeProvider */}
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}