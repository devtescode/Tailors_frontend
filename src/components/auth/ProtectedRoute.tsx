import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AUTH_EVENT, getToken } from "@/lib/api/client";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Client-side guard for admin routes. Real authorisation is still enforced by the API,
 * but this prevents unauthenticated users from seeing protected screens.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const location = useLocation();

  useEffect(() => {
    const sync = () => setTokenState(getToken());

    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);

    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  if (!token) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
