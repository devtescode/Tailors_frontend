import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  showTagline?: boolean;
  onClick?: () => void;
}

/**
 * Editorial wordmark: a burgundy monogram plaque paired with the serif brand name.
 */
export default function Logo({
  variant = "dark",
  className,
  showTagline = true,
  onClick,
}: LogoProps) {
  const light = variant === "light";

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Style by Zahra — home"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center border transition-colors duration-300 sm:h-11 sm:w-11",
          light
            ? "border-champagne/70 bg-transparent text-cream group-hover:bg-cream/10"
            : "border-champagne/80 bg-burgundy text-cream group-hover:bg-burgundy-deep",
        )}
      >
        <span className="font-display text-[0.95rem] font-semibold tracking-[0.08em]">SZ</span>
        <span
          aria-hidden="true"
          className="absolute inset-[3px] border border-champagne/30"
        />
      </span>

      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.16rem] tracking-[-0.01em] sm:text-[1.3rem]",
            light ? "text-cream" : "text-ink",
          )}
        >
          Style <span className="italic">by</span> Zahra
        </span>
        {showTagline && (
          <span
            className={cn(
              "mt-1.5 text-[0.5rem] font-medium uppercase tracking-[0.3em] sm:text-[0.54rem]",
              light ? "text-champagne" : "text-muted-foreground",
            )}
          >
            Bespoke Tailoring · Osogbo
          </span>
        )}
      </span>
    </Link>
  );
}
