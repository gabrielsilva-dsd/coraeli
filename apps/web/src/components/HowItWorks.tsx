const creationSteps = [
  {
    number: "01",
    title: "Escolha uma ocasião",
    description:
      "Comece pelo tipo de história que deseja criar e encontre uma experiência preparada para aquele momento.",
    visual: (
      <div className="occasion-options" aria-hidden="true">
        <span className="occasion-option occasion-option--active">
          <span>♥</span>
          Casal
        </span>

        <span className="occasion-option">
          <span>✦</span>
          Aniversário
        </span>

        <span className="occasion-option">
          <span>☺</span>
          Amizade
        </span>
      </div>
    ),
  },
  {
    number: "02",
    title: "Conte do seu jeito",
    description:
      "Adicione fotos, mensagens, música e momentos. Organize os blocos enquanto acompanha a prévia.",
    visual: (
      <div className="mini-editor" aria-hidden="true">
        <div className="mini-editor__toolbar">
          <span />
          <span />
          <span />
        </div>

        <div className="mini-editor__content">
          <div className="mini-editor__blocks">
            <span />
            <span />
            <span />
          </div>

          <div className="mini-editor__preview">
            <span className="mini-editor__photo" />
            <span className="mini-editor__line" />
            <span className="mini-editor__line mini-editor__line--small" />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Compartilhe a surpresa",
    description:
      "Publique quando estiver tudo pronto e receba um link exclusivo com QR Code para entregar como quiser.",
    visual: (
      <div className="share-preview" aria-hidden="true">
        <div className="qr-preview">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="share-preview__information">
          <span>Seu presente está pronto</span>
          <strong>coraeli.com/p/sua-historia</strong>

          <div>
            <span>Copiar link</span>
            <span>Baixar QR</span>
          </div>
        </div>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="how-it-works" id="como-funciona">
      <div className="section-heading">
        <p className="eyebrow">
          <span aria-hidden="true">✦</span>
          Simples de criar
        </p>

        <h2>
          Do primeiro clique à surpresa,
          <span> sem complicação.</span>
        </h2>

        <p>
          Você cuida da história. A Coraeli organiza a experiência e ajuda
          cada detalhe a chegar ao lugar certo.
        </p>
      </div>

      <div className="steps-grid">
        {creationSteps.map((step) => (
          <article className="step-card" key={step.number}>
            <div className="step-card__top">
              <span className="step-card__number">{step.number}</span>
              <span className="step-card__line" aria-hidden="true" />
            </div>

            <div className="step-card__visual">{step.visual}</div>

            <div className="step-card__content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}