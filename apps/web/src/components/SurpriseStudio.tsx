import { useRef, useState, type ChangeEvent } from "react";
import { useGiftDraft, type CorrectAnswer } from "../context/GiftDraftContext";
import { DecorationPicker, DecorationVisual } from "./DecorationPicker";
import "./SurpriseStudio.css";

type SurpriseStudioProps = {
  onBack: () => void;
  onContinue: () => void;
};

const MAX_AUDIO_SIZE = 25 * 1024 * 1024;

export function SurpriseStudio({ onBack, onContinue }: SurpriseStudioProps) {
  const {
    selectedThemeId,
    decorations,
    setDecoration,
    soundtrack,
    setSoundtrack,
    interactionEnabled,
    setInteractionEnabled,
    surpriseTitle,
    setSurpriseTitle,
    surpriseQuestion,
    setSurpriseQuestion,
    firstAnswer,
    setFirstAnswer,
    secondAnswer,
    setSecondAnswer,
    correctAnswer,
    setCorrectAnswer,
    successMessage,
    setSuccessMessage,
  } = useGiftDraft();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [musicError, setMusicError] = useState("");
  const [previewAnswer, setPreviewAnswer] = useState<CorrectAnswer | null>(null);

  function addSoundtrack(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setMusicError("");

    if (!file) return;

    const hasAudioType = file.type.startsWith("audio/");
    const hasAudioExtension = /\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(file.name);

    if (!hasAudioType && !hasAudioExtension) {
      setMusicError("Escolha um arquivo de áudio válido.");
      return;
    }

    if (file.size > MAX_AUDIO_SIZE) {
      setMusicError("A música pode ter no máximo 25 MB.");
      return;
    }

    if (soundtrack) URL.revokeObjectURL(soundtrack.previewUrl);

    setSoundtrack({
      previewUrl: URL.createObjectURL(file),
      fileName: file.name,
      title: soundtrack?.title || "Nossa música",
    });
    setIsPreviewPlaying(false);
  }

  function removeSoundtrack() {
    audioRef.current?.pause();

    if (soundtrack) URL.revokeObjectURL(soundtrack.previewUrl);
    setSoundtrack(null);
    setIsPreviewPlaying(false);
    setMusicError("");
  }

  async function togglePreview() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setMusicError("Não foi possível reproduzir esta música no navegador.");
      }
    } else {
      audio.pause();
    }
  }

  function choosePreviewAnswer(answer: CorrectAnswer) {
    setPreviewAnswer(answer);
  }

  const previewIsCorrect = previewAnswer === correctAnswer;

  return (
    <div className={`surprise-studio surprise-studio--${selectedThemeId}`}>
      <section className="surprise-studio__preview" aria-label="Prévia da surpresa">
        <div className="surprise-studio__preview-top">
          <span>Prévia ao vivo</span>
          <small>Etapa 4 de 5 · Surpresa</small>
        </div>

        <article className="surprise-canvas">
          <span className="surprise-canvas__eyebrow">Uma pausa especial</span>

          <DecorationVisual
            assetId={decorations.surprisePrimary}
            className="surprise-canvas__decoration"
          />
          <DecorationVisual
            assetId={decorations.surpriseSecondary}
            className="surprise-canvas__decoration-secondary"
          />

          <h1>{surpriseTitle.trim() || "Uma surpresa para você"}</h1>

          {soundtrack && (
            <div className="surprise-canvas__music">
              <span aria-hidden="true">♫</span>
              <span>
                <small>Trilha da experiência</small>
                <strong>{soundtrack.title.trim() || "Nossa música"}</strong>
              </span>
            </div>
          )}

          {interactionEnabled ? (
            <div className="surprise-canvas__question">
              <p>{surpriseQuestion.trim() || "Escolha uma resposta"}</p>

              {previewAnswer === null || !previewIsCorrect ? (
                <div>
                  <button type="button" onClick={() => choosePreviewAnswer("first")}>
                    {firstAnswer.trim() || "Primeira opção"}
                  </button>
                  <button type="button" onClick={() => choosePreviewAnswer("second")}>
                    {secondAnswer.trim() || "Segunda opção"}
                  </button>
                </div>
              ) : null}

              {previewAnswer !== null && (
                <span className={previewIsCorrect ? "is-correct" : "is-wrong"}>
                  {previewIsCorrect
                    ? successMessage.trim() || "Você acertou!"
                    : "Quase! Tente a outra opção."}
                </span>
              )}
            </div>
          ) : (
            <p className="surprise-canvas__message">
              A música e a atmosfera serão a surpresa desta etapa.
            </p>
          )}
        </article>
      </section>

      <section className="surprise-studio__controls" aria-labelledby="surprise-editor-title">
        <div className="surprise-studio__heading">
          <span>Etapa 4 de 5</span>
          <h2 id="surprise-editor-title">Prepare uma surpresa</h2>
          <p>Adicione uma trilha e, se quiser, uma pergunta especial.</p>
        </div>

        {soundtrack && (
          <audio
            ref={audioRef}
            src={soundtrack.previewUrl}
            loop
            preload="metadata"
            onPlay={() => setIsPreviewPlaying(true)}
            onPause={() => setIsPreviewPlaying(false)}
          />
        )}

        <section className="surprise-music-card" aria-labelledby="surprise-music-title">
          <div className="surprise-section-heading">
            <span aria-hidden="true">♫</span>
            <div>
              <strong id="surprise-music-title">Trilha sonora</strong>
              <small>Começará depois que o presente for aberto.</small>
            </div>
          </div>

          {!soundtrack ? (
            <label className="surprise-music-upload">
              <input type="file" accept="audio/*" onChange={addSoundtrack} />
              <span>＋</span>
              <strong>Escolher uma música</strong>
              <small>MP3, WAV ou outro áudio de até 25 MB</small>
            </label>
          ) : (
            <div className="surprise-music-ready">
              <div>
                <span aria-hidden="true">♫</span>
                <div>
                  <small>Música adicionada</small>
                  <strong>{soundtrack.title.trim() || "Nossa música"}</strong>
                </div>
              </div>

              <div className="surprise-field">
                <label htmlFor="soundtrack-title">Título que será exibido</label>
                <input
                  id="soundtrack-title"
                  value={soundtrack.title}
                  maxLength={50}
                  placeholder="Ex.: Nossa música"
                  onChange={(event) => {
                    const title = event.target.value;
                    setSoundtrack((current) =>
                      current ? { ...current, title } : current,
                    );
                  }}
                />
              </div>

              <div className="surprise-music-actions">
                <button type="button" onClick={togglePreview}>
                  {isPreviewPlaying ? "Pausar prévia" : "Ouvir prévia"}
                </button>
                <label>
                  Trocar música
                  <input type="file" accept="audio/*" onChange={addSoundtrack} />
                </label>
                <button type="button" onClick={removeSoundtrack}>Remover</button>
              </div>
            </div>
          )}

          {musicError && <p className="surprise-studio__error" role="alert">{musicError}</p>}
        </section>

        <section className="surprise-interaction-card" aria-labelledby="surprise-interaction-title">
          <label className="surprise-toggle" htmlFor="interaction-enabled">
            <span>
              <strong id="surprise-interaction-title">Pergunta interativa</strong>
              <small>Crie uma pergunta com duas alternativas.</small>
            </span>
            <input
              id="interaction-enabled"
              type="checkbox"
              checked={interactionEnabled}
              onChange={(event) => {
                setInteractionEnabled(event.target.checked);
                setPreviewAnswer(null);
              }}
            />
            <i aria-hidden="true" />
          </label>

          {interactionEnabled && (
            <div className="surprise-interaction-fields">
              <div className="surprise-field">
                <div>
                  <label htmlFor="surprise-title">Título da surpresa</label>
                  <span>{surpriseTitle.length}/60</span>
                </div>
                <input
                  id="surprise-title"
                  value={surpriseTitle}
                  maxLength={60}
                  onChange={(event) => setSurpriseTitle(event.target.value)}
                />
              </div>

              <div className="surprise-field">
                <div>
                  <label htmlFor="surprise-question">Pergunta</label>
                  <span>{surpriseQuestion.length}/120</span>
                </div>
                <textarea
                  id="surprise-question"
                  value={surpriseQuestion}
                  maxLength={120}
                  rows={3}
                  onChange={(event) => {
                    setSurpriseQuestion(event.target.value);
                    setPreviewAnswer(null);
                  }}
                />
              </div>

              <div className="surprise-answer-grid">
                <div className="surprise-field">
                  <label htmlFor="first-answer">Primeira resposta</label>
                  <input
                    id="first-answer"
                    value={firstAnswer}
                    maxLength={45}
                    onChange={(event) => {
                      setFirstAnswer(event.target.value);
                      setPreviewAnswer(null);
                    }}
                  />
                </div>

                <div className="surprise-field">
                  <label htmlFor="second-answer">Segunda resposta</label>
                  <input
                    id="second-answer"
                    value={secondAnswer}
                    maxLength={45}
                    onChange={(event) => {
                      setSecondAnswer(event.target.value);
                      setPreviewAnswer(null);
                    }}
                  />
                </div>
              </div>

              <fieldset className="surprise-correct-answer">
                <legend>Qual é a resposta correta?</legend>
                <div>
                  <button
                    className={correctAnswer === "first" ? "is-selected" : ""}
                    type="button"
                    onClick={() => {
                      setCorrectAnswer("first");
                      setPreviewAnswer(null);
                    }}
                  >
                    Primeira
                  </button>
                  <button
                    className={correctAnswer === "second" ? "is-selected" : ""}
                    type="button"
                    onClick={() => {
                      setCorrectAnswer("second");
                      setPreviewAnswer(null);
                    }}
                  >
                    Segunda
                  </button>
                </div>
              </fieldset>

              <div className="surprise-field">
                <div>
                  <label htmlFor="success-message">Mensagem ao acertar</label>
                  <span>{successMessage.length}/400</span>
                </div>
                <textarea
                  id="success-message"
                  value={successMessage}
                  maxLength={400}
                  rows={4}
                  onChange={(event) => setSuccessMessage(event.target.value)}
                />
              </div>
            </div>
          )}
        </section>

        <DecorationPicker
          slot="surprisePrimary"
          value={decorations.surprisePrimary}
          onChange={(assetId) => setDecoration("surprisePrimary", assetId)}
        />

        <DecorationPicker
          slot="surpriseSecondary"
          value={decorations.surpriseSecondary}
          onChange={(assetId) => setDecoration("surpriseSecondary", assetId)}
        />

        <div className="surprise-studio__actions">
          <button type="button" onClick={onBack}>← Voltar</button>
          <button type="button" onClick={onContinue}>
            Salvar surpresa e continuar
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
