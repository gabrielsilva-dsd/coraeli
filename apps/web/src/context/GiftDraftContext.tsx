import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type GiftThemeId = "aurora" | "cinema" | "essencia";
export type OpeningVisual = "mascot" | "heart" | "minimal";
export type OpeningButtonStyle = "solid" | "outline";

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
  const [openingVisual, setOpeningVisual] = useState<OpeningVisual>("mascot");
  const [openingButtonLabel, setOpeningButtonLabel] =
    useState("Abrir meu presente");
  const [openingButtonStyle, setOpeningButtonStyle] =
    useState<OpeningButtonStyle>("solid");
  const [declarationTitle, setDeclarationTitle] = useState(
    "Um capítulo que quero guardar",
  );
  const [declarationText, setDeclarationText] = useState(
    "Entre tantos momentos, existem alguns que merecem viver para sempre. Cada conversa, cada risada e cada pequeno detalhe fez essa história se tornar o meu lugar favorito.",
  );
  const [declarationSignature, setDeclarationSignature] = useState("Com carinho");
  const [showCounter, setShowCounter] = useState(true);
  const [counterLabel, setCounterLabel] = useState("Juntos há");
  const [relationshipStartDate, setRelationshipStartDate] =
    useState("2024-04-04");

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