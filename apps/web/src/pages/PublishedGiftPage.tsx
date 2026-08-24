import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ExperiencePage } from "./ExperiencePage";
import {
  getPublishedGift,
  type PublishedGift,
} from "../services/giftPublishing";
import "./PublishedGiftPage.css";

export function PublishedGiftPage() {
  const { slug = "" } = useParams();
  const [gift, setGift] = useState<PublishedGift | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found">(
    "loading",
  );

  useEffect(() => {
    let isActive = true;

    async function loadGift() {
      try {
        const publishedGift = await getPublishedGift(slug);
        if (!isActive) return;
        setGift(publishedGift);
        setStatus("ready");
      } catch {
        if (isActive) setStatus("not-found");
      }
    }

    if (slug) void loadGift();
    else setStatus("not-found");

    return () => {
      isActive = false;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <main className="published-gift-state" role="status">
        <span className="published-gift-state__mark" aria-hidden="true">C</span>
        <p>Preparando uma surpresa...</p>
        <i aria-hidden="true" />
      </main>
    );
  }

  if (status === "not-found" || !gift) {
    return (
      <main className="published-gift-state published-gift-state--error">
        <span className="published-gift-state__mark" aria-hidden="true">♥</span>
        <h1>Este presente não foi encontrado</h1>
        <p>Confira se o endereço está completo ou peça um novo link à pessoa que enviou.</p>
        <Link to="/">Conhecer a Coraeli</Link>
      </main>
    );
  }

  return <ExperiencePage draft={gift.content} showEditorLink={false} />;
}
