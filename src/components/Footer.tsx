import Image from "next/image";
import Link from "next/link";

/**
 * Footer link configuration
 * @property {string} label - Display text for link
 * @property {string} href - Target URL
 */
interface FooterLink {
  label: string;
  href: string;
}

const FOOTER_LINKS: FooterLink[] = [
  { label: "Imprint", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

/**
 * Footer - Application footer with branding and links
 * Displays company tagline and navigation links
 * @component
 */
export function Footer() {
  return (
    <footer className="relative flex flex-col gap-4 p-4 items-center justify-between sm:p-6 md:flex-row md:p-8 after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-wasmer-border-grey after:w-screen after:-translate-x-1/2 after:left-1/2">
      <div className="flex flex-row gap-2 items-center text-center sm:gap-4">
        <Image
          className="h-[36px] w-[29px]"
          src="/wasmer-logo-mark.svg"
          alt="Wasmer"
          width={29}
          height={36}
        />
        <div className="flex flex-col items-start gap-2">
          <p className="text-[16px] text-wasmer-darker-grey sm:text-base">
            Making software universally accessible
          </p>
        </div>
      </div>

      <nav aria-label="Footer navigation">
        <ul className="flex flex-wrap gap-3 justify-center sm:gap-4">
          {FOOTER_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-bold underline-offset-4 transition-colors hover:text-wasmer-text hover:underline sm:text-base"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
