import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import { GiftDraftProvider } from "./context/GiftDraftContext";
import { BuilderPage } from "./pages/BuilderPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GiftDraftProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/criar" element={<BuilderPage />} />
          <Route path="/experiencia" element={<ExperiencePage />} />
        </Routes>
      </GiftDraftProvider>
    </BrowserRouter>
  </StrictMode>,
);