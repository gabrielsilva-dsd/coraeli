import {
  createContext,
  useEffect,
  useContext,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type GiftThemeId = "aurora" | "cinema" | "essencia";
export type OpeningVisual = "mascot" | "heart" | "minimal";
export type OpeningButtonStyle = "solid" | "outline";
export type MediaPresentation = "carousel" | "showcase" | "gallery";
export type CorrectAnswer = "first" | "second";
export type FinalVisual = "celebration" | "mascot" | "heart";
export type DraftStatus = "loading" | "saving" | "saved" | "error";

export type GiftMediaItem = {
  id: number;
  mediaType: "image" | "video";
  previewUrl: string;
  fileName: string;
  caption: string;
};

export type GiftSoundtrack = {
  previewUrl: string;
  fileName: string;
  title: string;
};

type GiftDraftContextValue = {
  draftStatus: DraftStatus;
  lastSavedAt: string | null;
  recipientName: string;
  setRecipientName: Dispatch<SetStateAction<string>>;
  senderName: string;
  setSenderName: Dispatch<SetStateAction<string>>;
  occasion: string;
  setOccasion: Dispatch<SetStateAction<string>>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  selectedThemeId: GiftThemeId;
  setSelectedThemeId: Dispatch<SetStateAction<GiftThemeId>>;
  openingVisual: OpeningVisual;
  setOpeningVisual: Dispatch<SetStateAction<OpeningVisual>>;
  openingButtonLabel: string;
  setOpeningButtonLabel: Dispatch<SetStateAction<string>>;
  openingButtonStyle: OpeningButtonStyle;
  setOpeningButtonStyle: Dispatch<SetStateAction<OpeningButtonStyle>>;
  declarationTitle: string;
  setDeclarationTitle: Dispatch<SetStateAction<string>>;
  declarationText: string;
  setDeclarationText: Dispatch<SetStateAction<string>>;
  declarationSignature: string;
  setDeclarationSignature: Dispatch<SetStateAction<string>>;
  showCounter: boolean;
  setShowCounter: Dispatch<SetStateAction<boolean>>;
  counterLabel: string;
  setCounterLabel: Dispatch<SetStateAction<string>>;
  relationshipStartDate: string;
  setRelationshipStartDate: Dispatch<SetStateAction<string>>;
  mediaItems: GiftMediaItem[];
  setMediaItems: Dispatch<SetStateAction<GiftMediaItem[]>>;
  mediaPresentation: MediaPresentation;
  setMediaPresentation: Dispatch<SetStateAction<MediaPresentation>>;
  soundtrack: GiftSoundtrack | null;
  setSoundtrack: Dispatch<SetStateAction<GiftSoundtrack | null>>;
  interactionEnabled: boolean;
  setInteractionEnabled: Dispatch<SetStateAction<boolean>>;
  surpriseTitle: string;
  setSurpriseTitle: Dispatch<SetStateAction<string>>;
  surpriseQuestion: string;
  setSurpriseQuestion: Dispatch<SetStateAction<string>>;
  firstAnswer: string;
  setFirstAnswer: Dispatch<SetStateAction<string>>;
  secondAnswer: string;
  setSecondAnswer: Dispatch<SetStateAction<string>>;
  correctAnswer: CorrectAnswer;
  setCorrectAnswer: Dispatch<SetStateAction<CorrectAnswer>>;
  successMessage: string;
  setSuccessMessage: Dispatch<SetStateAction<string>>;
  finalTitle: string;
  setFinalTitle: Dispatch<SetStateAction<string>>;
  finalMessage: string;
  setFinalMessage: Dispatch<SetStateAction<string>>;
  finalSignature: string;
  setFinalSignature: Dispatch<SetStateAction<string>>;
  finalVisual: FinalVisual;
  setFinalVisual: Dispatch<SetStateAction<FinalVisual>>;
  replayButtonLabel: string;
  setReplayButtonLabel: Dispatch<SetStateAction<string>>;
};

type PersistedMediaItem = Omit<GiftMediaItem, "previewUrl">;
type PersistedSoundtrack = Omit<GiftSoundtrack, "previewUrl">;

type PersistedGiftDraft = {
  version: 1;
  updatedAt: string;
  recipientName: string;
  senderName: string;
  occasion: string;
  message: string;
  selectedThemeId: GiftThemeId;
  openingVisual: OpeningVisual;
  openingButtonLabel: string;
  openingButtonStyle: OpeningButtonStyle;
  declarationTitle: string;
  declarationText: string;
  declarationSignature: string;
  showCounter: boolean;
  counterLabel: string;
  relationshipStartDate: string;
  mediaItems: PersistedMediaItem[];
  mediaPresentation: MediaPresentation;
  soundtrack: PersistedSoundtrack | null;
  interactionEnabled: boolean;
  surpriseTitle: string;
  surpriseQuestion: string;
  firstAnswer: string;
  secondAnswer: string;
  correctAnswer: CorrectAnswer;
  successMessage: string;
  finalTitle: string;
  finalMessage: string;
  finalSignature: string;
  finalVisual: FinalVisual;
  replayButtonLabel: string;
};

type StoredFile = {
  key: string;
  blob: Blob;
};

const DRAFT_STORAGE_KEY = "coraeli:gift-draft:v1";
const DRAFT_DATABASE_NAME = "coraeli-drafts";
const DRAFT_FILE_STORE = "files";

function readPersistedDraft(): PersistedGiftDraft | null {
  try {
    const savedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!savedDraft) return null;

    const parsedDraft = JSON.parse(savedDraft) as PersistedGiftDraft;
    return parsedDraft.version === 1 ? parsedDraft : null;
  } catch {
    return null;
  }
}

function openDraftDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DRAFT_DATABASE_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(DRAFT_FILE_STORE)) {
        database.createObjectStore(DRAFT_FILE_STORE, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readStoredFile(key: string) {
  const database = await openDraftDatabase();

  return new Promise<Blob | null>((resolve, reject) => {
    const transaction = database.transaction(DRAFT_FILE_STORE, "readonly");
    const request = transaction.objectStore(DRAFT_FILE_STORE).get(key);

    request.onsuccess = () => {
      database.close();
      resolve((request.result as StoredFile | undefined)?.blob ?? null);
    };
    request.onerror = () => {
      database.close();
      reject(request.error);
    };
  });
}

async function replaceStoredFiles(files: StoredFile[]) {
  const database = await openDraftDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(DRAFT_FILE_STORE, "readwrite");
    const store = transaction.objectStore(DRAFT_FILE_STORE);
    const keysRequest = store.getAllKeys();

    keysRequest.onsuccess = () => {
      const nextKeys = new Set(files.map((file) => file.key));
      keysRequest.result.forEach((key) => {
        if (!nextKeys.has(String(key))) store.delete(key);
      });
      files.forEach((file) => store.put(file));
    };

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

const GiftDraftContext = createContext<GiftDraftContextValue | null>(null);

export function GiftDraftProvider({ children }: { children: ReactNode }) {
  const [persistedDraft] = useState(readPersistedDraft);
  const [draftStatus, setDraftStatus] = useState<DraftStatus>(
    persistedDraft ? "loading" : "saving",
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    persistedDraft?.updatedAt ?? null,
  );
  const [hasLoadedFiles, setHasLoadedFiles] = useState(false);
  const fileBlobsRef = useRef<Map<string, Blob>>(new Map());
  const [recipientName, setRecipientName] = useState(
    persistedDraft?.recipientName ?? "Lívia",
  );
  const [senderName, setSenderName] = useState(
    persistedDraft?.senderName ?? "Theo",
  );
  const [occasion, setOccasion] = useState(
    persistedDraft?.occasion ?? "Declaração de amor",
  );
  const [message, setMessage] = useState(
    persistedDraft?.message ??
      "Você transformou momentos simples nas minhas melhores memórias.",
  );
  const [selectedThemeId, setSelectedThemeId] =
    useState<GiftThemeId>(persistedDraft?.selectedThemeId ?? "aurora");
  const [openingVisual, setOpeningVisual] = useState<OpeningVisual>(
    persistedDraft?.openingVisual ?? "mascot",
  );
  const [openingButtonLabel, setOpeningButtonLabel] =
    useState(persistedDraft?.openingButtonLabel ?? "Abrir meu presente");
  const [openingButtonStyle, setOpeningButtonStyle] =
    useState<OpeningButtonStyle>(persistedDraft?.openingButtonStyle ?? "solid");
  const [declarationTitle, setDeclarationTitle] = useState(
    persistedDraft?.declarationTitle ?? "Um capítulo que quero guardar",
  );
  const [declarationText, setDeclarationText] = useState(
    persistedDraft?.declarationText ??
      "Entre tantos momentos, existem alguns que merecem viver para sempre. Cada conversa, cada risada e cada pequeno detalhe fez essa história se tornar o meu lugar favorito.",
  );
  const [declarationSignature, setDeclarationSignature] = useState(
    persistedDraft?.declarationSignature ?? "Com carinho",
  );
  const [showCounter, setShowCounter] = useState(
    persistedDraft?.showCounter ?? true,
  );
  const [counterLabel, setCounterLabel] = useState(
    persistedDraft?.counterLabel ?? "Juntos há",
  );
  const [relationshipStartDate, setRelationshipStartDate] =
    useState(persistedDraft?.relationshipStartDate ?? "2024-04-04");
  const [mediaItems, setMediaItemsState] = useState<GiftMediaItem[]>([]);
  const [mediaPresentation, setMediaPresentation] =
    useState<MediaPresentation>(persistedDraft?.mediaPresentation ?? "carousel");
  const mediaItemsRef = useRef<GiftMediaItem[]>([]);
  const [soundtrack, setSoundtrackState] = useState<GiftSoundtrack | null>(null);
  const soundtrackRef = useRef<GiftSoundtrack | null>(null);
  const [interactionEnabled, setInteractionEnabled] = useState(
    persistedDraft?.interactionEnabled ?? true,
  );
  const [surpriseTitle, setSurpriseTitle] = useState(
    persistedDraft?.surpriseTitle ?? "Uma pergunta só nossa",
  );
  const [surpriseQuestion, setSurpriseQuestion] = useState(
    persistedDraft?.surpriseQuestion ??
      "Qual lugar marcou o começo da nossa história?",
  );
  const [firstAnswer, setFirstAnswer] = useState(
    persistedDraft?.firstAnswer ?? "Na praça",
  );
  const [secondAnswer, setSecondAnswer] = useState(
    persistedDraft?.secondAnswer ?? "No cinema",
  );
  const [correctAnswer, setCorrectAnswer] =
    useState<CorrectAnswer>(persistedDraft?.correctAnswer ?? "first");
  const [successMessage, setSuccessMessage] = useState(
    persistedDraft?.successMessage ??
      "Você lembrou! É por isso que cada detalhe ao seu lado é especial.",
  );
  const [finalTitle, setFinalTitle] = useState(
    persistedDraft?.finalTitle ?? "Esta história ainda está só começando.",
  );
  const [finalMessage, setFinalMessage] = useState(
    persistedDraft?.finalMessage ??
      "Obrigado por transformar meus dias comuns em lembranças que eu quero guardar para sempre.",
  );
  const [finalSignature, setFinalSignature] = useState(
    persistedDraft?.finalSignature ?? "Com todo o meu carinho",
  );
  const [finalVisual, setFinalVisual] =
    useState<FinalVisual>(persistedDraft?.finalVisual ?? "celebration");
  const [replayButtonLabel, setReplayButtonLabel] = useState(
    persistedDraft?.replayButtonLabel ?? "Ver novamente",
  );

  function setMediaItems(action: SetStateAction<GiftMediaItem[]>) {
    setMediaItemsState((currentItems) => {
      const nextItems =
        typeof action === "function" ? action(currentItems) : action;
      currentItems.forEach((currentItem) => {
        const matchingItem = nextItems.find((item) => item.id === currentItem.id);
        if (!matchingItem || matchingItem.previewUrl !== currentItem.previewUrl) {
          fileBlobsRef.current.delete(`media:${currentItem.id}`);
        }
      });
      mediaItemsRef.current = nextItems;
      return nextItems;
    });
  }

  function setSoundtrack(action: SetStateAction<GiftSoundtrack | null>) {
    setSoundtrackState((currentSoundtrack) => {
      const nextSoundtrack =
        typeof action === "function" ? action(currentSoundtrack) : action;
      if (currentSoundtrack?.previewUrl !== nextSoundtrack?.previewUrl) {
        fileBlobsRef.current.delete("soundtrack");
      }
      soundtrackRef.current = nextSoundtrack;
      return nextSoundtrack;
    });
  }

  useEffect(() => {
    let wasCancelled = false;
    const createdUrls: string[] = [];

    async function restoreSavedFiles() {
      try {
        const restoredMedia = await Promise.all(
          (persistedDraft?.mediaItems ?? []).map(async (item) => {
            const key = `media:${item.id}`;
            const blob = await readStoredFile(key);
            if (!blob) return null;

            const previewUrl = URL.createObjectURL(blob);
            createdUrls.push(previewUrl);
            fileBlobsRef.current.set(key, blob);
            return { ...item, previewUrl } satisfies GiftMediaItem;
          }),
        );

        let restoredSoundtrack: GiftSoundtrack | null = null;
        if (persistedDraft?.soundtrack) {
          const blob = await readStoredFile("soundtrack");
          if (blob) {
            const previewUrl = URL.createObjectURL(blob);
            createdUrls.push(previewUrl);
            fileBlobsRef.current.set("soundtrack", blob);
            restoredSoundtrack = { ...persistedDraft.soundtrack, previewUrl };
          }
        }

        if (wasCancelled) {
          createdUrls.forEach((url) => URL.revokeObjectURL(url));
          return;
        }

        const validMedia = restoredMedia.filter(
          (item): item is GiftMediaItem => item !== null,
        );
        mediaItemsRef.current = validMedia;
        soundtrackRef.current = restoredSoundtrack;
        setMediaItemsState(validMedia);
        setSoundtrackState(restoredSoundtrack);
      } catch {
        if (!wasCancelled) setDraftStatus("error");
      } finally {
        if (!wasCancelled) setHasLoadedFiles(true);
      }
    }

    void restoreSavedFiles();

    return () => {
      wasCancelled = true;
    };
  }, [persistedDraft]);

  useEffect(() => {
    if (!hasLoadedFiles) return;

    setDraftStatus("saving");

    const saveTimer = window.setTimeout(() => {
      async function saveDraft() {
        try {
          const updatedAt = new Date().toISOString();
          const persistedMedia = mediaItems.map(
            ({ id, mediaType, fileName, caption }) => ({
              id,
              mediaType,
              fileName,
              caption,
            }),
          );
          const persistedSoundtrack = soundtrack
            ? {
                fileName: soundtrack.fileName,
                title: soundtrack.title,
              }
            : null;

          const draft: PersistedGiftDraft = {
            version: 1,
            updatedAt,
            recipientName,
            senderName,
            occasion,
            message,
            selectedThemeId,
            openingVisual,
            openingButtonLabel,
            openingButtonStyle,
            declarationTitle,
            declarationText,
            declarationSignature,
            showCounter,
            counterLabel,
            relationshipStartDate,
            mediaItems: persistedMedia,
            mediaPresentation,
            soundtrack: persistedSoundtrack,
            interactionEnabled,
            surpriseTitle,
            surpriseQuestion,
            firstAnswer,
            secondAnswer,
            correctAnswer,
            successMessage,
            finalTitle,
            finalMessage,
            finalSignature,
            finalVisual,
            replayButtonLabel,
          };

          window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));

          const storedFiles: StoredFile[] = [];
          for (const item of mediaItems) {
            const key = `media:${item.id}`;
            let blob = fileBlobsRef.current.get(key);
            if (!blob) {
              const response = await fetch(item.previewUrl);
              blob = await response.blob();
              fileBlobsRef.current.set(key, blob);
            }
            storedFiles.push({ key, blob });
          }

          if (soundtrack) {
            let blob = fileBlobsRef.current.get("soundtrack");
            if (!blob) {
              const response = await fetch(soundtrack.previewUrl);
              blob = await response.blob();
              fileBlobsRef.current.set("soundtrack", blob);
            }
            storedFiles.push({ key: "soundtrack", blob });
          }

          await replaceStoredFiles(storedFiles);
          setLastSavedAt(updatedAt);
          setDraftStatus("saved");
        } catch {
          setDraftStatus("error");
        }
      }

      void saveDraft();
    }, 700);

    return () => window.clearTimeout(saveTimer);
  }, [
    hasLoadedFiles,
    recipientName,
    senderName,
    occasion,
    message,
    selectedThemeId,
    openingVisual,
    openingButtonLabel,
    openingButtonStyle,
    declarationTitle,
    declarationText,
    declarationSignature,
    showCounter,
    counterLabel,
    relationshipStartDate,
    mediaItems,
    mediaPresentation,
    soundtrack,
    interactionEnabled,
    surpriseTitle,
    surpriseQuestion,
    firstAnswer,
    secondAnswer,
    correctAnswer,
    successMessage,
    finalTitle,
    finalMessage,
    finalSignature,
    finalVisual,
    replayButtonLabel,
  ]);

  useEffect(() => {
    return () => {
      mediaItemsRef.current.forEach((item) => {
        URL.revokeObjectURL(item.previewUrl);
      });
      if (soundtrackRef.current) {
        URL.revokeObjectURL(soundtrackRef.current.previewUrl);
      }
    };
  }, []);

  return (
    <GiftDraftContext.Provider
      value={{
        draftStatus,
        lastSavedAt,
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
        openingVisual,
        setOpeningVisual,
        openingButtonLabel,
        setOpeningButtonLabel,
        openingButtonStyle,
        setOpeningButtonStyle,
        declarationTitle,
        setDeclarationTitle,
        declarationText,
        setDeclarationText,
        declarationSignature,
        setDeclarationSignature,
        showCounter,
        setShowCounter,
        counterLabel,
        setCounterLabel,
        relationshipStartDate,
        setRelationshipStartDate,
        mediaItems,
        setMediaItems,
        mediaPresentation,
        setMediaPresentation,
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
        finalTitle,
        setFinalTitle,
        finalMessage,
        setFinalMessage,
        finalSignature,
        setFinalSignature,
        finalVisual,
        setFinalVisual,
        replayButtonLabel,
        setReplayButtonLabel,
      }}
    >
      {children}
    </GiftDraftContext.Provider>
  );
}

export function useGiftDraft() {
  const context = useContext(GiftDraftContext);

  if (!context) {
    throw new Error("useGiftDraft precisa ser usado dentro de GiftDraftProvider.");
  }

  return context;
}