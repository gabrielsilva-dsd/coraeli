import { useState } from "react";
import { Link } from "react-router";
import { DeclarationStudio } from "../components/DeclarationStudio";
import { FinalStudio } from "../components/FinalStudio";
import { MomentsStudio } from "../components/MomentsStudio";
import { OpeningStudio } from "../components/OpeningStudio";
import { SurpriseStudio } from "../components/SurpriseStudio";
import "./BuilderPage.css";

const occasions = [
  "Declaração de amor",
  "Aniversário",
  "Pedido de namoro",
  "Amizade",
  "Casamento",
  "Outra ocasião",
];

const progressSteps = [
  { number: 1, title: "Abertura", description: "Primeira impressão" },
  { number: 2, title: "Declaração", description: "Texto, contador e assinatura" },
  { number: 3, title: "Momentos", description: "Fotos, vídeos e legendas" },
  { number: 4, title: "Surpresa", description: "Música e interações" },
  { number: 5, title: "Final", description: "Mensagem e publicação" },
];

export function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);

  function changeStep(step: number) {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="builder">
      <header className="builder-header">
        <Link className="builder-brand" to="/" aria-label="Voltar para a página inicial">
          <span aria-hidden="true">C</span>
          <strong>Coraeli</strong>
        </Link>

        <div className="builder-header__status">
          <span aria-hidden="true" />
          Rascunho salvo
        </div>

        <Link className="builder-header__preview" to="/experiencia">
          Visualizar
        </Link>
      </header>

      <main className="builder-layout builder-layout--studio">
        <aside className="builder-progress" aria-label="Etapas de criação">
          <span className="builder-progress__label">Seu progresso</span>

          <ol>
            {progressSteps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <li
                  className={`builder-progress__step${
                    isActive ? " builder-progress__step--active" : ""
                  }${isCompleted ? " builder-progress__step--completed" : ""}`}
                  key={step.number}
                >
                  <span>{isCompleted ? "✓" : step.number}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <small>{step.description}</small>
                  </div>
                </li>
              );
            })}
          </ol>

          <Link className="builder-progress__back" to="/">
            ← Voltar ao início
          </Link>
        </aside>

        <section className="builder-form builder-form--studio">
          {currentStep === 1 && (
            <OpeningStudio occasions={occasions} onContinue={() => changeStep(2)} />
          )}

          {currentStep === 2 && (
            <DeclarationStudio
              onBack={() => changeStep(1)}
              onContinue={() => changeStep(3)}
            />
          )}

          {currentStep === 3 && (
            <MomentsStudio
              onBack={() => changeStep(2)}
              onContinue={() => changeStep(4)}
            />
          )}

          {currentStep === 4 && (
            <SurpriseStudio
              onBack={() => changeStep(3)}
              onContinue={() => changeStep(5)}
            />
          )}

          {currentStep === 5 && (
            <FinalStudio onBack={() => changeStep(4)} />
          )}
        </section>
      </main>
    </div>
  );
}