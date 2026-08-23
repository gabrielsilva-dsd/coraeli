import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import { MediaCarousel } from "../components/MediaCarousel";
import { useGiftDraft, type GiftThemeId } from "../context/GiftDraftContext";
import "./BuilderPage.css";
import "./BuilderStep2.css";
import "./BuilderStep3.css";
import "./BuilderMedia.css";
import "./BuilderMusic.css";
import "./BuilderSpecialBlocks.css";

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

const MAX_MEDIA_ITEMS = 6;

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

type TextStoryBlock = {
  id: number;
  type: "title" | "message";
  content: string;
};

type MediaStoryBlock = {
  id: number;
  type: "media";
  mediaType: "image" | "video";
  previewUrl: string;
  fileName: string;
  caption: string;
};

type CounterStoryBlock = {
  id: number;
  type: "counter";
  label: string;
  startDate: string;
};

type StoryBlock = TextStoryBlock | MediaStoryBlock | CounterStoryBlock;

type Soundtrack = {
  previewUrl: string;
  fileName: string;
  title: string;
};

type MediaPresentation = "carousel" | "showcase" | "gallery";

const initialStoryBlocks: StoryBlock[] = [
  {
    id: 1,
    type: "title",
    content: "Um capítulo que quero guardar",
  },
  {
    id: 2,
    type: "message",
    content: "Entre tantos momentos, existem alguns que merecem viver para sempre.",
  },
];

function calculateElapsedTime(startDate: string) {
  if (!startDate) return null;

  const start = new Date(`${startDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(start.getTime()) || start > today) return null;

  const createClampedDate = (year: number, month: number, day: number) => {
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(day, lastDayOfMonth));
  };

  let years = today.getFullYear() - start.getFullYear();
  let cursor = createClampedDate(
    start.getFullYear() + years,
    start.getMonth(),
    start.getDate(),
  );

  if (cursor > today) {
    years -= 1;
    cursor = createClampedDate(
      start.getFullYear() + years,
      start.getMonth(),
      start.getDate(),
    );
  }

  let months = 0;

  while (months < 11) {
    const nextMonth = createClampedDate(
      cursor.getFullYear(),
      cursor.getMonth() + 1,
      start.getDate(),
    );

    if (nextMonth > today) break;
    cursor = nextMonth;
    months += 1;
  }

  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const cursorUtc = Date.UTC(
    cursor.getFullYear(),
    cursor.getMonth(),
    cursor.getDate(),
  );
  const days = Math.round((todayUtc - cursorUtc) / 86_400_000);

  return { years, months, days };
}

function getLocalDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function CounterPreview({ block }: { block: CounterStoryBlock }) {
  const elapsedTime = calculateElapsedTime(block.startDate);

  return (
    <section className="builder-phone__counter">
      <small>{block.label || "Juntos há"}</small>

      {elapsedTime ? (
        <div>
          <span>
            <strong>{elapsedTime.years}</strong>
            anos
          </span>
          <span>
            <strong>{elapsedTime.months}</strong>
            meses
          </span>
          <span>
            <strong>{elapsedTime.days}</strong>
            dias
          </span>
        </div>
      ) : (
        <em>Escolha a data inicial</em>
      )}
    </section>
  );
}

export function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
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
  } = useGiftDraft();
  const [storyBlocks, setStoryBlocks] = useState<StoryBlock[]>(initialStoryBlocks);
  const [mediaError, setMediaError] = useState("");
  const [musicError, setMusicError] = useState("");
  const [soundtrack, setSoundtrack] = useState<Soundtrack | null>(null);
  const [isMusicPreviewPlaying, setIsMusicPreviewPlaying] = useState(false);
  const [mediaPresentation, setMediaPresentation] =
    useState<MediaPresentation>("carousel");
  const mediaUrls = useRef<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectedTheme =
    giftThemes.find((theme) => theme.id === selectedThemeId) ?? giftThemes[0];
  const mediaBlocks = storyBlocks.filter(
    (block): block is MediaStoryBlock => block.type === "media",
  );
  const mediaItemCount = mediaBlocks.length;
  const isMediaLimitReached = mediaItemCount >= MAX_MEDIA_ITEMS;
  const hasCounterBlock = storyBlocks.some((block) => block.type === "counter");
  const todayValue = getLocalDateValue(new Date());

  useEffect(() => {
    return () => {
      mediaUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function changeStep(step: number) {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addStoryBlock(type: TextStoryBlock["type"]) {
    const newBlock: TextStoryBlock = {
      id: Date.now(),
      type,
      content: type === "title" ? "Novo título" : "Escreva uma nova lembrança...",
    };

    setStoryBlocks((currentBlocks) => [...currentBlocks, newBlock]);
  }

  function addCounterBlock() {
    if (hasCounterBlock) return;

    const newBlock: CounterStoryBlock = {
      id: Date.now(),
      type: "counter",
      label: "Juntos há",
      startDate: "",
    };

    setStoryBlocks((currentBlocks) => [...currentBlocks, newBlock]);
  }

  function updateStoryBlock(id: number, content: string) {
    setStoryBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === id &&
        (block.type === "title" || block.type === "message")
          ? { ...block, content }
          : block,
      ),
    );
  }

  function updateCounterBlock(
    id: number,
    field: "label" | "startDate",
    value: string,
  ) {
    setStoryBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === id && block.type === "counter"
          ? { ...block, [field]: value }
          : block,
      ),
    );
  }

  function updateMediaCaption(id: number, caption: string) {
    setStoryBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === id && block.type === "media"
          ? { ...block, caption }
          : block,
      ),
    );
  }

  function validateMedia(file: File) {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return "Escolha uma imagem ou um vídeo compatível.";
    }

    const maximumSize = isImage ? 12 * 1024 * 1024 : 60 * 1024 * 1024;

    if (file.size > maximumSize) {
      return isImage
        ? "A imagem deve ter no máximo 12 MB."
        : "O vídeo deve ter no máximo 60 MB.";
    }

    return "";
  }

  function createMediaBlock(file: File): MediaStoryBlock {
    const previewUrl = URL.createObjectURL(file);
    mediaUrls.current.push(previewUrl);

    return {
      id: Date.now(),
      type: "media",
      mediaType: file.type.startsWith("video/") ? "video" : "image",
      previewUrl,
      fileName: file.name,
      caption: "",
    };
  }

  function handleMediaFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (isMediaLimitReached) {
      setMediaError(
        `O plano inicial permite até ${MAX_MEDIA_ITEMS} fotos ou vídeos.`,
      );
      return;
    }

    const validationError = validateMedia(file);

    if (validationError) {
      setMediaError(validationError);
      return;
    }

    setMediaError("");
    setStoryBlocks((currentBlocks) => [
      ...currentBlocks,
      createMediaBlock(file),
    ]);
  }

  function handleSoundtrackFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const hasAudioExtension = /\.(mp3|m4a|aac|wav|ogg)$/i.test(file.name);

    if (!file.type.startsWith("audio/") && !hasAudioExtension) {
      setMusicError("Escolha um arquivo de áudio MP3, M4A, AAC, WAV ou OGG.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setMusicError("A música deve ter no máximo 20 MB.");
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (soundtrack) {
      URL.revokeObjectURL(soundtrack.previewUrl);
      mediaUrls.current = mediaUrls.current.filter(
        (url) => url !== soundtrack.previewUrl,
      );
    }

    const previewUrl = URL.createObjectURL(file);
    mediaUrls.current.push(previewUrl);
    setMusicError("");
    setIsMusicPreviewPlaying(false);
    setSoundtrack({
      previewUrl,
      fileName: file.name,
      title: file.name.replace(/\.[^/.]+$/, ""),
    });
  }

  async function toggleMusicPreview() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setMusicError("");
      } catch {
        setMusicError("O navegador não conseguiu reproduzir este áudio.");
      }
    } else {
      audio.pause();
    }
  }

  function removeSoundtrack() {
    if (!soundtrack) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    URL.revokeObjectURL(soundtrack.previewUrl);
    mediaUrls.current = mediaUrls.current.filter(
      (url) => url !== soundtrack.previewUrl,
    );
    setSoundtrack(null);
    setIsMusicPreviewPlaying(false);
    setMusicError("");
  }

  function replaceMediaFile(
    id: number,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const validationError = validateMedia(file);

    if (validationError) {
      setMediaError(validationError);
      return;
    }

    const newPreviewUrl = URL.createObjectURL(file);
    const blockToReplace = storyBlocks.find((block) => block.id === id);
    mediaUrls.current.push(newPreviewUrl);
    setMediaError("");

    if (blockToReplace?.type === "media") {
      URL.revokeObjectURL(blockToReplace.previewUrl);
      mediaUrls.current = mediaUrls.current.filter(
        (url) => url !== blockToReplace.previewUrl,
      );
    }

    setStoryBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== id || block.type !== "media") return block;

        return {
          ...block,
          mediaType: file.type.startsWith("video/") ? "video" : "image",
          previewUrl: newPreviewUrl,
          fileName: file.name,
        };
      }),
    );
  }

  function deleteStoryBlock(id: number) {
    const blockToDelete = storyBlocks.find((block) => block.id === id);

    if (blockToDelete?.type === "media") {
      URL.revokeObjectURL(blockToDelete.previewUrl);
      mediaUrls.current = mediaUrls.current.filter(
        (url) => url !== blockToDelete.previewUrl,
      );
    }

    setStoryBlocks((currentBlocks) =>
      currentBlocks.filter((block) => block.id !== id),
    );
  }

  function moveStoryBlock(id: number, direction: "up" | "down") {
    setStoryBlocks((currentBlocks) => {
      const currentIndex = currentBlocks.findIndex((block) => block.id === id);
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (
        currentIndex === -1 ||
        targetIndex < 0 ||
        targetIndex >= currentBlocks.length
      ) {
        return currentBlocks;
      }

      const reorderedBlocks = [...currentBlocks];
      [reorderedBlocks[currentIndex], reorderedBlocks[targetIndex]] = [
        reorderedBlocks[targetIndex],
        reorderedBlocks[currentIndex],
      ];

      return reorderedBlocks;
    });
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

        <Link className="builder-header__preview" to="/experiencia">
          Visualizar
        </Link>
      </header>

      {soundtrack && (
        <audio
          ref={audioRef}
          src={soundtrack.previewUrl}
          loop
          preload="metadata"
          onPlay={() => setIsMusicPreviewPlaying(true)}
          onPause={() => setIsMusicPreviewPlaying(false)}
          onEnded={() => setIsMusicPreviewPlaying(false)}
        />
      )}

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
          ) : currentStep === 2 ? (
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
                      onClick={() => setSelectedThemeId(theme.id as GiftThemeId)}
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
                  onClick={() => changeStep(3)}
                >
                  Adicionar momentos
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="builder-moments-step">
              <div className="builder-form__heading">
                <span>Etapa 3 de 4</span>
                <h1>Monte os momentos da história.</h1>
                <p>
                  Combine títulos, mensagens, fotos, vídeos, contador e uma
                  trilha sonora.
                </p>
              </div>

              <div className="builder-block-tools" aria-label="Adicionar conteúdo">
                <button type="button" onClick={() => addStoryBlock("title")}>
                  <span aria-hidden="true">T</span>
                  <strong>Adicionar título</strong>
                  <small>Destaque uma parte da história</small>
                </button>

                <button type="button" onClick={() => addStoryBlock("message")}>
                  <span aria-hidden="true">Aa</span>
                  <strong>Adicionar mensagem</strong>
                  <small>Escreva um texto ou uma lembrança</small>
                </button>

                <button
                  type="button"
                  onClick={addCounterBlock}
                  disabled={hasCounterBlock}
                >
                  <span aria-hidden="true">◷</span>
                  <strong>
                    {hasCounterBlock ? "Contador adicionado" : "Adicionar contador"}
                  </strong>
                  <small>Mostre há quanto tempo essa história começou</small>
                </button>

                <label
                  className={`builder-media-tool${
                    isMediaLimitReached ? " builder-media-tool--disabled" : ""
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/webm,video/quicktime"
                    onChange={handleMediaFile}
                    disabled={isMediaLimitReached}
                  />
                  <span aria-hidden="true">▧</span>
                  <strong>Adicionar foto ou vídeo</strong>
                  <small>
                    {mediaItemCount} de {MAX_MEDIA_ITEMS} mídias adicionadas
                  </small>
                </label>

                <label className="builder-music-tool">
                  <input
                    type="file"
                    accept="audio/mpeg,audio/mp4,audio/aac,audio/wav,audio/ogg,.mp3,.m4a,.aac,.wav,.ogg"
                    onChange={handleSoundtrackFile}
                  />
                  <span aria-hidden="true">♫</span>
                  <strong>{soundtrack ? "Trocar música" : "Adicionar música"}</strong>
                  <small>Trilha global de até 20 MB</small>
                </label>
              </div>

              {mediaError && (
                <p className="builder-media-error" role="alert">
                  {mediaError}
                </p>
              )}

              {musicError && (
                <p className="builder-media-error" role="alert">
                  {musicError}
                </p>
              )}

              {mediaItemCount > 0 && (
                <section
                  className="media-presentation-picker"
                  aria-labelledby="media-presentation-title"
                >
                  <div>
                    <small>Exibição das mídias</small>
                    <strong id="media-presentation-title">
                      Como as fotos e os vídeos devem aparecer?
                    </strong>
                  </div>

                  <div className="media-presentation-picker__options">
                    <button
                      className={
                        mediaPresentation === "carousel" ? "is-selected" : ""
                      }
                      type="button"
                      aria-pressed={mediaPresentation === "carousel"}
                      onClick={() => setMediaPresentation("carousel")}
                    >
                      <span aria-hidden="true">▶</span>
                      <strong>Carrossel automático</strong>
                      <small>Cartões grandes deslizam continuamente, sem cortes.</small>
                    </button>

                    <button
                      className={
                        mediaPresentation === "showcase" ? "is-selected" : ""
                      }
                      type="button"
                      aria-pressed={mediaPresentation === "showcase"}
                      onClick={() => setMediaPresentation("showcase")}
                    >
                      <span aria-hidden="true">▰</span>
                      <strong>Carrossel em destaque</strong>
                      <small>Cartões menores deixam as lembranças vizinhas à vista.</small>
                    </button>

                    <button
                      className={
                        mediaPresentation === "gallery" ? "is-selected" : ""
                      }
                      type="button"
                      aria-pressed={mediaPresentation === "gallery"}
                      onClick={() => setMediaPresentation("gallery")}
                    >
                      <span aria-hidden="true">▦</span>
                      <strong>Galeria vertical</strong>
                      <small>Todas aparecem em sequência ao rolar a página.</small>
                    </button>
                  </div>
                </section>
              )}

              {soundtrack && (
                <section className="builder-soundtrack" aria-label="Trilha sonora">
                  <div className="builder-soundtrack__cover" aria-hidden="true">
                    ♫
                  </div>

                  <div className="builder-soundtrack__information">
                    <small>Trilha sonora global</small>
                    <input
                      type="text"
                      value={soundtrack.title}
                      maxLength={60}
                      aria-label="Nome da música"
                      onChange={(event) =>
                        setSoundtrack((currentSoundtrack) =>
                          currentSoundtrack
                            ? { ...currentSoundtrack, title: event.target.value }
                            : currentSoundtrack,
                        )
                      }
                    />
                    <span>Música adicionada ao presente</span>
                  </div>

                  <div className="builder-soundtrack__actions">
                    <span>Começa na entrada e se repete automaticamente</span>

                    <div>
                      <button
                        className="builder-soundtrack__preview"
                        type="button"
                        onClick={toggleMusicPreview}
                      >
                        {isMusicPreviewPlaying ? "Pausar prévia" : "Ouvir prévia"}
                      </button>

                      <button type="button" onClick={removeSoundtrack}>
                        Remover
                      </button>
                    </div>
                  </div>
                </section>
              )}

              <div className="builder-block-list" aria-live="polite">
                {storyBlocks.length > 0 ? (
                  storyBlocks.map((block, index) => (
                    <article className="builder-story-block" key={block.id}>
                      <div className="builder-story-block__header">
                        <span>{String(index + 1).padStart(2, "0")}</span>

                        <div>
                          <strong>
                            {block.type === "media"
                              ? block.mediaType === "image"
                                ? "Foto"
                                : "Vídeo"
                              : block.type === "counter"
                                ? "Contador"
                              : block.type === "title"
                                ? "Título"
                                : "Mensagem"}
                          </strong>
                          <small>
                            {block.type === "media"
                              ? block.mediaType === "image"
                                ? "Imagem adicionada"
                                : "Vídeo adicionado"
                              : block.type === "counter"
                                ? "Tempo da história"
                              : "Bloco de conteúdo"}
                          </small>
                        </div>

                        <div className="builder-story-block__actions">
                          <button
                            type="button"
                            aria-label="Mover bloco para cima"
                            title="Mover para cima"
                            disabled={index === 0}
                            onClick={() => moveStoryBlock(block.id, "up")}
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            aria-label="Mover bloco para baixo"
                            title="Mover para baixo"
                            disabled={index === storyBlocks.length - 1}
                            onClick={() => moveStoryBlock(block.id, "down")}
                          >
                            ↓
                          </button>

                          <button
                            className="builder-story-block__delete"
                            type="button"
                            aria-label={`Excluir ${
                              block.type === "title"
                                ? "título"
                                : block.type === "message"
                                  ? "mensagem"
                                  : block.type === "counter"
                                    ? "contador"
                                    : "mídia"
                            }`}
                            title="Excluir bloco"
                            onClick={() => deleteStoryBlock(block.id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      {block.type === "media" ? (
                        <div className="builder-media-editor">
                          <div className="builder-media-editor__preview">
                            {block.mediaType === "image" ? (
                              <img
                                src={block.previewUrl}
                                alt={block.caption || "Prévia da foto adicionada"}
                              />
                            ) : (
                              <video
                                src={block.previewUrl}
                                controls
                                playsInline
                                preload="metadata"
                              />
                            )}
                          </div>

                          <div className="builder-media-editor__details">
                            <label htmlFor={`caption-${block.id}`}>Legenda</label>
                            <input
                              id={`caption-${block.id}`}
                              type="text"
                              value={block.caption}
                              maxLength={100}
                              placeholder="Conte algo sobre esse momento..."
                              onChange={(event) =>
                                updateMediaCaption(block.id, event.target.value)
                              }
                            />

                            <label className="builder-media-replace">
                              Trocar arquivo
                              <input
                                type="file"
                                accept="image/*,video/mp4,video/webm,video/quicktime"
                                onChange={(event) =>
                                  replaceMediaFile(block.id, event)
                                }
                              />
                            </label>
                          </div>
                        </div>
                      ) : block.type === "counter" ? (
                        <div className="builder-counter-editor">
                          <label htmlFor={`counter-label-${block.id}`}>
                            Texto do contador
                          </label>
                          <input
                            id={`counter-label-${block.id}`}
                            type="text"
                            value={block.label}
                            maxLength={35}
                            placeholder="Ex.: Juntos há"
                            onChange={(event) =>
                              updateCounterBlock(
                                block.id,
                                "label",
                                event.target.value,
                              )
                            }
                          />

                          <label htmlFor={`counter-date-${block.id}`}>
                            Data em que tudo começou
                          </label>
                          <input
                            id={`counter-date-${block.id}`}
                            type="date"
                            value={block.startDate}
                            max={todayValue}
                            onChange={(event) =>
                              updateCounterBlock(
                                block.id,
                                "startDate",
                                event.target.value,
                              )
                            }
                          />
                        </div>
                      ) : block.type === "title" ? (
                        <input
                          type="text"
                          value={block.content}
                          maxLength={70}
                          aria-label="Conteúdo do título"
                          onChange={(event) =>
                            updateStoryBlock(block.id, event.target.value)
                          }
                        />
                      ) : (
                        <textarea
                          value={block.content}
                          maxLength={260}
                          rows={4}
                          aria-label="Conteúdo da mensagem"
                          onChange={(event) =>
                            updateStoryBlock(block.id, event.target.value)
                          }
                        />
                      )}
                    </article>
                  ))
                ) : (
                  <div className="builder-block-empty">
                    <span aria-hidden="true">✦</span>
                    <strong>Sua história ainda está vazia</strong>
                    <p>Adicione um título, uma mensagem, uma mídia ou um contador.</p>
                  </div>
                )}
              </div>

              <div className="builder-moments-actions">
                <button
                  className="builder-back-button"
                  type="button"
                  onClick={() => changeStep(2)}
                >
                  ← Voltar aos temas
                </button>

                <span>{storyBlocks.length} blocos adicionados</span>
              </div>
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

                {currentStep === 3 && storyBlocks.length > 0 && (
                  <div className="builder-phone__story-blocks">
                    {storyBlocks.map((block) =>
                      block.type === "media" ? (
                        block.id === mediaBlocks[0]?.id ? (
                          <MediaCarousel
                            items={mediaBlocks}
                            mode={mediaPresentation}
                            key="media-carousel"
                          />
                        ) : null
                      ) : block.type === "counter" ? (
                        <CounterPreview block={block} key={block.id} />
                      ) : block.type === "title" ? (
                        <h3 key={block.id}>{block.content || "Novo título"}</h3>
                      ) : (
                        <p key={block.id}>
                          {block.content || "Sua mensagem aparecerá aqui."}
                        </p>
                      ),
                    )}
                  </div>
                )}

                {soundtrack && (
                  <div className="builder-phone__soundtrack">
                    <span aria-hidden="true">♫</span>
                    <span>
                      <small>Trilha especial</small>
                      <strong>{soundtrack.title || "Nossa música"}</strong>
                    </span>
                  </div>
                )}
              </div>
            </article>
          </div>
        </aside>
      </main>
    </div>
  );
}