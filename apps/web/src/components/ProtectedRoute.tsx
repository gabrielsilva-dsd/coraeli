import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="auth-loading" aria-live="polite">
        <span aria-hidden="true">C</span>
        <p>Preparando sua experiência...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/entrar" replace state={{ from: location }} />;
  }

  return children;
}
