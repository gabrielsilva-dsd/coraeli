const creationBenefits = [
  "Prévia gratuita",
  "Feito para celular",
  "Link e QR Code",
];

const editorBlocks = [
  { symbol: "Aa", name: "Mensagem" },
  { symbol: "◫", name: "Galeria" },
  { symbol: "◷", name: "Contador" },
  { symbol: "♫", name: "Música" },
];

function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Página inicial da Coraeli">
          <span className="brand__mark" aria-hidden="true">
            C
          </span>

          <span className="brand__name">Coraeli</span>
        </a>

        <nav className="navigation" aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>
          <a href="#temas">Temas</a>
          <a href="#recursos">Recursos</a>
        </nav>

        <div className="topbar__actions">
          <button className="text-button" type="button">
            Entrar
          </button>

          <a className="button button--small" href="#criar">
            Criar presente
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="criar">
          <div className="hero__content">
            <p className="eyebrow">
              <span aria-hidden="true">✦</span>
              Presentes digitais com significado
            </p>

            <h1>
              Um presente que
              <span> não cabe numa caixa.</span>
            </h1>

            <p className="hero__description">
              Transforme fotos, mensagens e momentos em uma experiência
              digital interativa, feita por você — sem precisar programar.
            </p>

            <div className="hero__actions">
              <button className="button button--primary" type="button">
                Criar meu presente
                <span aria-hidden="true">→</span>
              </button>

              <a className="button button--secondary" href="#como-funciona">
                Ver como funciona
              </a>
            </div>

            <ul className="benefits" aria-label="Benefícios">
              {creationBenefits.map((benefit) => (
                <li key={benefit}>
                  <span aria-hidden="true">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="hero__visual">
            <div className="editor-preview">
              <div className="editor-preview__bar">
                <div className="window-controls" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>

                <p>Prévia ao vivo</p>

                <span className="saved-status">
                  <span aria-hidden="true">●</span>
                  Salvo
                </span>
              </div>

              <div className="editor-preview__body">
                <aside className="blocks-panel" aria-label="Blocos disponíveis">
                  <p>Adicionar bloco</p>

                  <div className="blocks-panel__list">
                    {editorBlocks.map((block) => (
                      <button type="button" key={block.name}>
                        <span aria-hidden="true">{block.symbol}</span>
                        {block.name}
                      </button>
                    ))}
                  </div>
                </aside>

                <div className="device-stage">
                  <div className="phone">
                    <div className="phone__speaker" aria-hidden="true" />

                    <article className="gift-preview">
                      <div className="gift-preview__top">
                        <span>Tema Aurora</span>
                        <span aria-hidden="true">♡</span>
                      </div>

                      <div className="memory-art" aria-hidden="true">
                        <span className="memory-art__glow" />
                        <span className="memory-art__card memory-art__card--one" />
                        <span className="memory-art__card memory-art__card--two" />
                        <span className="memory-art__heart">♥</span>
                      </div>

                      <p className="gift-preview__label">Nossa história</p>
                      <h2>Lívia & Theo</h2>

                      <p className="gift-preview__message">
                        Cada momento ao seu lado virou uma parte bonita da
                        minha história.
                      </p>

                      <div className="relationship-time">
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

                      <button className="music-player" type="button">
                        <span className="music-player__icon" aria-hidden="true">
                          ▶
                        </span>

                        <span>
                          <strong>Nossa música</strong>
                          <small>Toque para ouvir</small>
                        </span>
                      </button>
                    </article>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-note floating-note--top" aria-hidden="true">
              <span>✦</span>
              Personalize cada detalhe
            </div>

            <div
              className="floating-note floating-note--bottom"
              aria-hidden="true"
            >
              <span>✓</span>
              Pronto para compartilhar
            </div>
          </div>
        </section>

        <section className="trust-strip" id="como-funciona">
          <div>
            <strong>Sem código</strong>
            <span>Crie visualmente</span>
          </div>

          <div>
            <strong>Do seu jeito</strong>
            <span>Temas e blocos flexíveis</span>
          </div>

          <div>
            <strong>Em qualquer tela</strong>
            <span>Experiência responsiva</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;