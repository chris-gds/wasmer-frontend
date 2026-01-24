import Link from "next/link";
import { ReactNode } from "react";

/**
 * ButtonProps - Configuration for Button and Link components
 * @interface ButtonProps
 * @property {string} [href] - URL for Link component (renders as Link if provided)
 * @property {ReactNode} label - Button/link text or content
 * @property {"primary" | "secondary" | "disabled" | "success"} [variant] - Visual style variant (default: "primary")
 * @property {() => void} [onClick] - Click handler for button element
 * @property {string} [className] - Additional Tailwind classes
 * @property {boolean} [disabled] - Disable button/link interaction
 * @property {string} [ariaLabel] - Accessibility label
 * @property {"button" | "submit" | "reset"} [type] - HTML button type (default: "button")
 */
interface ButtonProps {
  href?: string;
  label: ReactNode;
  variant?: "primary" | "secondary" | "disabled" | "success";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
}

/**
 * Button - Flexible button component that renders as Link or button
 * Supports primary and secondary variants with consistent styling
 * @component
 * @example
 * // Renders as Link
 * <Button href="/deploy" label="Deploy" variant="primary" />
 *
 * // Renders as button
 * <Button label="Visit Demo" variant="secondary" onClick={handleClick} />
 */
export function Button({
  href,
  label,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  ariaLabel,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "flex items-center justify-center gap-3 h-9 px-3 font-semibold rounded-full transition-all duration-200 border";

  const variants = {
    primary:
      "w-full border-wasmer-text bg-wasmer-text text-white hover:bg-white hover:text-wasmer-text disabled:cursor-not-allowed",
    primaryLarge:
      "w-full border-wasmer-text text-xl h-11 bg-wasmer-text text-white hover:bg-white hover:text-wasmer-text disabled:cursor-not-allowed mb-4",
    secondary:
      "w-full border-wasmer-border-grey bg-white text-wasmer-text hover:bg-wasmer-text hover:text-white hover:border-wasmer-text disabled:cursor-not-allowed",
    disabled:
      "w-full lg:w-[81px] border-[#CBCACDFF] bg-[#CBCACDFF] text-black h-9 rounded-full cursor-not-allowed hover:bg-[#CBCACDFF]",
    success:
      "w-full border-green-500 bg-green-500 text-white hover:bg-green-600 hover:border-green-600s disabled:cursor-not-allowed",
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

  // Handle disabled state for links
  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={`${combinedStyles} hover:no-underline`}
        aria-label={ariaLabel}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={combinedStyles}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
}
