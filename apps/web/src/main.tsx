import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { GiftDraftProvider } from "./context/GiftDraftContext";
import { AuthPage } from "./pages/AuthPage";
import { BuilderPage } from "./pages/BuilderPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { PublishedGiftPage } from "./pages/PublishedGiftPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GiftDraftProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/entrar" element={<AuthPage />} />
            <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
            <Route path="/presente/:slug" element={<PublishedGiftPage />} />
            <Route
              path="/criar"
              element={
                <ProtectedRoute>
                  <BuilderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/experiencia"
              element={
                <ProtectedRoute>
                  <ExperiencePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </GiftDraftProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
