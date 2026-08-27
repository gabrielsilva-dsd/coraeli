import helloHeartFrame from "../assets/themes/hello-kitty/heart-frame.gif";
import helloKissHearts from "../assets/themes/hello-kitty/kiss-hearts.gif";
import helloLoveDance from "../assets/themes/hello-kitty/love-dance.gif";
import helloPixelLove from "../assets/themes/hello-kitty/pixel-love.jpg";
import helloShyLetter from "../assets/themes/hello-kitty/shy-letter.gif";
import helloWave from "../assets/themes/hello-kitty/wave.gif";
import snoopySleeping from "../assets/themes/snoopy/sleeping.gif";
import snoopyHeartDelivery from "../assets/themes/snoopy/heart-delivery.gif";
import snoopyLoveHearts from "../assets/themes/snoopy/love-hearts.gif";
import snoopyShy from "../assets/themes/snoopy/shy.gif";
import snoopyWowLove from "../assets/themes/snoopy/wow-love.gif";
import snoopyPixelLove from "../assets/themes/snoopy/pixel-love.gif";
import keroppiHeartSnack from "../assets/themes/keroppi/heart-snack.gif";
import keroppiFlowerGarden from "../assets/themes/keroppi/flower-garden.gif";
import keroppiSweetLook from "../assets/themes/keroppi/sweet-look.gif";
import keroppiHappy from "../assets/themes/keroppi/happy.gif";
import keroppiBirthday from "../assets/themes/keroppi/birthday.gif";
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
  collection: "hello-kitty" | "snoopy" | "keroppi" | "aurora";
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
    id: "snoopy",
    name: "Snoopy",
    description: "Creme, cinza e traços clássicos em preto.",
    colors: ["#202020", "#d8d5cf", "#fffaf0"],
    collection: "snoopy",
  },
  {
    id: "keroppi",
    name: "Keroppi",
    description: "Verde vibrante, divertido e cheio de energia.",
    colors: ["#a8d93f", "#19734a", "#fffdf5"],
    collection: "keroppi",
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
    id: "snoopy-sleeping",
    name: "Soninho tranquilo",
    description: "Um detalhe calmo e carinhoso para a abertura.",
    collection: "snoopy",
    src: snoopySleeping,
    kind: "gif",
  },
  {
    id: "snoopy-heart-delivery",
    name: "Entrega de amor",
    description: "Um coração especial para declarações.",
    collection: "snoopy",
    src: snoopyHeartDelivery,
    kind: "gif",
  },
  {
    id: "snoopy-love-hearts",
    name: "Corações apaixonados",
    description: "Combina com fotos e momentos do casal.",
    collection: "snoopy",
    src: snoopyLoveHearts,
    kind: "gif",
  },
  {
    id: "snoopy-shy",
    name: "Timidez apaixonada",
    description: "Uma reação delicada para perguntas e surpresas.",
    collection: "snoopy",
    src: snoopyShy,
    kind: "gif",
  },
  {
    id: "snoopy-wow-love",
    name: "Uau, é amor",
    description: "Uma reação divertida para o grande momento.",
    collection: "snoopy",
    src: snoopyWowLove,
    kind: "gif",
  },
  {
    id: "snoopy-pixel-love",
    name: "Snoopy retrô",
    description: "Um toque pixelado para composições descontraídas.",
    collection: "snoopy",
    src: snoopyPixelLove,
    kind: "gif",
  },
  {
    id: "keroppi-heart-snack",
    name: "Lanchinho apaixonado",
    description: "Uma abertura divertida cercada de corações.",
    collection: "keroppi",
    src: keroppiHeartSnack,
    kind: "gif",
  },
  {
    id: "keroppi-flower-garden",
    name: "Jardim tranquilo",
    description: "Um momento leve para acompanhar a declaração.",
    collection: "keroppi",
    src: keroppiFlowerGarden,
    kind: "gif",
  },
  {
    id: "keroppi-sweet-look",
    name: "Olhar carinhoso",
    description: "Uma reação delicada para fotos e memórias.",
    collection: "keroppi",
    src: keroppiSweetLook,
    kind: "gif",
  },
  {
    id: "keroppi-happy",
    name: "Alegria verde",
    description: "Uma reação animada para perguntas e brincadeiras.",
    collection: "keroppi",
    src: keroppiHappy,
    kind: "gif",
  },
  {
    id: "keroppi-birthday",
    name: "Bolo de comemoração",
    description: "Um encerramento alegre para celebrar a surpresa.",
    collection: "keroppi",
    src: keroppiBirthday,
    kind: "gif",
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

export const snoopyRecommendedDecorations: GiftDecorations = {
  openingPrimary: "snoopy-sleeping",
  openingSecondary: null,
  declarationPrimary: "snoopy-heart-delivery",
  declarationSecondary: null,
  momentsPrimary: "snoopy-love-hearts",
  momentsSecondary: null,
  surprisePrimary: "snoopy-shy",
  surpriseSecondary: null,
  finalPrimary: "snoopy-wow-love",
  finalSecondary: null,
};

export const keroppiRecommendedDecorations: GiftDecorations = {
  openingPrimary: "keroppi-heart-snack",
  openingSecondary: null,
  declarationPrimary: "keroppi-flower-garden",
  declarationSecondary: null,
  momentsPrimary: "keroppi-sweet-look",
  momentsSecondary: null,
  surprisePrimary: "keroppi-happy",
  surpriseSecondary: null,
  finalPrimary: "keroppi-birthday",
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
  snoopy: "Snoopy",
  keroppi: "Keroppi",
  aurora: "Aurora",
};

export function getDecorationAsset(id: DecorationAssetId | null | undefined) {
  if (!id) return null;
  return decorationAssets.find((asset) => asset.id === id) ?? null;
}
