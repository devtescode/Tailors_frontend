import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  id?: string;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  id,
  className,
}: SectionHeadingProps) {
  const light = tone === "light";
  const centered = align === "center";

  return (
    <div
      className={cn(
        "max-w-2xl",
        centered && "mx-auto text-center",
        className,
      )}
    >
      <span
        className={cn(
          "eyebrow",
          light ? "text-champagne" : "text-gold-ink",
          centered && "justify-center",
        )}
      >
        <span
          aria-hidden="true"
          className={cn("h-px w-8", light ? "bg-champagne/70" : "bg-champagne")}
        />
        {eyebrow}
      </span>

      <h2
        id={id}
        className={cn(
          "mt-5 text-balance font-display text-[2.15rem] leading-[1.08] tracking-[-0.02em] sm:text-[2.8rem] lg:text-[3.35rem]",
          light ? "text-cream" : "text-ink",
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-5 max-w-xl text-pretty text-[0.98rem] leading-relaxed sm:text-base",
            centered && "mx-auto",
            light ? "text-cream/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
