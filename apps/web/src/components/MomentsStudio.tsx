import { useRef, useState, type ChangeEvent } from "react";
import { MediaCarousel } from "./MediaCarousel";
import {
  useGiftDraft,
  type GiftMediaItem,
  type MediaPresentation,
} from "../context/GiftDraftContext";
import "./MomentsStudio.css";

type MomentsStudioProps = {
  onBack: () => void;
  onContinue: () => void;
};

const MAX_MEDIA_ITEMS = 6;
const MAX_IMAGE_SIZE = 12 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const presentationOptions: Array<{
  id: MediaPresentation;
  name: string;
  description: string;
  symbol: string;
}> = [
  {
    id: "carousel",
    name: "Carrossel",
    description: "Fotos maiores passando continuamente.",
    symbol: "↔",
  },
  {
    id: "showcase",
    name: "Destaque",
    description: "Mostra a atual e partes das próximas.",
    symbol: "▣",
  },
  {
    id: "gallery",
    name: "Galeria",
    description: "Organiza todos os momentos em sequência.",
    symbol: "⊞",
  },
];

export function MomentsStudio({ onBack, onContinue }: MomentsStudioProps) {
  const {
    selectedThemeId,
    mediaItems,
    setMediaItems,
    mediaPresentation,
    setMediaPresentation,
  } = useGiftDraft();
  const [mediaError, setMediaError] = useState("");
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const replacingItemId = useRef<number | null>(null);
  const remainingSlots = MAX_MEDIA_ITEMS - mediaItems.length;

  function validateFile(file: File) {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return "Use somente imagens ou vídeos.";
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return "Cada imagem pode ter no máximo 12 MB.";
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return "Cada vídeo pode ter no máximo 50 MB.";
    }

    return "";
  }

  function createMediaItem(file: File, id: number): GiftMediaItem {
    return {
      id,
      mediaType: file.type.startsWith("video/") ? "video" : "image",
      previewUrl: URL.createObjectURL(file),
      fileName: file.name,
      caption: "",
    };
  }

  function addFiles(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    setMediaError("");

    if (selectedFiles.length === 0) return;

    if (remainingSlots === 0) {
      setMediaError("Você já adicionou o limite de seis momentos.");
      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    for (const file of filesToAdd) {
      const validationError = validateFile(file);

      if (validationError) {
        setMediaError(validationError);
        return;
      }
    }

    const timestamp = Date.now();
    const newItems = filesToAdd.map((file, index) =>
      createMediaItem(file, timestamp + index),
    );

    setMediaItems((currentItems) => [...currentItems, ...newItems]);

    if (selectedFiles.length > remainingSlots) {
      setMediaError(
        `Foram adicionados ${remainingSlots} arquivos para respeitar o limite de seis.`,
      );
    }
  }

  function updateCaption(id: number, caption: string) {
    setMediaItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, caption } : item,
      ),
    );
  }

  function removeItem(id: number) {
    setMediaItems((currentItems) => {
      const itemToRemove = currentItems.find((item) => item.id === id);

      if (itemToRemove) URL.revokeObjectURL(itemToRemove.previewUrl);
      return currentItems.filter((item) => item.id !== id);
    });
    setMediaError("");
  }

  function moveItem(id: number, direction: "up" | "down") {
    setMediaItems((currentItems) => {
      const currentIndex = currentItems.findIndex((item) => item.id === id);
      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (
        currentIndex === -1 ||
        nextIndex < 0 ||
        nextIndex >= currentItems.length
      ) {
        return currentItems;
      }

      const reorderedItems = [...currentItems];
      [reorderedItems[currentIndex], reorderedItems[nextIndex]] = [
        reorderedItems[nextIndex],
        reorderedItems[currentIndex],
      ];
      return reorderedItems;
    });
  }

  function openReplacement(id: number) {
    replacingItemId.current = id;
    replaceInputRef.current?.click();
  }

  function replaceItem(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || replacingItemId.current === null) return;

    const validationError = validateFile(file);

    if (validationError) {
      setMediaError(validationError);
      return;
    }

    const itemId = replacingItemId.current;
    const replacementUrl = URL.createObjectURL(file);

    setMediaItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== itemId) return item;

        URL.revokeObjectURL(item.previewUrl);
        return {
          ...item,
          mediaType: file.type.startsWith("video/") ? "video" : "image",
          previewUrl: replacementUrl,
          fileName: file.name,
        };
      }),
    );
    replacingItemId.current = null;
    setMediaError("");
  }

  return (
    <div className={`moments-studio moments-studio--${selectedThemeId}`}>
      <section className="moments-studio__preview" aria-label="Prévia dos momentos">
        <div className="moments-studio__preview-top">
          <span>Prévia ao vivo</span>
          <small>Etapa 3 de 5 · Momentos</small>
        </div>

        <div className="moments-canvas">
          <span className="moments-canvas__eyebrow">Nossos momentos</span>
          <h1>Lembranças que continuam em movimento.</h1>

          {mediaItems.length > 0 ? (
            <MediaCarousel items={mediaItems} mode={mediaPresentation} />
          ) : (
            <div className="moments-canvas__empty">
              <span aria-hidden="true">▧</span>
              <strong>Suas fotos aparecerão aqui</strong>
              <p>Adicione o primeiro momento para acompanhar a prévia.</p>
            </div>
          )}
        </div>
      </section>

      <section className="moments-studio__controls" aria-labelledby="moments-editor-title">
        <div className="moments-studio__heading">
          <span>Etapa 3 de 5</span>
          <h2 id="moments-editor-title">Adicione seus momentos</h2>
          <p>Escolha até seis fotos ou vídeos. Você poderá organizar tudo abaixo.</p>
        </div>

        <input
          ref={replaceInputRef}
          className="moments-studio__hidden-input"
          type="file"
          accept="image/*,video/*"
          onChange={replaceItem}
          tabIndex={-1}
        />

        <label
          className={`moments-upload${remainingSlots === 0 ? " is-disabled" : ""}`}
        >
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            disabled={remainingSlots === 0}
            onChange={addFiles}
          />
          <span aria-hidden="true">＋</span>
          <strong>
            {remainingSlots > 0 ? "Adicionar fotos ou vídeos" : "Limite alcançado"}
          </strong>
          <small>
            {mediaItems.length} de {MAX_MEDIA_ITEMS} momentos adicionados
          </small>
        </label>

        {mediaError && <p className="moments-studio__error" role="alert">{mediaError}</p>}

        {mediaItems.length > 0 && (
          <div className="moments-list" aria-label="Momentos adicionados">
            {mediaItems.map((item, index) => (
              <article className="moments-item" key={item.id}>
                <div className="moments-item__media">
                  {item.mediaType === "image" ? (
                    <img src={item.previewUrl} alt="" />
                  ) : (
                    <video src={item.previewUrl} muted playsInline preload="metadata" />
                  )}
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div className="moments-item__content">
                  <div className="moments-item__heading">
                    <strong>
                      {item.mediaType === "image" ? "Foto" : "Vídeo"} {index + 1}
                    </strong>
                    <div>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveItem(item.id, "up")}
                        aria-label={`Mover momento ${index + 1} para cima`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={index === mediaItems.length - 1}
                        onClick={() => moveItem(item.id, "down")}
                        aria-label={`Mover momento ${index + 1} para baixo`}
                      >
                        ↓
                      </button>
                    </div>
                  </div>

                  <label>
                    <span>Legenda opcional</span>
                    <input
                      value={item.caption}
                      maxLength={90}
                      placeholder="Ex.: O dia em que tudo começou"
                      onChange={(event) => updateCaption(item.id, event.target.value)}
                    />
                  </label>

                  <div className="moments-item__actions">
                    <button type="button" onClick={() => openReplacement(item.id)}>
                      Substituir
                    </button>
                    <button type="button" onClick={() => removeItem(item.id)}>
                      Remover
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <fieldset className="moments-presentation">
          <legend>Como os momentos serão apresentados?</legend>
          <div>
            {presentationOptions.map((option) => (
              <button
                className={mediaPresentation === option.id ? "is-selected" : ""}
                type="button"
                key={option.id}
                aria-pressed={mediaPresentation === option.id}
                onClick={() => setMediaPresentation(option.id)}
              >
                <span aria-hidden="true">{option.symbol}</span>
                <strong>{option.name}</strong>
                <small>{option.description}</small>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="moments-studio__actions">
          <button type="button" onClick={onBack}>← Voltar</button>
          <button type="button" onClick={onContinue}>
            Salvar momentos e continuar
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}