import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import Logo from "@/components/brand/Logo";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Style by Zahra — unexpected error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-20">
        <div className="w-full max-w-lg border border-border bg-card p-8 text-center shadow-soft sm:p-12">
          <Logo className="justify-center" />
          <div aria-hidden="true" className="gold-line mx-auto mt-8 h-px w-24" />
          <p className="eyebrow mt-8 justify-center">A small interruption</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">
            Something came <em className="italic text-burgundy">undone.</em>
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            The page hit an unexpected snag. Reload to try again, or return to the atelier homepage.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => window.location.reload()} className="btn-primary">
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Reload page
            </button>
            <Link to="/" onClick={() => this.setState({ hasError: false })} className="btn-outline">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
