import { supabase } from "../lib/supabase";
import type { GiftDraftSnapshot } from "../context/GiftDraftContext";

const MEDIA_BUCKET = "gift-media";

type PublishGiftInput = {
  userId: string;
  draft: GiftDraftSnapshot;
  getMediaBlob: (mediaId: number) => Promise<Blob | null>;
  getSoundtrackBlob: () => Promise<Blob | null>;
  onProgress?: (message: string) => void;
};

export type PublishedGift = {
  id: string;
  slug: string;
  content: GiftDraftSnapshot;
  publishedAt: string;
};

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 38);
}

function createSlug(recipientName: string) {
  const base = normalizeSlug(recipientName) || "presente";
  const randomValues = crypto.getRandomValues(new Uint32Array(2));
  const suffix = Array.from(randomValues, (value) => value.toString(36))
    .join("")
    .slice(0, 9);

  return `${base}-${suffix}`;
}

function getFileExtension(fileName: string, blob: Blob) {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  if (fileExtension && /^[a-z0-9]{2,8}$/.test(fileExtension)) {
    return fileExtension;
  }

  const mimeExtensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/ogg": "ogg",
    "audio/wav": "wav",
  };

  return mimeExtensions[blob.type] ?? "bin";
}

async function uploadBlob(path: string, blob: Blob) {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, {
    cacheControl: "31536000",
    contentType: blob.type || "application/octet-stream",
    upsert: false,
  });

  if (error) throw error;

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function publishGift({
  userId,
  draft,
  getMediaBlob,
  getSoundtrackBlob,
  onProgress,
}: PublishGiftInput): Promise<PublishedGift> {
  const giftId = crypto.randomUUID();
  const slug = createSlug(draft.recipientName);
  const uploadedPaths: string[] = [];

  try {
    const publishedMedia = [] as GiftDraftSnapshot["mediaItems"];

    for (const [index, mediaItem] of draft.mediaItems.entries()) {
      onProgress?.(`Enviando momento ${index + 1} de ${draft.mediaItems.length}`);

      const blob = await getMediaBlob(mediaItem.id);
      if (!blob) {
        throw new Error(`Não foi possível preparar o arquivo ${index + 1}.`);
      }

      const extension = getFileExtension(mediaItem.fileName, blob);
      const path = `${userId}/${giftId}/momento-${index + 1}.${extension}`;
      const publicUrl = await uploadBlob(path, blob);
      uploadedPaths.push(path);
      publishedMedia.push({ ...mediaItem, previewUrl: publicUrl });
    }

    let publishedSoundtrack = draft.soundtrack;
    if (draft.soundtrack) {
      onProgress?.("Enviando a música");
      const blob = await getSoundtrackBlob();
      if (!blob) throw new Error("Não foi possível preparar a música.");

      const extension = getFileExtension(draft.soundtrack.fileName, blob);
      const path = `${userId}/${giftId}/trilha-sonora.${extension}`;
      const publicUrl = await uploadBlob(path, blob);
      uploadedPaths.push(path);
      publishedSoundtrack = { ...draft.soundtrack, previewUrl: publicUrl };
    }

    const content: GiftDraftSnapshot = {
      ...draft,
      mediaItems: publishedMedia,
      soundtrack: publishedSoundtrack,
    };
    const publishedAt = new Date().toISOString();

    onProgress?.("Criando o link exclusivo");
    const { data, error } = await supabase
      .from("gifts")
      .insert({
        id: giftId,
        owner_id: userId,
        user_id: userId,
        slug,
        status: "published",
        theme_id: draft.selectedThemeId,
        recipient_name: draft.recipientName.trim() || "Alguém especial",
        content,
        published_at: publishedAt,
      })
      .select("id, slug, content, published_at")
      .single();

    if (error) throw error;

    return {
      id: data.id,
      slug: data.slug,
      content: data.content as GiftDraftSnapshot,
      publishedAt: data.published_at,
    };
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(MEDIA_BUCKET).remove(uploadedPaths);
    }
    throw error;
  }
}

export async function getPublishedGift(slug: string): Promise<PublishedGift> {
  const { data, error } = await supabase
    .from("gifts")
    .select("id, slug, content, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) throw error;
  if (!data?.content || typeof data.content !== "object") {
    throw new Error("O conteúdo deste presente não está disponível.");
  }

  return {
    id: data.id,
    slug: data.slug,
    content: data.content as GiftDraftSnapshot,
    publishedAt: data.published_at,
  };
}
