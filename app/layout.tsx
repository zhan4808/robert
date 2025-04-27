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
  description: 'robert zhang - about me',
  openGraph: {
    title: 'robert',
    description: 'robert zhang - about me',
    url: siteUrl,
    siteName: 'robert',
    images: [
      {
        url: '/WEBP to JPG 1.jpg',
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
    description: 'robert zhang - about me',
    images: ['/WEBP to JPG 1.jpg'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/WEBP to JPG 1.jpg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/WEBP to JPG 1.jpg" />
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