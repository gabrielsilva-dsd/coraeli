import { Link } from "react-router";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { ThemeShowcase } from "./components/ThemeShowcase";
import { useAuth } from "./context/AuthContext";

const editorBlocks = [
  { symbol: "Aa", name: "Mensagem" },
  { symbol: "◫", name: "Galeria" },
  { symbol: "◷", name: "Contador" },
  { symbol: "♫", name: "Música" },
];

function App() {
  const { user, signOut } = useAuth();

  return (
    <div className="site-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Página inicial da Coraeli">
          <span className="brand__mark" aria-hidden="true">
            C
          </span>

          <span className="brand__name">Coraeli</span>
        </Link>

        <nav className="navigation" aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>
          <a href="#temas">Temas</a>
          <a href="#recursos">Recursos</a>
        </nav>

        <div className="topbar__actions">
          {user ? (
            <button className="text-button" type="button" onClick={() => void signOut()}>
              Sair
            </button>
          ) : (
            <Link className="text-button" to="/entrar">
              Entrar
            </Link>
          )}

          <Link className="button button--small" to="/criar">
            Criar presente
          </Link>
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
              Reúna fotos, mensagens e momentos em uma surpresa feita para
              alguém que você ama.
            </p>

            <div className="hero__actions">
              <Link className="button button--primary" to="/criar">
                Criar meu presente
                <span aria-hidden="true">→</span>
              </Link>

              <a className="button button--secondary" href="#como-funciona">
                Ver como funciona
              </a>
            </div>

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

        <HowItWorks />
        <ThemeShowcase />
        <Features />
      </main>
    </div>
  );
}

export default App;
