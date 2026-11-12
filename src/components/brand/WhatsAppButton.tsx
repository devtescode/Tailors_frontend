import type { ReactNode } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { GENERAL_WHATSAPP_LINK } from "@/lib/site";
import { cn } from "@/lib/utils";

type Variant = "primary" | "champagne" | "outline" | "light-outline" | "quiet";

interface WhatsAppButtonProps {
  children?: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  icon?: boolean;
  ariaLabel?: string;
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  champagne: "btn-champagne",
  outline: "btn-outline",
  "light-outline": "btn-light-outline",
  quiet: "btn-quiet",
};

export default function WhatsAppButton({
  children = "Book an Order on WhatsApp",
  href = GENERAL_WHATSAPP_LINK,
  variant = "primary",
  className,
  icon = true,
  ariaLabel,
}: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(variantClass[variant], "group", className)}
    >
      {icon && (
        <FaWhatsapp
          aria-hidden="true"
          className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110"
        />
      )}
      <span>{children}</span>
    </a>
  );
}
