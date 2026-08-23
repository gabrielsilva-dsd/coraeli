import { useState } from "react";
import { Link } from "react-router";
import auroraCelebration from "../assets/themes/aurora/comemorando.gif";
import auroraWaiting from "../assets/themes/aurora/espera.gif";
import auroraMain from "../assets/themes/aurora/principal.gif";
import { useGiftDraft } from "../context/GiftDraftContext";
import { calculateElapsedTime } from "../utils/elapsedTime";
import "./ExperiencePage.css";

const chapters = [
  { id: "declaration", label: "Declaração" },
  { id: "memories", label: "Momentos" },
  { id: "surprise", label: "Surpresa" },
  { id: "finale", label: "Final" },
];

export function ExperiencePage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const {
    recipientName,
    senderName,
    occasion,
    message,
    selectedThemeId,
    openingVisual,
    openingButtonLabel,
    openingButtonStyle,
    declarationTitle,
    declarationText,
    declarationSignature,
    showCounter,
    counterLabel,
    relationshipStartDate,
  } = useGiftDraft();
  const recipient = recipientName.trim() || "Alguém especial";
  const sender = senderName.trim() || "Você";
  const openingMessage =
    message.trim() || "Algumas histórias não cabem em uma mensagem.";
  const elapsedTime = calculateElapsedTime(relationshipStartDate);

  function goToChapter(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), chapters.length - 1);
    setActiveChapter(nextIndex);
  }

  function getChapterClass(index: number, chapterClass: string) {
    const positionClass =
      index === activeChapter
        ? "is-active"
        : index < activeChapter
          ? "is-before"
          : "is-after";

    return `experience-chapter ${chapterClass} ${positionClass}`;
  }

  function beginExperience() {
    setActiveChapter(0);
    setHasStarted(true);
  }

  return (
    <main className={`experience experience--${selectedThemeId}`}>
      <div
        className={`experience-opening${hasStarted ? " experience-opening--hidden" : ""}`}
        aria-hidden={hasStarted}
      >
        <div className="experience-opening__glow" aria-hidden="true" />

        <div className="experience-opening__content">
          <span className="experience-opening__eyebrow">Uma surpresa para você</span>

          {openingVisual === "mascot" && (
            <button
              className="experience-opening__mascot"
              type="button"
              onClick={beginExperience}
              aria-label={`Abrir o presente de ${recipient}`}
            >
              <img src={auroraMain} alt="" />
            </button>
          )}

          {openingVisual === "heart" && (
            <button
              className="experience-opening__mascot experience-opening__mascot--heart"
              type="button"
              onClick={beginExperience}
              aria-label={`Abrir o presente de ${recipient}`}
            >
              <span aria-hidden="true">♥</span>
            </button>
          )}

          <h1>{recipient}, preparei algo especial.</h1>
          <p>{openingMessage}</p>

          <button
            className={`experience-opening__button experience-opening__button--${openingButtonStyle}`}
            type="button"
            onClick={beginExperience}
          >
            {openingButtonLabel.trim() || "Abrir meu presente"}
            <span aria-hidden="true">→</span>
          </button>

          <small>Toque para começar a experiência</small>
        </div>
      </div>

      <header className="experience-topbar">
        <Link to="/criar" aria-label="Voltar ao editor da Coraeli">
          <span aria-hidden="true">C</span>
          <strong>Coraeli</strong>
        </Link>

        <div className="experience-topbar__progress" aria-live="polite">
          <span>{String(activeChapter + 1).padStart(2, "0")}</span>
          <i aria-hidden="true" />
          <span>{String(chapters.length).padStart(2, "0")}</span>
        </div>
      </header>

      <nav className="experience-dots" aria-label="Capítulos da experiência">
        {chapters.map((chapter, index) => (
          <button
            className={activeChapter === index ? "is-active" : ""}
            type="button"
            key={chapter.id}
            onClick={() => goToChapter(index)}
            aria-label={`Ir para ${chapter.label}`}
            aria-current={activeChapter === index ? "step" : undefined}
          >
            <span />
          </button>
        ))}
      </nav>

      <div className="experience-stage">
        <section
          className={getChapterClass(0, "experience-intro")}
          aria-hidden={activeChapter !== 0}
        >
          <div className="experience-chapter__content">
            <span className="experience-kicker">{occasion}</span>
            <small>Uma declaração para</small>
            <h2>{recipient}</h2>

            <div className="experience-letter experience-letter--declaration">
              <span aria-hidden="true">“</span>
              <h3>{declarationTitle.trim() || "Nossa história"}</h3>
              <p>
                {declarationText.trim() ||
                  "Algumas palavras merecem ser guardadas para sempre."}
              </p>
            </div>

            <div className="experience-signature">
              {declarationSignature.trim() || "Com carinho"},
              <strong>{sender}</strong>
            </div>

            {showCounter && elapsedTime && (
              <div className="experience-counter" aria-label="Tempo juntos">
                <small>{counterLabel.trim() || "Juntos há"}</small>
                <div><strong>{elapsedTime.years}</strong><span>anos</span></div>
                <div><strong>{elapsedTime.months}</strong><span>meses</span></div>
                <div><strong>{elapsedTime.days}</strong><span>dias</span></div>
              </div>
            )}
          </div>
        </section>

        <section
          className={getChapterClass(1, "experience-memories")}
          aria-hidden={activeChapter !== 1}
        >
          <div className="experience-chapter__content">
            <span className="experience-kicker">Nossos momentos</span>
            <h2>Lembranças que continuam em movimento.</h2>
            <p className="experience-chapter__lead">
              Aqui entrarão as fotos e os vídeos escolhidos no editor.
            </p>

            <div className="experience-memory-strip" aria-label="Exemplo de carrossel de lembranças">
              <figure className="experience-memory experience-memory--one">
                <span aria-hidden="true">01</span>
                <figcaption>O começo</figcaption>
              </figure>
              <figure className="experience-memory experience-memory--two">
                <span aria-hidden="true">02</span>
                <figcaption>Nosso lugar</figcaption>
              </figure>
              <figure className="experience-memory experience-memory--three">
                <span aria-hidden="true">03</span>
                <figcaption>Seu sorriso</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section
          className={getChapterClass(2, "experience-story")}
          aria-hidden={activeChapter !== 2}
        >
          <div className="experience-chapter__content">
            <span className="experience-kicker">Uma pausa especial</span>

            <div className="experience-intro__mascot" aria-hidden="true">
              <img src={auroraWaiting} alt="" />
            </div>

            <h2>A próxima surpresa está sendo preparada.</h2>
            <p className="experience-chapter__lead">
              Música, perguntas e pequenas interações aparecerão aqui.
            </p>
          </div>
        </section>

        <section
          className={getChapterClass(3, "experience-finale")}
          aria-hidden={activeChapter !== 3}
        >
          <div className="experience-chapter__content">
            <span className="experience-kicker">Antes de terminar</span>

            <div className="experience-finale__mascot" aria-hidden="true">
              <img src={auroraCelebration} alt="" />
            </div>
            <h2>Esta história ainda está só começando.</h2>
            <p>
              Obrigado por transformar meus dias comuns em lembranças que eu
              quero guardar para sempre.
            </p>
            <strong>Com todo o meu carinho, {sender}.</strong>

            <button
              type="button"
              tabIndex={activeChapter === 3 ? 0 : -1}
              onClick={() => goToChapter(0)}
            >
              Ver novamente
              <span aria-hidden="true">↟</span>
            </button>
          </div>
        </section>
      </div>

      <nav className="experience-navigation" aria-label="Navegação entre capítulos">
        <button
          type="button"
          onClick={() => goToChapter(activeChapter - 1)}
          disabled={activeChapter === 0}
          aria-label="Voltar para o capítulo anterior"
        >
          <span aria-hidden="true">←</span>
          <small>Voltar</small>
        </button>

        <div>
          <small>Agora</small>
          <strong>{chapters[activeChapter].label}</strong>
        </div>

        <button
          type="button"
          onClick={() => goToChapter(activeChapter + 1)}
          disabled={activeChapter === chapters.length - 1}
          aria-label="Avançar para o próximo capítulo"
        >
          <small>Continuar</small>
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </main>
  );
}