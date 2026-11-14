import { useState, type FormEvent } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import heroImage from "@/assets/hero-bg.jpg";
import Logo from "@/components/brand/Logo";
import { useToast } from "@/hooks/use-toast";
import { errorMessage, getToken } from "@/lib/api/client";
import {
  useAdminLogin,
  useAdminRegister,
  useAdminStatus,
} from "@/lib/queries/admin.queries";
import { site } from "@/lib/site";

const MIN_PASSWORD_LENGTH = 6;

const benefits = [
  "Publish new pieces to the live collection",
  "Upload photography and manage pricing",
  "Keep every category and description current",
] as const;

function PanelHeading({ register }: { register: boolean }) {
  return (
    <div>
      <p className="eyebrow">
        <span aria-hidden="true" className="h-px w-8 bg-champagne" />
        {register ? "First-time access" : "Admin sign in"}
      </p>
      <h1 className="mt-5 font-display text-[2.15rem] leading-[1.05] tracking-[-0.02em] text-ink sm:text-[2.6rem]">
        {register ? (
          <>
            Set up your <em className="italic text-burgundy">atelier.</em>
          </>
        ) : (
          <>
            Welcome <em className="italic text-burgundy">back.</em>
          </>
        )}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
        {register
          ? "Create the first administrator account for Style by Zahra. This secure step is only available once."
          : "Sign in to manage the collection, imagery and pricing behind Style by Zahra."}
      </p>
    </div>
  );
}

function LoadingPanel() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 border border-border/70 bg-white px-6 py-16 text-center shadow-soft"
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/70 bg-burgundy-soft text-burgundy"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </span>
      <div>
        <p className="font-display text-lg text-ink">Preparing secure access</p>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Checking atelier status
        </p>
      </div>
    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
  retrying,
}: {
  message: string;
  onRetry: () => void;
  retrying: boolean;
}) {
  return (
    <div
      role="alert"
      className="border border-destructive/25 bg-white px-6 py-10 text-center shadow-soft"
    >
      <span
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-destructive/20 bg-destructive/5 text-destructive"
      >
        <AlertCircle className="h-5 w-5" />
      </span>
      <p className="mt-4 font-display text-lg text-ink">We could not reach the atelier</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="btn-outline mt-6"
      >
        <RefreshCw
          aria-hidden="true"
          className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`}
        />
        Try again
      </button>
    </div>
  );
}

export default function AdminLogin() {
  const hasToken = Boolean(getToken());
  const navigate = useNavigate();
  const { toast } = useToast();

  const statusQuery = useAdminStatus({ enabled: !hasToken });
  const loginMutation = useAdminLogin();
  const registerMutation = useAdminRegister();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const adminExists = statusQuery.data?.adminExists ?? true;
  const register = !adminExists;
  const submitting = loginMutation.isPending || registerMutation.isPending;

  if (hasToken) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const validate = (): string | null => {
    const cleanEmail = email.trim();

    if (!cleanEmail) return "Enter the administrator email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return "Enter a valid email address.";
    }
    if (!password) return "Enter your password.";

    if (register) {
      if (password.length < MIN_PASSWORD_LENGTH) {
        return `Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`;
      }
      if (password !== confirmPassword) {
        return "The two passwords do not match.";
      }
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);

    try {
      const credentials = { email: email.trim(), password };

      if (register) {
        await registerMutation.mutateAsync(credentials);
        setPassword("");
        setConfirmPassword("");
        await statusQuery.refetch();

        toast({
          title: "Administrator created",
          description: "You can now sign in with your new credentials.",
        });
        return;
      }

      await loginMutation.mutateAsync(credentials);

      toast({
        title: "Welcome back",
        description: "Your atelier dashboard is ready.",
      });
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      setFormError(errorMessage(error));
    }
  };

  const formDisabled = statusQuery.isPending || statusQuery.isError;

  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-[1.02fr_1fr]">
      {/* Editorial brand panel */}
      <aside className="relative hidden overflow-hidden bg-burgundy-deep text-cream lg:flex lg:flex-col">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-burgundy-deep/90 via-burgundy-deep/80 to-burgundy-deep/95"
        />
        <div
          aria-hidden="true"
          className="absolute inset-5 border border-cream/15 xl:inset-7"
        />
        <div
          aria-hidden="true"
          className="absolute -right-28 top-24 h-80 w-80 rounded-full border border-champagne/15"
        />

        <div className="relative z-10 flex min-h-screen flex-col justify-between p-10 xl:p-14">
          <Logo variant="light" showTagline={false} />

          <div className="max-w-md">
            <p className="eyebrow text-champagne">
              <span aria-hidden="true" className="h-px w-8 bg-champagne/70" />
              Atelier access
            </p>
            <h2 className="mt-6 font-display text-[2.6rem] leading-[1.03] tracking-[-0.03em] text-cream xl:text-[3.2rem]">
              The collection,{" "}
              <em className="italic text-gold-light">beautifully managed.</em>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/65">
              A private workspace for the pieces, photography and details that
              make up the Style by Zahra house.
            </p>

            <ul className="mt-8 list-none space-y-3 p-0">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-cream/75">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold-light"
                  >
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-cream/15 pt-6">
            <div>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-champagne/75">
                {site.location.full}
              </p>
              <a
                href={site.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-cream/70 transition-colors hover:text-cream"
              >
                WhatsApp · {site.whatsapp.display}
              </a>
            </div>
            <p className="font-script text-3xl leading-none text-gold-light">Zahra</p>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between gap-3 px-4 py-5 sm:px-8 lg:px-12">
          <div className="lg:hidden">
            <Logo showTagline={false} />
          </div>

          <Link
            to="/"
            className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-burgundy transition-colors hover:border-burgundy/40 hover:bg-burgundy-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back to boutique</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-12 pt-4 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {!formDisabled && <PanelHeading register={register} />}

            <div className="mt-8">
              {statusQuery.isPending ? (
                <LoadingPanel />
              ) : statusQuery.isError ? (
                <ErrorPanel
                  message={errorMessage(statusQuery.error)}
                  onRetry={() => void statusQuery.refetch()}
                  retrying={statusQuery.isFetching}
                />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-busy={submitting}
                  className="border border-border/70 bg-white p-6 shadow-soft sm:p-8"
                >
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="admin-email"
                        className="mb-2 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink"
                      >
                        <Mail aria-hidden="true" className="h-3.5 w-3.5 text-gold-ink" />
                        Email address
                      </label>
                      <input
                        id="admin-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setFormError(null);
                        }}
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        required
                        aria-invalid={Boolean(formError)}
                        aria-describedby={formError ? "admin-form-error" : undefined}
                        placeholder="you@stylebyzahra.com"
                        className="admin-field"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="admin-password"
                        className="mb-2 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink"
                      >
                        <Lock aria-hidden="true" className="h-3.5 w-3.5 text-gold-ink" />
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="admin-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value);
                            setFormError(null);
                          }}
                          autoComplete={register ? "new-password" : "current-password"}
                          required
                          minLength={register ? MIN_PASSWORD_LENGTH : undefined}
                          aria-invalid={Boolean(formError)}
                          aria-describedby={
                            register ? "admin-password-hint" : formError ? "admin-form-error" : undefined
                          }
                          placeholder="••••••••"
                          className="admin-field pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((visible) => !visible)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          aria-pressed={showPassword}
                          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                        >
                          {showPassword ? (
                            <EyeOff aria-hidden="true" className="h-4 w-4" />
                          ) : (
                            <Eye aria-hidden="true" className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {register && (
                        <p
                          id="admin-password-hint"
                          className="mt-2 text-[0.72rem] leading-relaxed text-muted-foreground"
                        >
                          At least {MIN_PASSWORD_LENGTH} characters. Choose something only you know.
                        </p>
                      )}
                    </div>

                    {register && (
                      <div>
                        <label
                          htmlFor="admin-confirm-password"
                          className="mb-2 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink"
                        >
                          <ShieldCheck
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-gold-ink"
                          />
                          Confirm password
                        </label>
                        <input
                          id="admin-confirm-password"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(event) => {
                            setConfirmPassword(event.target.value);
                            setFormError(null);
                          }}
                          autoComplete="new-password"
                          required
                          minLength={MIN_PASSWORD_LENGTH}
                          aria-invalid={Boolean(formError)}
                          aria-describedby={formError ? "admin-form-error" : undefined}
                          placeholder="Re-enter your password"
                          className="admin-field"
                        />
                      </div>
                    )}
                  </div>

                  {formError && (
                    <p
                      id="admin-form-error"
                      role="alert"
                      className="mt-5 flex items-start gap-2 border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-[0.8rem] leading-relaxed text-destructive"
                    >
                      <AlertCircle
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0"
                      />
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting}
                    className="btn-primary mt-6 w-full"
                  >
                    {submitting && (
                      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    )}
                    {submitting
                      ? register
                        ? "Creating account"
                        : "Signing in"
                      : register
                        ? "Create admin account"
                        : "Sign in to dashboard"}
                  </button>

                  <div className="mt-5 flex items-start gap-2 border-t border-border/70 pt-4 text-[0.7rem] leading-relaxed text-muted-foreground">
                    <ShieldCheck
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-ink"
                    />
                    <p>
                      Your session is secured with a temporary access token. Sign out when
                      you finish on a shared device.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {statusQuery.isSuccess && (
              <p className="mt-6 text-center text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground">
                {register
                  ? "This first account becomes the atelier administrator."
                  : "Authorised access only · Style by Zahra"}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
