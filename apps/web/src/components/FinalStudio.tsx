import auroraCelebration from "../assets/themes/aurora/comemorando.gif";
import auroraMain from "../assets/themes/aurora/principal.gif";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import { useGiftDraft, type FinalVisual } from "../context/GiftDraftContext";
import { publishGift } from "../services/giftPublishing";
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
  const { user } = useAuth();
  const qrCodeRef = useRef<HTMLCanvasElement | null>(null);
  const [publishStatus, setPublishStatus] = useState<
    "idle" | "publishing" | "published" | "error"
  >("idle");
  const [publishMessage, setPublishMessage] = useState("");
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
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
    getDraftSnapshot,
    getMediaBlob,
    getSoundtrackBlob,
  } = useGiftDraft();

  const recipient = recipientName.trim() || "Alguém especial";
  const sender = senderName.trim() || "Você";
  const publishedPath = publishedSlug ? `/presente/${publishedSlug}` : null;
  const publishedUrl = publishedPath
    ? `${window.location.origin}${publishedPath}`
    : null;

  async function handlePublish() {
    if (!user || publishStatus === "publishing") return;

    setPublishStatus("publishing");
    setPublishMessage("Preparando seu presente");
    setPublishedSlug(null);
    setHasCopiedLink(false);

    try {
      const result = await publishGift({
        userId: user.id,
        draft: getDraftSnapshot(),
        getMediaBlob,
        getSoundtrackBlob,
        onProgress: setPublishMessage,
      });

      setPublishedSlug(result.slug);
      setPublishMessage("Seu presente está no ar");
      setPublishStatus("published");
    } catch (error) {
      console.error("Erro ao publicar o presente:", error);
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof error.message === "string"
            ? error.message
          : "Não foi possível publicar agora. Tente novamente.";
      setPublishMessage(message);
      setPublishStatus("error");
    }
  }

  async function copyPublishedLink() {
    if (!publishedUrl) return;
    await navigator.clipboard.writeText(publishedUrl);
    setHasCopiedLink(true);
  }

  function downloadQrCode() {
    const qrCode = qrCodeRef.current;
    if (!qrCode || !publishedUrl) return;

    const card = document.createElement("canvas");
    const context = card.getContext("2d");
    if (!context) return;

    card.width = 1080;
    card.height = 1350;

    const background = context.createLinearGradient(0, 0, 1080, 1350);
    background.addColorStop(0, "#fff7f8");
    background.addColorStop(1, "#f7d9df");
    context.fillStyle = background;
    context.fillRect(0, 0, card.width, card.height);

    context.fillStyle = "#32111f";
    context.textAlign = "center";
    context.font = "700 58px Georgia, serif";
    context.fillText("Coraeli", card.width / 2, 120);

    context.font = "700 34px Arial, sans-serif";
    context.fillText("Um presente espera por você", card.width / 2, 190);

    context.fillStyle = "#ffffff";
    context.fillRect(130, 245, 820, 820);
    context.drawImage(qrCode, 180, 295, 720, 720);

    context.fillStyle = "#6f4b59";
    context.font = "28px Arial, sans-serif";
    context.fillText("Aponte a câmera do celular para abrir", card.width / 2, 1145);

    context.font = "24px Arial, sans-serif";
    context.fillText(new URL(publishedUrl).host, card.width / 2, 1205);

    const safeRecipient = recipient
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
    const download = document.createElement("a");

    download.download = `coraeli-${safeRecipient || "presente"}-qr-code.png`;
    download.href = card.toDataURL("image/png");
    download.click();
  }

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
              <span>{finalMessage.length}/400</span>
            </div>
            <textarea
              id="final-message"
              value={finalMessage}
              maxLength={400}
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

        {publishStatus !== "idle" && (
          <section
            className={`final-publish-result final-publish-result--${publishStatus}`}
            aria-live="polite"
          >
            <span aria-hidden="true">
              {publishStatus === "published" ? "✓" : publishStatus === "error" ? "!" : "···"}
            </span>
            <div>
              <strong>{publishMessage}</strong>
              {publishStatus === "publishing" && (
                <small>Não feche esta página durante o envio.</small>
              )}
              {publishedUrl && (
                <>
                  <small>Este link pode ser aberto em qualquer celular.</small>
                  <div className="final-publish-result__qr">
                    <div className="final-publish-result__qr-frame">
                      <QRCodeCanvas
                        ref={qrCodeRef}
                        value={publishedUrl}
                        size={720}
                        level="H"
                        marginSize={3}
                        bgColor="#fffafc"
                        fgColor="#32111f"
                        title={`QR Code do presente para ${recipient}`}
                        role="img"
                        aria-label={`QR Code do presente para ${recipient}`}
                      />
                    </div>
                    <div>
                      <strong>QR Code pronto</strong>
                      <small>Aponte a câmera para abrir o presente.</small>
                    </div>
                  </div>
                  <input value={publishedUrl} readOnly aria-label="Link publicado" />
                  <div className="final-publish-result__actions">
                    <button type="button" onClick={copyPublishedLink}>
                      {hasCopiedLink ? "Link copiado" : "Copiar link"}
                    </button>
                    <button type="button" onClick={downloadQrCode}>
                      Baixar QR Code
                    </button>
                    <Link to={publishedPath!} target="_blank" rel="noreferrer">
                      Abrir presente
                    </Link>
                  </div>
                </>
              )}
              {publishStatus === "error" && (
                <small>Seu rascunho continua salvo e nada foi perdido.</small>
              )}
            </div>
          </section>
        )}

        <div className="final-studio__actions">
          <button type="button" onClick={onBack}>← Voltar</button>
          <Link to="/experiencia">
            Visualizar experiência
            <span aria-hidden="true">→</span>
          </Link>
          <button
            className="final-studio__publish"
            type="button"
            onClick={handlePublish}
            disabled={publishStatus === "publishing" || publishStatus === "published"}
          >
            {publishStatus === "publishing"
              ? "Publicando..."
              : publishStatus === "published"
                ? "Publicado"
                : "Publicar presente"}
            <span aria-hidden="true">✦</span>
          </button>
        </div>
      </section>
    </div>
  );
}