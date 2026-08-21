import { useState } from "react";
import { Link } from "react-router";
import "./BuilderPage.css";
import "./BuilderStep2.css";

const occasions = [
  "Declaração de amor",
  "Aniversário",
  "Pedido de namoro",
  "Amizade",
  "Casamento",
  "Outra ocasião",
];

const progressSteps = [
  { number: 1, title: "Comece a história", description: "Informações principais" },
  { number: 2, title: "Escolha o tema", description: "Visual e personalidade" },
  { number: 3, title: "Adicione momentos", description: "Fotos, textos e música" },
  { number: 4, title: "Revise e publique", description: "Link e QR Code" },
];

const giftThemes = [
  {
    id: "aurora",
    name: "Aurora",
    category: "Romântico",
    description: "Delicado, acolhedor e cheio de afeto.",
    colors: ["#f57185", "#f7bdc4", "#fff2ed"],
    symbol: "♥",
  },
  {
    id: "cinema",
    name: "Cinema",
    category: "Marcante",
    description: "Uma apresentação intensa, como um grande filme.",
    colors: ["#e5b94f", "#44271d", "#120c0a"],
    symbol: "▶",
  },
  {
    id: "essencia",
    name: "Essência",
    category: "Minimalista",
    description: "Elegante, leve e focado nas palavras importantes.",
    colors: ["#a78bca", "#eee8f2", "#29242e"],
    symbol: "✦",
  },
];

export function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [recipientName, setRecipientName] = useState("Lívia");
  const [senderName, setSenderName] = useState("Theo");
  const [occasion, setOccasion] = useState(occasions[0]);
  const [message, setMessage] = useState(
    "Você transformou momentos simples nas minhas melhores memórias.",
  );
  const [selectedThemeId, setSelectedThemeId] = useState(giftThemes[0].id);

  const selectedTheme =
    giftThemes.find((theme) => theme.id === selectedThemeId) ?? giftThemes[0];

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

        <button className="builder-header__preview" type="button">
          Visualizar
        </button>
      </header>

      <main className="builder-layout">
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

        <section className="builder-form">
          {currentStep === 1 ? (
            <>
              <div className="builder-form__heading">
                <span>Etapa 1 de 4</span>
                <h1>Vamos começar pela história.</h1>
                <p>Conte para quem é o presente. Você poderá alterar tudo depois.</p>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  changeStep(2);
                }}
              >
                <div className="builder-field">
                  <label htmlFor="occasion">Qual é a ocasião?</label>
                  <select
                    id="occasion"
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

                <div className="builder-form__row">
                  <div className="builder-field">
                    <label htmlFor="recipient">Nome de quem receberá</label>
                    <input
                      id="recipient"
                      type="text"
                      value={recipientName}
                      maxLength={30}
                      placeholder="Ex.: Lívia"
                      onChange={(event) => setRecipientName(event.target.value)}
                    />
                  </div>

                  <div className="builder-field">
                    <label htmlFor="sender">Seu nome</label>
                    <input
                      id="sender"
                      type="text"
                      value={senderName}
                      maxLength={30}
                      placeholder="Ex.: Theo"
                      onChange={(event) => setSenderName(event.target.value)}
                    />
                  </div>
                </div>

                <div className="builder-field">
                  <div className="builder-field__label">
                    <label htmlFor="initial-message">Mensagem inicial</label>
                    <span>{message.length}/160</span>
                  </div>
                  <textarea
                    id="initial-message"
                    value={message}
                    maxLength={160}
                    rows={5}
                    placeholder="Escreva uma mensagem especial..."
                    onChange={(event) => setMessage(event.target.value)}
                  />
                </div>

                <div className="builder-form__tip">
                  <span aria-hidden="true">✦</span>
                  <p>
                    <strong>Não precisa ficar perfeito agora.</strong>
                    Você poderá editar essa mensagem e adicionar outras na próxima etapa.
                  </p>
                </div>

                <button className="builder-continue" type="submit">
                  Escolher um tema
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            </>
          ) : (
            <div className="builder-theme-step">
              <div className="builder-form__heading">
                <span>Etapa 2 de 4</span>
                <h1>Escolha o clima da história.</h1>
                <p>
                  O tema define cores, atmosfera e personalidade. Todo o conteúdo
                  continuará personalizável.
                </p>
              </div>

              <div className="builder-theme-grid" aria-label="Temas disponíveis">
                {giftThemes.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;

                  return (
                    <button
                      className={`builder-theme-card${
                        isSelected ? " builder-theme-card--selected" : ""
                      }`}
                      type="button"
                      key={theme.id}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedThemeId(theme.id)}
                    >
                      <span
                        className={`builder-theme-card__visual builder-theme-card__visual--${theme.id}`}
                        aria-hidden="true"
                      >
                        <span>{theme.symbol}</span>
                      </span>

                      <span className="builder-theme-card__content">
                        <span className="builder-theme-card__top">
                          <small>{theme.category}</small>
                          <span className="builder-theme-card__palette">
                            {theme.colors.map((color) => (
                              <span key={color} style={{ backgroundColor: color }} />
                            ))}
                          </span>
                        </span>

                        <strong>{theme.name}</strong>
                        <span>{theme.description}</span>
                        <small className="builder-theme-card__selection">
                          {isSelected ? "✓ Tema selecionado" : "Selecionar tema"}
                        </small>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="builder-theme-actions">
                <button className="builder-back-button" type="button" onClick={() => changeStep(1)}>
                  ← Voltar
                </button>

                <div>
                  <small>Tema atual</small>
                  <strong>{selectedTheme.name}</strong>
                </div>

                <button
                  className="builder-continue builder-continue--compact"
                  type="button"
                  disabled
                  title="A etapa de momentos será construída em seguida"
                >
                  Adicionar momentos
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              <p className="builder-next-note">
                A etapa de fotos, textos e música será liberada na próxima parte.
              </p>
            </div>
          )}
        </section>

        <aside className="builder-live-preview">
          <div className="builder-live-preview__top">
            <div>
              <span>Prévia ao vivo</span>
              <small>Atualizada automaticamente</small>
            </div>
            <span className="builder-live-preview__device">Celular</span>
          </div>

          <div className={`builder-preview-stage builder-preview-stage--${selectedTheme.id}`}>
            <article className={`builder-phone builder-phone--${selectedTheme.id}`}>
              <div className="builder-phone__speaker" />

              <div className="builder-phone__content">
                <span className="builder-phone__occasion">
                  {occasion || "Uma ocasião especial"}
                </span>

                <div className="builder-phone__art" aria-hidden="true">
                  <span>{selectedTheme.symbol}</span>
                </div>

                <small>Uma história para</small>
                <h2>{recipientName.trim() || "Alguém especial"}</h2>
                <p>
                  {message.trim() ||
                    "Sua mensagem aparecerá aqui enquanto você escreve."}
                </p>

                <span className="builder-phone__signature">
                  Com carinho,
                  <strong>{senderName.trim() || "Você"}</strong>
                </span>

                {currentStep === 2 && (
                  <span className="builder-phone__theme-name">
                    Tema {selectedTheme.name}
                  </span>
                )}
              </div>
            </article>
          </div>
        </aside>
      </main>
    </div>
  );
}
