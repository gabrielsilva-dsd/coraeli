import helloHeartFrame from "../assets/themes/hello-kitty/heart-frame.gif";
import helloKissHearts from "../assets/themes/hello-kitty/kiss-hearts.gif";
import helloLoveDance from "../assets/themes/hello-kitty/love-dance.gif";
import helloPixelLove from "../assets/themes/hello-kitty/pixel-love.jpg";
import helloShyLetter from "../assets/themes/hello-kitty/shy-letter.gif";
import helloWave from "../assets/themes/hello-kitty/wave.gif";
import auroraCelebration from "../assets/themes/aurora/comemorando.gif";
import auroraWaiting from "../assets/themes/aurora/espera.gif";
import auroraMain from "../assets/themes/aurora/principal.gif";
import type {
  DecorationAssetId,
  DecorationSlotId,
  GiftDecorations,
  GiftThemeId,
} from "../context/GiftDraftContext";

export type DecorationAsset = {
  id: DecorationAssetId;
  name: string;
  description: string;
  collection: "hello-kitty" | "aurora";
  src: string;
  kind: "gif" | "image";
};

export type GiftTheme = {
  id: GiftThemeId;
  name: string;
  description: string;
  colors: [string, string, string];
  collection?: DecorationAsset["collection"];
};

export const giftThemes: GiftTheme[] = [
  {
    id: "hello-kitty",
    name: "Hello Kitty",
    description: "Rosa, laços e pequenos gestos de carinho.",
    colors: ["#f45f8f", "#ffd7e4", "#fff8f4"],
    collection: "hello-kitty",
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Romântico, delicado e acolhedor.",
    colors: ["#ed4f70", "#f7a8ba", "#fff2ed"],
  },
  {
    id: "cinema",
    name: "Cinema",
    description: "Dourado, dramático e elegante.",
    colors: ["#e5b94f", "#5c2e22", "#1a0e0a"],
  },
  {
    id: "essencia",
    name: "Essência",
    description: "Leve, sereno e minimalista.",
    colors: ["#a78bca", "#d7c4e7", "#eee8f2"],
  },
];

export const decorationAssets: DecorationAsset[] = [
  {
    id: "hello-shy-letter",
    name: "Cartinha tímida",
    description: "Um gesto apaixonado para abrir a surpresa.",
    collection: "hello-kitty",
    src: helloShyLetter,
    kind: "gif",
  },
  {
    id: "hello-heart-frame",
    name: "Coração delicado",
    description: "Combina com declarações e contadores.",
    collection: "hello-kitty",
    src: helloHeartFrame,
    kind: "gif",
  },
  {
    id: "hello-kiss-hearts",
    name: "Beijinhos",
    description: "Corações leves para acompanhar os momentos.",
    collection: "hello-kitty",
    src: helloKissHearts,
    kind: "gif",
  },
  {
    id: "hello-love-dance",
    name: "Dança do amor",
    description: "Uma reação animada para perguntas e brincadeiras.",
    collection: "hello-kitty",
    src: helloLoveDance,
    kind: "gif",
  },
  {
    id: "hello-wave",
    name: "Tchau com carinho",
    description: "Uma despedida suave para o encerramento.",
    collection: "hello-kitty",
    src: helloWave,
    kind: "gif",
  },
  {
    id: "hello-pixel-love",
    name: "Amor retrô",
    description: "Versão pixelada para uma composição divertida.",
    collection: "hello-kitty",
    src: helloPixelLove,
    kind: "image",
  },
  {
    id: "aurora-main",
    name: "Cartinha apaixonada",
    description: "Personagem principal da coleção Aurora.",
    collection: "aurora",
    src: auroraMain,
    kind: "gif",
  },
  {
    id: "aurora-waiting",
    name: "Esperando resposta",
    description: "Reação delicada para perguntas e surpresas.",
    collection: "aurora",
    src: auroraWaiting,
    kind: "gif",
  },
  {
    id: "aurora-celebration",
    name: "Comemorando",
    description: "Uma reação alegre para fechar a experiência.",
    collection: "aurora",
    src: auroraCelebration,
    kind: "gif",
  },
];

export const emptyDecorations: GiftDecorations = {
  openingPrimary: null,
  openingSecondary: null,
  declarationPrimary: null,
  declarationSecondary: null,
  momentsPrimary: null,
  momentsSecondary: null,
  surprisePrimary: null,
  surpriseSecondary: null,
  finalPrimary: null,
  finalSecondary: null,
};

export const helloKittyRecommendedDecorations: GiftDecorations = {
  openingPrimary: "hello-shy-letter",
  openingSecondary: null,
  declarationPrimary: "hello-heart-frame",
  declarationSecondary: null,
  momentsPrimary: "hello-kiss-hearts",
  momentsSecondary: null,
  surprisePrimary: "hello-love-dance",
  surpriseSecondary: null,
  finalPrimary: "hello-wave",
  finalSecondary: null,
};

export const decorationSlotLabels: Record<DecorationSlotId, string> = {
  openingPrimary: "Personagem da abertura",
  openingSecondary: "Detalhe adicional da abertura",
  declarationPrimary: "Personagem da declaração",
  declarationSecondary: "Detalhe adicional da declaração",
  momentsPrimary: "Personagem dos momentos",
  momentsSecondary: "Detalhe adicional dos momentos",
  surprisePrimary: "Personagem da surpresa",
  surpriseSecondary: "Reação adicional da surpresa",
  finalPrimary: "Personagem do encerramento",
  finalSecondary: "Detalhe adicional do encerramento",
};

export const decorationCollectionLabels: Record<DecorationAsset["collection"], string> = {
  "hello-kitty": "Hello Kitty",
  aurora: "Aurora",
};

export function getDecorationAsset(id: DecorationAssetId | null | undefined) {
  if (!id) return null;
  return decorationAssets.find((asset) => asset.id === id) ?? null;
}
