"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Index" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex items-center justify-between gap-4 border-b border-border pb-2.5">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <img
            src="/rob-logo-dark.svg"
            alt="Robert Zhang logo"
            className="h-6 w-6"
          />
        </Link>
      </div>
      <div className="relative flex gap-0">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative px-2 block group"
          >
            <div
              className={cn(
                "relative z-10 rounded-md px-2 py-1 transition-colors duration-300",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </div>
            {isActive(item.href) && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-foreground rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
