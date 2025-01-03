import './globals.css';
import { ReactNode } from 'react';
import Navbar from './components/Navbar'; // <-- path to your file

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}