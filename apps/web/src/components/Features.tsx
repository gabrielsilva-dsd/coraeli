import { useState } from "react";

const editorOptions = [
  {
    id: "mensagem",
    label: "Mensagem",
    symbol: "Aa",
    preview: "Tudo ficou mais bonito desde que encontrei você.",
  },
  {
    id: "foto",
    label: "Foto",
    symbol: "▧",
    preview: "Nossa memória favorita",
  },
  {
    id: "musica",
    label: "Música",
    symbol: "♫",
    preview: "A música da nossa história",
  },
];

export function Features() {
  const [activeOption, setActiveOption] = useState(editorOptions[0]);

  return (
    <section className="features" id="recursos">
      <div className="section-heading">
        <p className="eyebrow">
          <span aria-hidden="true">✦</span>
          Mais do que uma página
        </p>

        <h2>
          Cada detalhe ajuda a
          <span> contar a história.</span>
        </h2>

        <p>
          Uma experiência completa para transformar lembranças em algo
          pessoal, interativo e inesquecível.
        </p>
      </div>

      <div className="features-grid">
        <article className="feature-card feature-card--editor">
          <div className="feature-card__header">
            <span className="feature-card__icon" aria-hidden="true">
              ✦
            </span>

            <span className="feature-card__tag">Editor visual</span>
          </div>

          <div className="feature-card__text">
            <h3>Crie sem precisar programar</h3>
            <p>
              Adicione conteúdos em blocos e acompanhe o resultado enquanto
              constrói o presente.
            </p>
          </div>

          <div className="editor-demo">
            <div className="editor-demo__options">
              {editorOptions.map((option) => (
                <button
                  className={
                    activeOption.id === option.id
                      ? "editor-demo__option editor-demo__option--active"
                      : "editor-demo__option"
                  }
                  type="button"
                  key={option.id}
                  onClick={() => setActiveOption(option)}
                  aria-pressed={activeOption.id === option.id}
                >
                  <span aria-hidden="true">{option.symbol}</span>
                  {option.label}
                </button>
              ))}
            </div>

            <div className="editor-demo__canvas" aria-live="polite">
              <div className="editor-demo__canvas-top">
                <span>Prévia</span>
                <small>Salvo automaticamente</small>
              </div>

              <div
                className={`editor-demo__result editor-demo__result--${activeOption.id}`}
              >
                <span className="editor-demo__result-icon" aria-hidden="true">
                  {activeOption.symbol}
                </span>

                <small>{activeOption.label}</small>
                <strong>{activeOption.preview}</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="feature-card feature-card--countdown">
          <div className="feature-card__header">
            <span className="feature-card__icon" aria-hidden="true">
              ◷
            </span>

            <span className="feature-card__tag">Contador</span>
          </div>

          <div className="countdown-demo" aria-hidden="true">
            <div>
              <strong>02</strong>
              <span>anos</span>
            </div>

            <div>
              <strong>04</strong>
              <span>meses</span>
            </div>

            <div>
              <strong>18</strong>
              <span>dias</span>
            </div>
          </div>

          <div className="feature-card__text">
            <h3>Celebre cada segundo</h3>
            <p>
              Mostre há quanto tempo uma história especial faz parte da vida.
            </p>
          </div>
        </article>

        <article className="feature-card feature-card--music">
          <div className="feature-card__header">
            <span className="feature-card__icon" aria-hidden="true">
              ♫
            </span>

            <span className="feature-card__tag">Música</span>
          </div>

          <div className="music-demo" aria-hidden="true">
            <span className="music-demo__cover">♥</span>

            <div>
              <strong>Nossa música</strong>
              <small>A trilha sonora desse momento</small>

              <span className="music-demo__progress">
                <span />
              </span>
            </div>

            <span className="music-demo__play">▶</span>
          </div>

          <div className="feature-card__text">
            <h3>Uma trilha sonora especial</h3>
            <p>Adicione a música que representa aquela pessoa ou momento.</p>
          </div>
        </article>

        <article className="feature-card feature-card--share">
          <div className="feature-card__header">
            <span className="feature-card__icon" aria-hidden="true">
              ↗
            </span>

            <span className="feature-card__tag">Compartilhamento</span>
          </div>

          <div className="link-demo" aria-hidden="true">
            <span>coraeli.com/p/nossa-historia</span>
            <strong>Copiar</strong>
          </div>

          <div className="feature-card__text">
            <h3>Um link só de vocês</h3>
            <p>
              Compartilhe a experiência por link ou transforme-a em QR Code.
            </p>
          </div>
        </article>

        <article className="feature-card feature-card--responsive">
          <div className="feature-card__header">
            <span className="feature-card__icon" aria-hidden="true">
              ◫
            </span>

            <span className="feature-card__tag">Responsivo</span>
          </div>

          <div className="devices-demo" aria-hidden="true">
            <span className="devices-demo__desktop">
              <span />
            </span>

            <span className="devices-demo__phone">
              <span />
            </span>
          </div>

          <div className="feature-card__text">
            <h3>Bonito em qualquer tela</h3>
            <p>
              Cada presente se adapta automaticamente ao celular, tablet ou
              computador.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}