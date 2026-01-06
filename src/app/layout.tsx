"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";
import "./globals.css";

const NAV_LINKS = [
  { label: "Products", href: "#" },
  { label: "Developers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Templates", href: "#" },
];

const SOCIAL_LINKS = [
  {
    href: "https://github.com/wasmerio/wasmer",
    icon: "/github.svg",
    label: "GitHub (16k)",
    ariaLabel: "Wasmer GitHub repository - 16k stars",
  },
  {
    href: "https://discord.gg/wasmer",
    icon: "/discord.svg",
    label: "Discord",
    ariaLabel: "Join Wasmer Discord",
  },
];

function Logo() {
  return (
    <a
      href="#"
      className="shrink-0 transition-opacity hover:opacity-80"
      aria-label="Wasmer Home"
    >
      <Image
        className="h-7 w-auto dark:invert sm:h-9"
        src="/wasmer.svg"
        alt="Wasmer"
        width={123}
        height={36}
        priority
      />
    </a>
  );
}

function SearchBar() {
  return (
    <div className="relative min-w-0 flex-1 md:max-w-[310px] lg:ml-7 lg:max-w-full">
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
  );
}

function DesktopNav() {
  return (
    <ul className="hidden items-center space-x-7 font-bold lg:flex">
      {NAV_LINKS.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="whitespace-nowrap transition-colors hover:text-wasmer-text hover:underline hover:underline-offset-4"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function SocialButtons() {
  return (
    <div className="hidden items-center gap-2.5 md:flex lg:gap-3">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="btn-rounded flex items-center justify-center gap-1 text-xs lg:text-[13px]"
          aria-label={link.ariaLabel}
          style={
            link.label === "GitHub (16k)"
              ? { width: "50px" }
              : { width: "28px" }
          }
        >
          <Image
            src={link.icon}
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
          />
          {link.label === "GitHub (16k)" && <span>16k</span>}
        </a>
      ))}
      <a href="#" className="btn-rounded shrink-0 px-2.5 text-sm lg:px-3 lg:text-base">
        Sign in
      </a>
    </div>
  );
}

function MobileSignIn() {
  return (
    <a
      href="#"
      className="btn-rounded px-2 text-xs sm:px-3 sm:text-sm"
    >
      Sign in
    </a>
  );
}

function HamburgerButton({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex h-7 w-7 shrink-0 flex-col items-center justify-center gap-1 text-wasmer-text transition-opacity hover:opacity-70 lg:hidden"
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X size={18} />
      ) : (
        <>
          <span className="h-[2px] w-4 bg-wasmer-text sm:w-5" />
          <span className="h-[2px] w-4 bg-wasmer-text sm:w-5" />
        </>
      )}
    </button>
  );
}

function MobileMenuDropdown({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const handleLinkClick = () => onClose();

  return (
    <div className="absolute left-0 right-0 top-[72px] z-50 bg-light-gray-wash shadow-lg sm:top-[82px] lg:hidden">
      <nav className="p-6" aria-label="Mobile menu">
        <ul className="space-y-4">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="block py-2 text-right transition-colors hover:text-wasmer-text hover:underline hover:underline-offset-4"
                onClick={handleLinkClick}
              >
                {link.label}
              </a>
            </li>
          ))}
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href} className="md:hidden">
              <a
                href={link.href}
                className="flex items-center justify-end py-2 transition-colors hover:text-wasmer-text hover:underline hover:underline-offset-4"
                aria-label={link.ariaLabel}
                onClick={handleLinkClick}
              >
                <span className="mr-2">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative md:px-8 p-6 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-wasmer-border-grey after:w-screen after:-translate-x-1/2 after:left-1/2">
      <div className="flex items-center justify-between gap-4 lg:gap-3">
        {/* Logo and Search */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4 lg:flex-[0_1_710px]">
          <Logo />
          <SearchBar />
        </div>

        {/* Navigation */}
        <nav
          className="flex h-7 shrink-0 items-center gap-3 lg:gap-10"
          aria-label="Main navigation"
        >
          <DesktopNav />
          <SocialButtons />

          <div className="flex items-center gap-2 md:hidden">
            <MobileSignIn />
          </div>

          <HamburgerButton
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen(!isMenuOpen)}
          />
        </nav>
      </div>

      <MobileMenuDropdown
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 p-4 sm:p-6 md:flex-row md:p-8">
      <h3 className="sm:block md:hidden text-left text-[28px] font-semibold leading-[140%] text-wasmer-text">
        Discovering the Power of Wasmer: Revolutionizing Software Development
      </h3>

      <div className="flex flex-row items-center gap-2 sm:gap-4">
        <Image
          className="h-[36px] w-[29px] flex-shrink-0"
          src="/wasmer-logo-mark.svg"
          alt="Wasmer"
          width={29}
          height={36}
        />
        <p className="text-[16px] text-wasmer-darker-grey sm:text-base">
          Making software universally accessible
        </p>
      </div>

      <nav aria-label="Footer navigation">
        <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <li>
            <a
              href="#"
              className="text-sm transition-colors hover:text-wasmer-text hover:underline hover:underline-offset-4 sm:text-base"
            >
              Imprint
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm transition-colors hover:text-wasmer-text hover:underline hover:underline-offset-4 sm:text-base"
            >
              Privacy
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm transition-colors hover:text-wasmer-text hover:underline hover:underline-offset-4 sm:text-base"
            >
              Terms
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <head>
        <title>Wasmer - Making software universally accessible</title>
        <meta
          name="description"
          content="Search packages, users, and apps on Wasmer"
        />
      </head>
      <body className="bg-light-gray-wash text-wasmer-darker-grey antialiased">
        <div className="mx-auto max-w-[1440px]">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
