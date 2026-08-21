import { useState } from "react";

const themes = [
  {
    id: "aurora",
    name: "Aurora",
    category: "Romântico",
    description: "Delicado, acolhedor e perfeito para histórias de casal.",
    colors: ["#f57185", "#f5b8bf", "#fff3ed"],
    couple: "Lívia & Theo",
    message: "Você transformou momentos simples nas minhas melhores memórias.",
  },
  {
    id: "cinema",
    name: "Cinema",
    category: "Experiência",
    description: "Uma história apresentada como se fosse um grande filme.",
    colors: ["#e5b94f", "#311c18", "#0d0908"],
    couple: "Nossa história",
    message: "Algumas histórias merecem ser lembradas para sempre.",
  },
  {
    id: "minimal",
    name: "Essência",
    category: "Minimalista",
    description: "Elegante, leve e focado nas palavras mais importantes.",
    colors: ["#b5a1d8", "#f3efe9", "#232027"],
    couple: "Para você",
    message: "Não precisei de muitas palavras. Só precisava dizer que amo você.",
  },
];

export function ThemeShowcase() {
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  return (
    <section className="theme-showcase" id="temas">
      <div className="theme-showcase__heading">
        <div className="section-heading">
          <p className="eyebrow">
            <span aria-hidden="true">✦</span>
            Feito para cada história
          </p>

          <h2>
            Um tema para cada
            <span> sentimento.</span>
          </h2>

          <p>
            Escolha uma identidade visual e personalize cores, fotos,
            mensagens, músicas e cada detalhe da experiência.
          </p>
        </div>

        <span className="theme-count">{themes.length} temas iniciais</span>
      </div>

      <div className="theme-showcase__content">
        <div className="theme-selector" aria-label="Escolha um tema">
          {themes.map((theme) => {
            const isSelected = theme.id === selectedTheme.id;

            return (
              <button
                className={`theme-option ${
                  isSelected ? "theme-option--selected" : ""
                }`}
                type="button"
                key={theme.id}
                aria-pressed={isSelected}
                onClick={() => setSelectedTheme(theme)}
              >
                <span
                  className="theme-option__colors"
                  aria-hidden="true"
                >
                  {theme.colors.map((color) => (
                    <span
                      key={color}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>

                <span className="theme-option__information">
                  <small>{theme.category}</small>
                  <strong>{theme.name}</strong>
                  <span>{theme.description}</span>
                </span>

                <span className="theme-option__arrow" aria-hidden="true">
                  →
                </span>
              </button>
            );
          })}
        </div>

        <div
          className={`theme-preview theme-preview--${selectedTheme.id}`}
          aria-live="polite"
        >
          <div className="theme-preview__browser">
            <div className="theme-preview__bar">
              <span />
              <span />
              <span />

              <small>Prévia do tema {selectedTheme.name}</small>
            </div>

            <div className="theme-preview__stage">
              <article className="theme-phone">
                <div className="theme-phone__speaker" />

                <div className="theme-phone__content">
                  <span className="theme-phone__category">
                    {selectedTheme.category}
                  </span>

                  <div className="theme-phone__photo">
                    <span aria-hidden="true">♥</span>
                  </div>

                  <small>Uma história especial</small>
                  <h3>{selectedTheme.couple}</h3>
                  <p>{selectedTheme.message}</p>

                  <button type="button">Começar experiência</button>
                </div>
              </article>
            </div>
          </div>

          <div className="theme-preview__footer">
            <div>
              <small>Tema selecionado</small>
              <strong>{selectedTheme.name}</strong>
            </div>

            <button type="button">
              Usar este tema
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}