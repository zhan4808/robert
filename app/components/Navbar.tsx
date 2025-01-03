'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const pathname = usePathname();

  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(currentScrollPos < lastScrollPos);
      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollPos]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 bg-transparent"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.3 }}
        >
          <div className="mx-auto flex h-16 max-w-[55%] items-center justify-between px-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                {/* Light Mode Logo */}
                <img
                  src="/rob-logo-light.svg"
                  alt="Rob Logo Light"
                  className="h-14 w-auto block dark:hidden"
                />
                {/* Dark Mode Logo */}
                <img
                  src="/rob-logo-dark.svg"
                  alt="Rob Logo Dark"
                  className="h-14 w-auto hidden dark:block"
                />
              </Link>
            </div>

            {/* Centered Nav Items */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={
                          isActive
                            ? 'text-red-600 dark:text-red-600'
                            : 'text-navy-800 dark:text-navy-200 hover:text-red-800 dark:hover:text-red-800'
                        }
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Theme Toggle (Moon Icon) */}
            <button onClick={handleThemeToggle} className="focus:outline-none">
              <img
                src={darkMode ? '/moon-dark.svg' : '/moon-light.svg'}
                alt="Theme Toggle"
                className="h-6 w-6"
              />
            </button>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}