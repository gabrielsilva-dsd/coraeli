import auroraCelebration from "../assets/themes/aurora/comemorando.gif";
import auroraMain from "../assets/themes/aurora/principal.gif";
import { Link } from "react-router";
import { useGiftDraft, type FinalVisual } from "../context/GiftDraftContext";
import "./FinalStudio.css";

type FinalStudioProps = {
  onBack: () => void;
};

const visualOptions: Array<{
  id: FinalVisual;
  symbol: string;
  title: string;
  description: string;
}> = [
  {
    id: "celebration",
    symbol: "✦",
    title: "Comemoração",
    description: "GIF alegre para fechar com energia.",
  },
  {
    id: "mascot",
    symbol: "☺",
    title: "Carinho",
    description: "Personagem delicado e romântico.",
  },
  {
    id: "heart",
    symbol: "♥",
    title: "Coração",
    description: "Final limpo, leve e universal.",
  },
];

export function FinalStudio({ onBack }: FinalStudioProps) {
  const {
    recipientName,
    senderName,
    selectedThemeId,
    finalTitle,
    setFinalTitle,
    finalMessage,
    setFinalMessage,
    finalSignature,
    setFinalSignature,
    finalVisual,
    setFinalVisual,
    replayButtonLabel,
    setReplayButtonLabel,
  } = useGiftDraft();

  const recipient = recipientName.trim() || "Alguém especial";
  const sender = senderName.trim() || "Você";

  return (
    <div className={`final-studio final-studio--${selectedThemeId}`}>
      <section className="final-studio__preview" aria-label="Prévia do encerramento">
        <div className="final-studio__preview-top">
          <span>Prévia ao vivo</span>
          <small>Etapa 5 de 5 · Final</small>
        </div>

        <article className="final-canvas">
          <span className="final-canvas__eyebrow">Para guardar no coração</span>

          <div className={`final-canvas__visual final-canvas__visual--${finalVisual}`}>
            {finalVisual === "celebration" && (
              <img src={auroraCelebration} alt="Personagem comemorando" />
            )}
            {finalVisual === "mascot" && (
              <img src={auroraMain} alt="Personagem segurando uma mensagem de amor" />
            )}
            {finalVisual === "heart" && <span aria-hidden="true">♥</span>}
          </div>

          <small>{recipient}, antes de terminar...</small>
          <h1>{finalTitle.trim() || "Uma última mensagem"}</h1>
          <p>{finalMessage.trim() || "Obrigado por fazer parte desta história."}</p>

          <div className="final-canvas__signature">
            <span>{finalSignature.trim() || "Com carinho"},</span>
            <strong>{sender}</strong>
          </div>

          <button type="button">
            {replayButtonLabel.trim() || "Ver novamente"}
            <span aria-hidden="true">↟</span>
          </button>
        </article>
      </section>

      <section className="final-studio__controls" aria-labelledby="final-editor-title">
        <div className="final-studio__heading">
          <span>Etapa 5 de 5</span>
          <h2 id="final-editor-title">Finalize com sentimento</h2>
          <p>Escolha como a pessoa terminará essa experiência.</p>
        </div>

        <section className="final-editor-card" aria-labelledby="final-message-title">
          <div className="final-section-heading">
            <span aria-hidden="true">Aa</span>
            <div>
              <strong id="final-message-title">Mensagem de encerramento</strong>
              <small>Seja breve, pessoal e verdadeiro.</small>
            </div>
          </div>

          <div className="final-field">
            <div>
              <label htmlFor="final-title">Título final</label>
              <span>{finalTitle.length}/70</span>
            </div>
            <input
              id="final-title"
              value={finalTitle}
              maxLength={70}
              onChange={(event) => setFinalTitle(event.target.value)}
            />
          </div>

          <div className="final-field">
            <div>
              <label htmlFor="final-message">Mensagem final</label>
              <span>{finalMessage.length}/280</span>
            </div>
            <textarea
              id="final-message"
              value={finalMessage}
              maxLength={280}
              rows={6}
              onChange={(event) => setFinalMessage(event.target.value)}
            />
          </div>

          <div className="final-field">
            <div>
              <label htmlFor="final-signature">Forma de despedida</label>
              <span>{finalSignature.length}/50</span>
            </div>
            <input
              id="final-signature"
              value={finalSignature}
              maxLength={50}
              placeholder="Ex.: Com todo o meu carinho"
              onChange={(event) => setFinalSignature(event.target.value)}
            />
            <small>O nome escolhido na abertura aparecerá logo abaixo.</small>
          </div>
        </section>

        <section className="final-editor-card" aria-labelledby="final-visual-title">
          <div className="final-section-heading">
            <span aria-hidden="true">✦</span>
            <div>
              <strong id="final-visual-title">Clima do encerramento</strong>
              <small>Escolha uma opção. A prévia muda na hora.</small>
            </div>
          </div>

          <div className="final-visual-options">
            {visualOptions.map((option) => (
              <button
                className={finalVisual === option.id ? "is-selected" : ""}
                type="button"
                key={option.id}
                onClick={() => setFinalVisual(option.id)}
                aria-pressed={finalVisual === option.id}
              >
                <span aria-hidden="true">{option.symbol}</span>
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="final-editor-card" aria-labelledby="final-replay-title">
          <div className="final-section-heading">
            <span aria-hidden="true">↟</span>
            <div>
              <strong id="final-replay-title">Botão de repetição</strong>
              <small>Permite rever a experiência desde a declaração.</small>
            </div>
          </div>

          <div className="final-field">
            <div>
              <label htmlFor="replay-label">Texto do botão</label>
              <span>{replayButtonLabel.length}/35</span>
            </div>
            <input
              id="replay-label"
              value={replayButtonLabel}
              maxLength={35}
              onChange={(event) => setReplayButtonLabel(event.target.value)}
            />
          </div>
        </section>

        <div className="final-studio__summary" role="status">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>Sua experiência está completa</strong>
            <small>Agora você pode visualizar todas as cinco etapas.</small>
          </div>
        </div>

        <div className="final-studio__actions">
          <button type="button" onClick={onBack}>← Voltar</button>
          <Link to="/experiencia">
            Visualizar experiência
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}