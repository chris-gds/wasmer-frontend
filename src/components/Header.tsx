"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

/**
 * Navigation link configuration
 * @property {string} label - Display text for link
 * @property {string} href - Target URL
 */
interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Products", href: "#" },
  { label: "Developers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Templates", href: "#" },
];

/**
 * Header - Responsive navigation header with mobile menu
 * Features:
 * - Responsive logo and search input
 * - Desktop navigation with external links
 * - Mobile-friendly hamburger menu
 * - Keyboard accessible
 * @component
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass =
    "whitespace-nowrap underline-offset-4 transition-colors hover:text-wasmer-text hover:underline";
  const mobileNavLinkClass =
    "block py-2 text-right underline-offset-4 transition-colors hover:text-wasmer-text hover:underline";

  return (
    <header className="relative p-6 md:px-8 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:w-screen after:bg-wasmer-border-grey after:-translate-x-1/2 after:left-1/2">
      <div className="flex items-center justify-between gap-4 lg:gap-3">
        {/* Logo and Search */}
        <div className="flex min-w-0 flex-1 gap-2 items-center sm:gap-4 lg:flex-[0_1_710px]">
          <Link
            href="/"
            className="shrink-0 transition-opacity hover:opacity-80"
            aria-label="Wasmer Home"
          >
            <Image
              className="h-7 w-auto sm:h-9"
              src="/wasmer.svg"
              alt="Wasmer"
              width={123}
              height={36}
              priority
            />
          </Link>
          <div className="relative min-w-0 flex-1 md:max-w-77.5 lg:ml-7 lg:max-w-full">
            <Input
              type="search"
              id="site-search"
              name="q"
              placeholder="Search packages, users or apps"
              className="h-9 w-full rounded-none border-none bg-input-bg pl-9 text-sm font-medium leading-9 text-input-text placeholder:text-input-text md:text-base"
              aria-label="Search packages, users or apps"
            />
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-input-text"
              size={16}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Navigation - Responsive */}
        <nav
          className="flex h-7 shrink-0 gap-3 items-center lg:gap-10"
          aria-label="Main navigation"
        >
          {/* Navigation List - Desktop Only */}
          <ul className="hidden space-x-7 items-center font-bold lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}

            {/* External Links - Grouped */}
            <li className="pl-7 flex gap-2.5 items-center">
              <a
                href="https://github.com/wasmerio/wasmer"
                className="btn-rounded w-12.5 p-1 shrink-0 text-xs lg:w-13.75 lg:text-[13px]"
                aria-label="Wasmer GitHub repository - 16k stars"
              >
                <Image
                  className="mr-0.5 lg:mr-1"
                  src="/github.svg"
                  alt=""
                  width={14}
                  height={14}
                  aria-hidden="true"
                />
                16k
              </a>

              <a
                href="https://discord.gg/wasmer"
                className="btn-rounded w-7 p-1 shrink-0"
                aria-label="Join Wasmer Discord"
              >
                <Image
                  src="/discord.svg"
                  alt=""
                  width={14}
                  height={14}
                  aria-hidden="true"
                />
              </a>

              <Link href="#" className="btn-rounded shrink-0 px-2.5 text-sm lg:px-3 lg:text-base">
                Sign in
              </Link>
            </li>
          </ul>

          {/* Mobile Sign in + Hamburger */}
          <div className="flex gap-2 items-center md:hidden">
            <Link
              href="#"
              className="btn-rounded px-2 text-xs sm:px-3 sm:text-sm"
            >
              Sign in
            </Link>
          </div>

          {/* Hamburger Menu Button - Mobile/Tablet */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-7 w-7 shrink-0 flex-col gap-1 items-center justify-center text-wasmer-text transition-opacity hover:opacity-70 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X size={18} />
            ) : (
              <>
                <span className="h-0.5 w-4 bg-wasmer-text sm:w-5" />
                <span className="h-0.5 w-4 bg-wasmer-text sm:w-5" />
              </>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile/Tablet Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-18 z-50 bg-light-gray-wash shadow-lg sm:top-20.5 lg:hidden">
          <nav className="p-6" aria-label="Mobile menu">
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={mobileNavLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Mobile only - show GitHub and Discord in menu */}
              <li className="md:hidden">
                <a
                  href="https://github.com/wasmerio/wasmer"
                  className="flex items-center justify-end py-2 underline-offset-4 transition-colors hover:text-wasmer-text hover:underline"
                  aria-label="Wasmer GitHub repository - 16k stars"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">GitHub (16k)</span>
                </a>
              </li>
              <li className="md:hidden">
                <a
                  href="https://discord.gg/wasmer"
                  className="flex items-center justify-end py-2 underline-offset-4 transition-colors hover:text-wasmer-text hover:underline"
                  aria-label="Join Wasmer Discord"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">Discord</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
