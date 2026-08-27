import { DecorationPicker, DecorationVisual } from "./DecorationPicker";
import {
  useGiftDraft,
  type OpeningButtonStyle,
} from "../context/GiftDraftContext";
import {
  giftThemes,
  getDecorationAsset,
  helloKittyRecommendedDecorations,
  keroppiRecommendedDecorations,
  snoopyRecommendedDecorations,
} from "../data/decorationCatalog";
import "./OpeningStudio.css";

type OpeningStudioProps = {
  occasions: string[];
  onContinue: () => void;
};

const buttonStyles: Array<{
  id: OpeningButtonStyle;
  label: string;
}> = [
  { id: "solid", label: "Preenchido" },
  { id: "outline", label: "Contorno" },
];

export function OpeningStudio({ occasions, onContinue }: OpeningStudioProps) {
  const {
    recipientName,
    setRecipientName,
    senderName,
    setSenderName,
    occasion,
    setOccasion,
    message,
    setMessage,
    selectedThemeId,
    setSelectedThemeId,
    decorations,
    setDecoration,
    setDecorations,
    openingButtonLabel,
    setOpeningButtonLabel,
    openingButtonStyle,
    setOpeningButtonStyle,
  } = useGiftDraft();

  const recipient = recipientName.trim() || "Alguém especial";
  const previewMessage =
    message.trim() || "Algumas histórias não cabem em uma mensagem.";
  const openingDecoration = decorations.openingPrimary;
  const openingSecondaryDecoration = decorations.openingSecondary;

  function chooseTheme(themeId: typeof selectedThemeId) {
    const selectedDecorationIds = Object.values(decorations).filter(
      (decoration): decoration is NonNullable<typeof decoration> => decoration !== null,
    );
    const canApplyThemeRecommendations =
      selectedDecorationIds.length === 0 ||
      selectedDecorationIds.every(
        (decoration) => getDecorationAsset(decoration)?.collection === selectedThemeId,
      );

    setSelectedThemeId(themeId);

    if (themeId === "hello-kitty" && canApplyThemeRecommendations) {
      setDecorations(helloKittyRecommendedDecorations);
    } else if (themeId === "snoopy" && canApplyThemeRecommendations) {
      setDecorations(snoopyRecommendedDecorations);
    } else if (themeId === "keroppi" && canApplyThemeRecommendations) {
      setDecorations(keroppiRecommendedDecorations);
    }
  }

  return (
    <div className={`opening-studio opening-studio--${selectedThemeId}`}>
      <section className="opening-studio__preview" aria-label="Prévia da abertura">
        <div className="opening-studio__preview-top">
          <span>Prévia ao vivo</span>
          <small>Etapa 1 de 5 · Abertura</small>
        </div>

        <div className="opening-canvas">
          <span className="opening-canvas__eyebrow">Uma surpresa para você</span>

          <DecorationVisual
            assetId={openingDecoration}
            className="opening-canvas__decoration"
          />
          <DecorationVisual
            assetId={openingSecondaryDecoration}
            className="opening-canvas__decoration-secondary"
          />

          <h1>{recipient}, preparei algo especial.</h1>
          <p>{previewMessage}</p>

          <button
            className={`opening-canvas__button opening-canvas__button--${openingButtonStyle}`}
            type="button"
          >
            {openingButtonLabel.trim() || "Abrir meu presente"}
            <span aria-hidden="true">→</span>
          </button>

          <small>De {senderName.trim() || "Você"}</small>
        </div>
      </section>

      <section className="opening-studio__controls" aria-labelledby="opening-editor-title">
        <div className="opening-studio__heading">
          <span>Etapa 1 de 5</span>
          <h2 id="opening-editor-title">Crie a abertura do presente</h2>
          <p>Edite somente esta tela. A prévia muda enquanto você escreve.</p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onContinue();
          }}
        >
          <div className="opening-field">
            <label htmlFor="opening-occasion">Ocasião</label>
            <select
              id="opening-occasion"
              value={occasion}
              onChange={(event) => setOccasion(event.target.value)}
            >
              {occasions.map((occasionOption) => (
                <option value={occasionOption} key={occasionOption}>
                  {occasionOption}
                </option>
              ))}
            </select>
          </div>

          <div className="opening-field-row">
            <div className="opening-field">
              <label htmlFor="opening-recipient">Nome de quem receberá</label>
              <input
                id="opening-recipient"
                value={recipientName}
                maxLength={30}
                placeholder="Ex.: Lívia"
                onChange={(event) => setRecipientName(event.target.value)}
              />
            </div>

            <div className="opening-field">
              <label htmlFor="opening-sender">Seu nome</label>
              <input
                id="opening-sender"
                value={senderName}
                maxLength={30}
                placeholder="Ex.: Theo"
                onChange={(event) => setSenderName(event.target.value)}
              />
            </div>
          </div>

          <div className="opening-field">
            <div className="opening-field__label">
              <label htmlFor="opening-message">Mensagem inicial</label>
              <span>{message.length}/400</span>
            </div>
            <textarea
              id="opening-message"
              value={message}
              maxLength={400}
              rows={4}
              placeholder="Escreva uma mensagem especial..."
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>

          <fieldset className="opening-choice-group">
            <legend>Tema da abertura</legend>
            <div className="opening-theme-options">
              {giftThemes.map((theme) => (
                <button
                  className={selectedThemeId === theme.id ? "is-selected" : ""}
                  type="button"
                  key={theme.id}
                  aria-pressed={selectedThemeId === theme.id}
                  onClick={() => chooseTheme(theme.id)}
                >
                  <span>
                    <i style={{ background: theme.colors[0] }} />
                    <i style={{ background: theme.colors[1] }} />
                    <i style={{ background: theme.colors[2] }} />
                  </span>
                  <strong>{theme.name}</strong>
                  <small>{theme.description}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <DecorationPicker
            slot="openingPrimary"
            value={openingDecoration}
            onChange={(assetId) => setDecoration("openingPrimary", assetId)}
          />

          <DecorationPicker
            slot="openingSecondary"
            value={openingSecondaryDecoration}
            onChange={(assetId) => setDecoration("openingSecondary", assetId)}
          />

          <div className="opening-field">
            <div className="opening-field__label">
              <label htmlFor="opening-button-label">Texto do botão</label>
              <span>{openingButtonLabel.length}/30</span>
            </div>
            <input
              id="opening-button-label"
              value={openingButtonLabel}
              maxLength={30}
              placeholder="Abrir meu presente"
              onChange={(event) => setOpeningButtonLabel(event.target.value)}
            />
          </div>

          <fieldset className="opening-choice-group">
            <legend>Estilo do botão</legend>
            <div className="opening-segmented-options opening-segmented-options--two">
              {buttonStyles.map((style) => (
                <button
                  className={openingButtonStyle === style.id ? "is-selected" : ""}
                  type="button"
                  key={style.id}
                  aria-pressed={openingButtonStyle === style.id}
                  onClick={() => setOpeningButtonStyle(style.id)}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </fieldset>

          <button className="opening-studio__continue" type="submit">
            Salvar abertura e continuar
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </div>
  );
}
