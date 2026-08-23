import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type GiftThemeId = "aurora" | "cinema" | "essencia";

type GiftDraftContextValue = {
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
};

const GiftDraftContext = createContext<GiftDraftContextValue | null>(null);

export function GiftDraftProvider({ children }: { children: ReactNode }) {
  const [recipientName, setRecipientName] = useState("Lívia");
  const [senderName, setSenderName] = useState("Theo");
  const [occasion, setOccasion] = useState("Declaração de amor");
  const [message, setMessage] = useState(
    "Você transformou momentos simples nas minhas melhores memórias.",
  );
  const [selectedThemeId, setSelectedThemeId] =
    useState<GiftThemeId>("aurora");

  return (
    <GiftDraftContext.Provider
      value={{
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