import { useGiftDraft } from "../context/GiftDraftContext";
import { calculateElapsedTime } from "../utils/elapsedTime";
import "./DeclarationStudio.css";

type DeclarationStudioProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function DeclarationStudio({ onBack, onContinue }: DeclarationStudioProps) {
  const {
    recipientName,
    senderName,
    occasion,
    selectedThemeId,
    declarationTitle,
    setDeclarationTitle,
    declarationText,
    setDeclarationText,
    declarationSignature,
    setDeclarationSignature,
    showCounter,
    setShowCounter,
    counterLabel,
    setCounterLabel,
    relationshipStartDate,
    setRelationshipStartDate,
  } = useGiftDraft();

  const recipient = recipientName.trim() || "Alguém especial";
  const sender = senderName.trim() || "Você";
  const elapsedTime = calculateElapsedTime(relationshipStartDate);
  const today = new Date();
  const maximumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <div className={`declaration-studio declaration-studio--${selectedThemeId}`}>
      <section className="declaration-studio__preview" aria-label="Prévia da declaração">
        <div className="declaration-studio__preview-top">
          <span>Prévia ao vivo</span>
          <small>Etapa 2 de 5 · Declaração</small>
        </div>

        <article className="declaration-canvas">
          <span className="declaration-canvas__occasion">{occasion}</span>
          <small>Uma declaração para</small>
          <h1>{recipient}</h1>

          <div className="declaration-canvas__letter">
            <span aria-hidden="true">“</span>
            <h2>{declarationTitle.trim() || "Nossa história"}</h2>
            <p>
              {declarationText.trim() ||
                "Escreva aqui as palavras que você deseja guardar para sempre."}
            </p>
          </div>

          <div className="declaration-canvas__signature">
            <span>{declarationSignature.trim() || "Com carinho"},</span>
            <strong>{sender}</strong>
          </div>

          {showCounter && (
            <div className="declaration-canvas__counter">
              <small>{counterLabel.trim() || "Juntos há"}</small>
              {elapsedTime ? (
                <div>
                  <span><strong>{elapsedTime.years}</strong>anos</span>
                  <span><strong>{elapsedTime.months}</strong>meses</span>
                  <span><strong>{elapsedTime.days}</strong>dias</span>
                </div>
              ) : (
                <em>Escolha uma data válida</em>
              )}
            </div>
          )}
        </article>
      </section>

      <section className="declaration-studio__controls" aria-labelledby="declaration-editor-title">
        <div className="declaration-studio__heading">
          <span>Etapa 2 de 5</span>
          <h2 id="declaration-editor-title">Escreva sua declaração</h2>
          <p>Agora cuide apenas das palavras e do tempo que vocês compartilham.</p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onContinue();
          }}
        >
          <div className="declaration-field">
            <div className="declaration-field__label">
              <label htmlFor="declaration-title">Título da declaração</label>
              <span>{declarationTitle.length}/80</span>
            </div>
            <input
              id="declaration-title"
              value={declarationTitle}
              maxLength={80}
              placeholder="Ex.: Um capítulo que quero guardar"
              onChange={(event) => setDeclarationTitle(event.target.value)}
            />
          </div>

          <div className="declaration-field">
            <div className="declaration-field__label">
              <label htmlFor="declaration-text">Texto principal</label>
              <span>{declarationText.length}/400</span>
            </div>
            <textarea
              id="declaration-text"
              value={declarationText}
              maxLength={400}
              rows={8}
              placeholder="Conte o que essa pessoa representa para você..."
              onChange={(event) => setDeclarationText(event.target.value)}
            />
            <small className="declaration-field__help">
              Até 400 caracteres. A prévia se ajusta automaticamente à tela.
            </small>
          </div>

          <div className="declaration-field">
            <label htmlFor="declaration-signature">Frase da assinatura</label>
            <input
              id="declaration-signature"
              value={declarationSignature}
              maxLength={40}
              placeholder="Ex.: Com todo o meu amor"
              onChange={(event) => setDeclarationSignature(event.target.value)}
            />
          </div>

          <div className="declaration-counter-card">
            <label className="declaration-toggle" htmlFor="show-counter">
              <span>
                <strong>Mostrar contador</strong>
                <small>Exibe há quanto tempo essa história começou.</small>
              </span>
              <input
                id="show-counter"
                type="checkbox"
                checked={showCounter}
                onChange={(event) => setShowCounter(event.target.checked)}
              />
              <i aria-hidden="true" />
            </label>

            {showCounter && (
              <div className="declaration-counter-fields">
                <div className="declaration-field">
                  <label htmlFor="counter-label">Nome do contador</label>
                  <input
                    id="counter-label"
                    value={counterLabel}
                    maxLength={30}
                    placeholder="Ex.: Juntos há"
                    onChange={(event) => setCounterLabel(event.target.value)}
                  />
                </div>

                <div className="declaration-field">
                  <label htmlFor="relationship-start-date">Data de início</label>
                  <input
                    id="relationship-start-date"
                    type="date"
                    value={relationshipStartDate}
                    max={maximumDate}
                    onChange={(event) => setRelationshipStartDate(event.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="declaration-studio__actions">
            <button type="button" onClick={onBack}>← Voltar</button>
            <button type="submit">
              Salvar declaração e continuar
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
