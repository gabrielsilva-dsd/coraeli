import helloHeartFrame from "../assets/themes/hello-kitty/heart-frame.gif";
import helloKissHearts from "../assets/themes/hello-kitty/kiss-hearts.gif";
import helloLoveDance from "../assets/themes/hello-kitty/love-dance.gif";
import helloPixelLove from "../assets/themes/hello-kitty/pixel-love.jpg";
import helloShyLetter from "../assets/themes/hello-kitty/shy-letter.gif";
import helloWave from "../assets/themes/hello-kitty/wave.gif";
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
  collection: "hello-kitty";
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
];

export const emptyDecorations: GiftDecorations = {
  opening: null,
  declaration: null,
  moments: null,
  surprise: null,
  final: null,
};

export const helloKittyRecommendedDecorations: GiftDecorations = {
  opening: "hello-shy-letter",
  declaration: "hello-heart-frame",
  moments: "hello-kiss-hearts",
  surprise: "hello-love-dance",
  final: "hello-wave",
};

export const decorationSlotLabels: Record<DecorationSlotId, string> = {
  opening: "Personagem da abertura",
  declaration: "Detalhe da declaração",
  moments: "Detalhe dos momentos",
  surprise: "Personagem da surpresa",
  final: "Personagem do encerramento",
};

export function getDecorationAsset(id: DecorationAssetId | null | undefined) {
  if (!id) return null;
  return decorationAssets.find((asset) => asset.id === id) ?? null;
}
