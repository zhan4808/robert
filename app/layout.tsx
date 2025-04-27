import './globals.css';
import { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Navbar from './components/Navbar';
import { ThemeProvider } from './ThemeContext';

export const metadata = {
  title: 'robert',
  description: 'Personal website and blog',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/gradient-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/gradient-icon.svg" />
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