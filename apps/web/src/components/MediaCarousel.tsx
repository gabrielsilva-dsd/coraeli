import { useEffect, useRef } from "react";
import "./MediaCarousel.css";

type CarouselItem = {
  id: number;
  mediaType: "image" | "video";
  previewUrl: string;
  caption: string;
};

type MediaCarouselProps = {
  items: CarouselItem[];
  mode: "carousel" | "showcase" | "gallery";
};

export function MediaCarousel({ items, mode }: MediaCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const movementRef = useRef<Animation | null>(null);
  const hasMultipleItems = items.length > 1;

  useEffect(() => {
    const track = trackRef.current;

    if (!track || mode === "gallery" || !hasMultipleItems) return;

    function startMovement() {
      if (!track) return;

      movementRef.current?.cancel();

      const trackStyles = window.getComputedStyle(track);
      const gap = Number.parseFloat(trackStyles.columnGap) || 0;
      const loopDistance = (track.scrollWidth + gap) / 2;
      const pixelsPerSecond = mode === "showcase" ? 14 : 15;
      const duration = (loopDistance / pixelsPerSecond) * 1_000;

      movementRef.current = track.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: `translate3d(-${loopDistance}px, 0, 0)` },
        ],
        {
          duration,
          iterations: Infinity,
          easing: "linear",
        },
      );
    }

    startMovement();

    const resizeObserver = new ResizeObserver(startMovement);
    resizeObserver.observe(track);

    return () => {
      resizeObserver.disconnect();
      movementRef.current?.cancel();
      movementRef.current = null;
    };
  }, [hasMultipleItems, items.length, mode]);

  if (items.length === 0) return null;

  if (mode === "gallery") {
    return (
      <section className="media-gallery" aria-label={`Galeria com ${items.length} mídias`}>
        {items.map((item, index) => (
          <figure key={item.id}>
            {item.mediaType === "image" ? (
              <img
                src={item.previewUrl}
                alt={item.caption || `Momento ${index + 1}`}
              />
            ) : (
              <video src={item.previewUrl} controls playsInline preload="metadata" />
            )}

            {item.caption && <figcaption>{item.caption}</figcaption>}
          </figure>
        ))}
      </section>
    );
  }

  const loopingItems = hasMultipleItems ? [...items, ...items] : items;

  return (
    <section
      className={`media-carousel media-carousel--${mode}${
        hasMultipleItems ? "" : " media-carousel--single"
      }`}
      aria-label={`Carrossel contínuo com ${items.length} mídias`}
    >
      <div className="media-carousel__viewport">
        <div className="media-carousel__track" ref={trackRef}>
          {loopingItems.map((item, index) => {
            const originalIndex = index % items.length;
            const isClone = hasMultipleItems && index >= items.length;

            return (
              <figure
                className="media-carousel__slide"
                key={`${isClone ? "clone" : "original"}-${item.id}-${index}`}
                aria-hidden={isClone || undefined}
              >
                {item.mediaType === "image" ? (
                  <img
                    src={item.previewUrl}
                    alt={isClone ? "" : item.caption || `Momento ${originalIndex + 1}`}
                  />
                ) : (
                  <video
                    src={item.previewUrl}
                    controls={!isClone}
                    playsInline
                    preload="metadata"
                    tabIndex={isClone ? -1 : undefined}
                    onPlay={() => movementRef.current?.pause()}
                    onPause={() => movementRef.current?.play()}
                    onEnded={() => movementRef.current?.play()}
                  />
                )}

                {item.caption && <figcaption>{item.caption}</figcaption>}
              </figure>
            );
          })}
        </div>
      </div>

      {hasMultipleItems && (
        <p className="media-carousel__hint">As lembranças passam continuamente</p>
      )}
    </section>
  );
}
