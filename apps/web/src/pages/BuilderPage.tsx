import { useState } from "react";
import { Link } from "react-router";
import "./BuilderPage.css";

const occasions = [
  "Declaração de amor",
  "Aniversário",
  "Pedido de namoro",
  "Amizade",
  "Casamento",
  "Outra ocasião",
];

export function BuilderPage() {
  const [recipientName, setRecipientName] = useState("Lívia");
  const [senderName, setSenderName] = useState("Theo");
  const [occasion, setOccasion] = useState(occasions[0]);
  const [message, setMessage] = useState(
    "Você transformou momentos simples nas minhas melhores memórias.",
  );

  return (
    <div className="builder">
      <header className="builder-header">
        <Link
          className="builder-brand"
          to="/"
          aria-label="Voltar para a página inicial"
        >
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
            <li className="builder-progress__step builder-progress__step--active">
              <span>1</span>

              <div>
                <strong>Comece a história</strong>
                <small>Informações principais</small>
              </div>
            </li>

            <li className="builder-progress__step">
              <span>2</span>

              <div>
                <strong>Escolha o tema</strong>
                <small>Visual e personalidade</small>
              </div>
            </li>

            <li className="builder-progress__step">
              <span>3</span>

              <div>
                <strong>Adicione momentos</strong>
                <small>Fotos, textos e música</small>
              </div>
            </li>

            <li className="builder-progress__step">
              <span>4</span>

              <div>
                <strong>Revise e publique</strong>
                <small>Link e QR Code</small>
              </div>
            </li>
          </ol>

          <Link className="builder-progress__back" to="/">
            ← Voltar ao início
          </Link>
        </aside>

        <section className="builder-form">
          <div className="builder-form__heading">
            <span>Etapa 1 de 4</span>
            <h1>Vamos começar pela história.</h1>

            <p>
              Conte para quem é o presente. Você poderá alterar tudo depois.
            </p>
          </div>

          <form onSubmit={(event) => event.preventDefault()}>
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
                Você poderá editar essa mensagem e adicionar outras na
                próxima etapa.
              </p>
            </div>

            <button className="builder-continue" type="submit">
              Escolher um tema
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>

        <aside className="builder-live-preview">
          <div className="builder-live-preview__top">
            <div>
              <span>Prévia ao vivo</span>
              <small>Atualizada automaticamente</small>
            </div>

            <span className="builder-live-preview__device">
              Celular
            </span>
          </div>

          <div className="builder-preview-stage">
            <article className="builder-phone">
              <div className="builder-phone__speaker" />

              <div className="builder-phone__content">
                <span className="builder-phone__occasion">
                  {occasion || "Uma ocasião especial"}
                </span>

                <div className="builder-phone__art" aria-hidden="true">
                  <span>♥</span>
                </div>

                <small>Uma história para</small>

                <h2>
                  {recipientName.trim() || "Alguém especial"}
                </h2>

                <p>
                  {message.trim() ||
                    "Sua mensagem aparecerá aqui enquanto você escreve."}
                </p>

                <span className="builder-phone__signature">
                  Com carinho,
                  <strong>{senderName.trim() || "Você"}</strong>
                </span>
              </div>
            </article>
          </div>
        </aside>
      </main>
    </div>
  );
}