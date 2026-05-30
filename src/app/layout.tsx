import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "robert zhang",
  description: "Robert Zhang — EE student, systems builder.",
  icons: {
    icon: "/site-icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="antialiased font-mono">
        {children}
      </body>
    </html>
  );
}
