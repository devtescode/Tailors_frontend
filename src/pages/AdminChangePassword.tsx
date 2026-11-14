import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { errorMessage } from "@/lib/api/client";
import { useChangePassword } from "@/lib/queries/admin.queries";
import { cn } from "@/lib/utils";

const MIN_PASSWORD_LENGTH = 6;

type FieldName = "current" | "next" | "confirm";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  autoComplete: "current-password" | "new-password";
  icon: ReactNode;
  visible: boolean;
  onToggleVisibility: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  hint?: string;
}

function PasswordField({
  id,
  label,
  value,
  placeholder,
  autoComplete,
  icon,
  visible,
  onToggleVisibility,
  onChange,
  onBlur,
  error,
  hint,
}: PasswordFieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-soft"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground"
        >
          {icon}
        </span>

        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            "admin-field pl-11 pr-12",
            error &&
              "border-destructive/70 focus:border-destructive focus:ring-destructive/30",
          )}
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-sm text-muted-foreground transition-colors hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Eye aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>

      {hint && !error && (
        <p id={hintId} className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-xs font-medium leading-relaxed text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-px h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default function AdminChangePassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    current: false,
    next: false,
    confirm: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validation = useMemo(() => {
    const current = currentPassword ? "" : "Enter your current password.";

    let next = "";
    if (!newPassword) {
      next = "Choose a new password.";
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      next = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    } else if (newPassword === currentPassword) {
      next = "Choose a password that differs from your current one.";
    }

    let confirm = "";
    if (!confirmPassword) {
      confirm = "Re-enter your new password.";
    } else if (confirmPassword !== newPassword) {
      confirm = "Passwords do not match.";
    }

    return { current, next, confirm };
  }, [confirmPassword, currentPassword, newPassword]);

  const visibleError = (field: FieldName) =>
    (touched[field] || submitAttempted) && validation[field] ? validation[field] : undefined;

  const clearServerError = () => {
    if (changePassword.isError) changePassword.reset();
  };

  const markTouched = (field: FieldName) => {
    setTouched((previous) => (previous[field] ? previous : { ...previous, [field]: true }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setTouched({ current: true, next: true, confirm: true });
    clearServerError();

    if (validation.current || validation.next || validation.confirm) {
      return;
    }

    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setTouched({ current: false, next: false, confirm: false });
      setSubmitAttempted(false);

      toast({
        title: "Password updated",
        description: "Your atelier account is secure with the new password.",
      });

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      toast({
        title: "Password not updated",
        description: errorMessage(error),
        variant: "destructive",
      });
    }
  };

  const serverError = changePassword.isError
    ? errorMessage(changePassword.error)
    : undefined;

  return (
    <AdminLayout
      title="Change password"
      description="Keep your atelier account secure with a fresh, private password."
      eyebrow="Account security"
      actions={
        <Link to="/admin/dashboard" className="btn-outline">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to dashboard
        </Link>
      }
    >
      <div className="pb-4">
        <div className="mx-auto w-full max-w-xl border border-border bg-card p-5 shadow-soft sm:p-8">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-champagne/80 bg-burgundy-soft text-burgundy"
            >
              <Lock className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <h2 className="font-display text-xl leading-tight tracking-tight text-ink sm:text-2xl">
                Choose a new password
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Confirm your current password, then set a new one of at least{" "}
                {MIN_PASSWORD_LENGTH} characters. You will use it the next time you sign in.
              </p>
            </div>
          </div>

          <span aria-hidden="true" className="gold-line mt-6 block h-px w-full" />

          {serverError && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 border border-destructive/25 bg-destructive/5 px-4 py-3"
            >
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
              />
              <div>
                <p className="text-sm font-semibold text-destructive">Password update failed</p>
                <p className="mt-1 text-sm leading-relaxed text-destructive/90">{serverError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <PasswordField
              id="current-password"
              label="Current password"
              value={currentPassword}
              placeholder="Enter your current password"
              autoComplete="current-password"
              icon={<Lock className="h-4 w-4" />}
              visible={showCurrent}
              onToggleVisibility={() => setShowCurrent((previous) => !previous)}
              onChange={(value) => {
                setCurrentPassword(value);
                clearServerError();
              }}
              onBlur={() => markTouched("current")}
              error={visibleError("current")}
            />

            <PasswordField
              id="new-password"
              label="New password"
              value={newPassword}
              placeholder="Enter a new password"
              autoComplete="new-password"
              icon={<KeyRound className="h-4 w-4" />}
              visible={showNew}
              onToggleVisibility={() => setShowNew((previous) => !previous)}
              onChange={(value) => {
                setNewPassword(value);
                clearServerError();
              }}
              onBlur={() => markTouched("next")}
              error={visibleError("next")}
              hint={`Use at least ${MIN_PASSWORD_LENGTH} characters, and choose something different from your current password.`}
            />

            <PasswordField
              id="confirm-password"
              label="Confirm new password"
              value={confirmPassword}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              icon={<ShieldCheck className="h-4 w-4" />}
              visible={showConfirm}
              onToggleVisibility={() => setShowConfirm((previous) => !previous)}
              onChange={(value) => {
                setConfirmPassword(value);
                clearServerError();
              }}
              onBlur={() => markTouched("confirm")}
              error={visibleError("confirm")}
            />

            <div className="flex items-start gap-2 border-t border-border/70 pt-5">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-ink"
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Use at least {MIN_PASSWORD_LENGTH} characters, and avoid sharing your password.
                You will stay signed in on this device after updating.
              </p>
            </div>

            <button
              type="submit"
              disabled={changePassword.isPending}
              aria-busy={changePassword.isPending}
              className="btn-primary w-full justify-center"
            >
              {changePassword.isPending ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Updating password
                </>
              ) : (
                <>
                  <Lock aria-hidden="true" className="h-4 w-4" />
                  Update password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
