import { useRef, useState } from "react";
import { Link } from "react-router";
import auroraCelebration from "../assets/themes/aurora/comemorando.gif";
import auroraWaiting from "../assets/themes/aurora/espera.gif";
import auroraMain from "../assets/themes/aurora/principal.gif";
import { MediaCarousel } from "../components/MediaCarousel";
import { DecorationVisual } from "../components/DecorationPicker";
import {
  useGiftDraft,
  normalizeDecorations,
  type GiftDraftSnapshot,
} from "../context/GiftDraftContext";
import { calculateElapsedTime } from "../utils/elapsedTime";
import "./ExperiencePage.css";

const chapters = [
  { id: "declaration", label: "Declaração" },
  { id: "memories", label: "Momentos" },
  { id: "surprise", label: "Surpresa" },
  { id: "finale", label: "Final" },
];

type ExperiencePageProps = {
  draft?: GiftDraftSnapshot;
  showEditorLink?: boolean;
};

export function ExperiencePage({
  draft,
  showEditorLink = true,
}: ExperiencePageProps = {}) {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isSoundtrackPlaying, setIsSoundtrackPlaying] = useState(false);
  const [questionResult, setQuestionResult] = useState<"correct" | "wrong" | null>(null);
  const soundtrackRef = useRef<HTMLAudioElement | null>(null);
  const localDraft = useGiftDraft();
  const {
    recipientName,
    senderName,
    occasion,
    message,
    selectedThemeId,
    decorations: savedDecorations,
    openingVisual,
    openingButtonLabel,
    openingButtonStyle,
    declarationTitle,
    declarationText,
    declarationSignature,
    showCounter,
    counterLabel,
    relationshipStartDate,
    mediaItems,
    mediaPresentation,
    soundtrack,
    interactionEnabled,
    surpriseTitle,
    surpriseQuestion,
    firstAnswer,
    secondAnswer,
    correctAnswer,
    successMessage,
    finalTitle,
    finalMessage,
    finalSignature,
    finalVisual,
    replayButtonLabel,
  } = draft ?? localDraft;
  const decorations = normalizeDecorations(savedDecorations);
  const shouldUseLegacyVisuals = !savedDecorations;
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
    setQuestionResult(null);
    setHasStarted(true);
    soundtrackRef.current?.play().catch(() => {
      setIsSoundtrackPlaying(false);
    });
  }

  function toggleSoundtrack() {
    const audio = soundtrackRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => setIsSoundtrackPlaying(false));
    } else {
      audio.pause();
    }
  }

  function answerQuestion(answer: "first" | "second") {
    setQuestionResult(answer === correctAnswer ? "correct" : "wrong");
  }

  return (
    <main className={`experience experience--${selectedThemeId}`}>
      {soundtrack && (
        <audio
          ref={soundtrackRef}
          src={soundtrack.previewUrl}
          loop
          preload="metadata"
          onPlay={() => setIsSoundtrackPlaying(true)}
          onPause={() => setIsSoundtrackPlaying(false)}
        />
      )}

      <div
        className={`experience-opening${hasStarted ? " experience-opening--hidden" : ""}`}
        aria-hidden={hasStarted}
      >
        <div className="experience-opening__glow" aria-hidden="true" />

        <div className="experience-opening__content">
          <span className="experience-opening__eyebrow">Uma surpresa para você</span>

          {decorations.openingPrimary ? (
            <button
              className="experience-opening__mascot experience-opening__mascot--decoration"
              type="button"
              onClick={beginExperience}
              aria-label={`Abrir o presente de ${recipient}`}
            >
              <DecorationVisual assetId={decorations.openingPrimary} />
            </button>
          ) : shouldUseLegacyVisuals && openingVisual === "mascot" ? (
            <button
              className="experience-opening__mascot"
              type="button"
              onClick={beginExperience}
              aria-label={`Abrir o presente de ${recipient}`}
            >
              <img src={auroraMain} alt="" />
            </button>
          ) : shouldUseLegacyVisuals && openingVisual === "heart" ? (
            <button
              className="experience-opening__mascot experience-opening__mascot--heart"
              type="button"
              onClick={beginExperience}
              aria-label={`Abrir o presente de ${recipient}`}
            >
              <span aria-hidden="true">♥</span>
            </button>
          ) : null}

          <DecorationVisual
            assetId={decorations.openingSecondary}
            className="experience-decoration-secondary experience-decoration-secondary--opening"
          />

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
        <Link
          to={showEditorLink ? "/criar" : "/"}
          aria-label={showEditorLink ? "Voltar ao editor da Coraeli" : "Conhecer a Coraeli"}
        >
          <span aria-hidden="true">C</span>
          <strong>Coraeli</strong>
        </Link>

        <div className="experience-topbar__actions">
          {soundtrack && hasStarted && (
            <button
              type="button"
              onClick={toggleSoundtrack}
              aria-label={isSoundtrackPlaying ? "Pausar música" : "Reproduzir música"}
            >
              <span aria-hidden="true">{isSoundtrackPlaying ? "♫" : "♩"}</span>
            </button>
          )}

          <div className="experience-topbar__progress" aria-live="polite">
            <span>{String(activeChapter + 1).padStart(2, "0")}</span>
            <i aria-hidden="true" />
            <span>{String(chapters.length).padStart(2, "0")}</span>
          </div>
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
            <DecorationVisual
              assetId={decorations.declarationPrimary}
              className="experience-decoration experience-decoration--declaration"
            />
            <DecorationVisual
              assetId={decorations.declarationSecondary}
              className="experience-decoration-secondary experience-decoration-secondary--declaration"
            />
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
            <DecorationVisual
              assetId={decorations.momentsPrimary}
              className="experience-decoration experience-decoration--moments"
            />
            <DecorationVisual
              assetId={decorations.momentsSecondary}
              className="experience-decoration-secondary experience-decoration-secondary--moments"
            />
            <h2>Lembranças que continuam em movimento.</h2>
            <p className="experience-chapter__lead">
              {mediaItems.length > 0
                ? "Cada imagem guarda uma parte especial dessa história."
                : "Adicione fotos ou vídeos no editor para preencher esta parte."}
            </p>

            {mediaItems.length > 0 ? (
              <MediaCarousel items={mediaItems} mode={mediaPresentation} />
            ) : (
              <div className="experience-memory-empty" aria-hidden="true">
                <span>▧</span>
                <small>Seus momentos aparecerão aqui</small>
              </div>
            )}
          </div>
        </section>

        <section
          className={getChapterClass(2, "experience-story")}
          aria-hidden={activeChapter !== 2}
        >
          <div className="experience-chapter__content">
            <span className="experience-kicker">Uma pausa especial</span>

            {decorations.surprisePrimary ? (
              <DecorationVisual
                assetId={decorations.surprisePrimary}
                className="experience-decoration experience-decoration--surprise"
              />
            ) : shouldUseLegacyVisuals ? (
              <div className="experience-intro__mascot" aria-hidden="true">
                <img src={auroraWaiting} alt="" />
              </div>
            ) : null}
            <DecorationVisual
              assetId={decorations.surpriseSecondary}
              className="experience-decoration-secondary experience-decoration-secondary--surprise"
            />

            <h2>{surpriseTitle.trim() || "Uma surpresa para você"}</h2>

            {soundtrack && (
              <div className="experience-surprise-music">
                <span aria-hidden="true">♫</span>
                <div>
                  <small>Nossa trilha</small>
                  <strong>{soundtrack.title.trim() || "Nossa música"}</strong>
                </div>
              </div>
            )}

            {interactionEnabled ? (
              <div className="experience-surprise-question">
                <p>{surpriseQuestion.trim() || "Escolha uma resposta"}</p>

                {questionResult !== "correct" && (
                  <div>
                    <button
                      type="button"
                      tabIndex={activeChapter === 2 ? 0 : -1}
                      onClick={() => answerQuestion("first")}
                    >
                      {firstAnswer.trim() || "Primeira opção"}
                    </button>
                    <button
                      type="button"
                      tabIndex={activeChapter === 2 ? 0 : -1}
                      onClick={() => answerQuestion("second")}
                    >
                      {secondAnswer.trim() || "Segunda opção"}
                    </button>
                  </div>
                )}

                {questionResult && (
                  <span className={`is-${questionResult}`} role="status">
                    {questionResult === "correct"
                      ? successMessage.trim() || "Você acertou!"
                      : "Quase! Tente a outra opção."}
                  </span>
                )}
              </div>
            ) : (
              <p className="experience-chapter__lead">
                Uma música e um instante preparados especialmente para você.
              </p>
            )}
          </div>
        </section>

        <section
          className={getChapterClass(3, "experience-finale")}
          aria-hidden={activeChapter !== 3}
        >
          <div className="experience-chapter__content">
            <span className="experience-kicker">Antes de terminar</span>

            {decorations.finalPrimary ? (
              <DecorationVisual
                assetId={decorations.finalPrimary}
                className="experience-decoration experience-decoration--final"
              />
            ) : shouldUseLegacyVisuals ? (
              <div
                className={`experience-finale__mascot experience-finale__mascot--${finalVisual}`}
                aria-hidden="true"
              >
                {finalVisual === "celebration" && <img src={auroraCelebration} alt="" />}
                {finalVisual === "mascot" && <img src={auroraMain} alt="" />}
                {finalVisual === "heart" && <span>♥</span>}
              </div>
            ) : null}
            <DecorationVisual
              assetId={decorations.finalSecondary}
              className="experience-decoration-secondary experience-decoration-secondary--final"
            />
            <h2>{finalTitle.trim() || "Uma última mensagem"}</h2>
            <p>{finalMessage.trim() || "Obrigado por fazer parte desta história."}</p>
            <strong>{finalSignature.trim() || "Com carinho"}, {sender}.</strong>

            <button
              type="button"
              tabIndex={activeChapter === 3 ? 0 : -1}
              onClick={() => goToChapter(0)}
            >
              {replayButtonLabel.trim() || "Ver novamente"}
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
