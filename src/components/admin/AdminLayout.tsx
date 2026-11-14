import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, KeyRound, LogOut } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { clearToken } from "@/lib/api/client";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}

/**
 * Shared chrome for every authenticated admin screen.
 * Keeps branding, navigation and logout behaviour consistent.
 */
export default function AdminLayout({
  children,
  title,
  description,
  eyebrow = "Atelier administration",
  actions,
}: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-cream/95 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Logo showTagline={false} compact onClick={() => undefined} />

          <nav aria-label="Admin navigation" className="flex items-center gap-1.5 sm:gap-3">
            <Link
              to="/"
              aria-label="View storefront"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-burgundy sm:px-4"
            >
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">View site</span>
            </Link>

            <Link
              to="/admin/change-password"
              aria-label="Change password"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border bg-white px-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-burgundy transition-colors hover:border-burgundy/40 hover:bg-burgundy-soft sm:px-4"
            >
              <KeyRound aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Change password</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-burgundy px-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-burgundy-deep sm:px-4"
            >
              <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <main id="admin-main" className="container mx-auto px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <header className="max-w-2xl">
            <p className="eyebrow">
              <span aria-hidden="true" className="h-px w-7 bg-champagne" />
              {eyebrow}
            </p>
            <h1 className="mt-4 font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {description}
              </p>
            )}
          </header>

          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>

        {children}
      </main>

      <footer className="border-t border-border/60 py-6">
        <p className="container mx-auto px-4 text-center text-[0.66rem] uppercase tracking-[0.22em] text-muted-foreground sm:px-6">
          Style by Zahra · Osogbo, Osun State
        </p>
      </footer>
    </div>
  );
}
