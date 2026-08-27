import { useRef } from "react";
import type {
  DecorationAssetId,
  DecorationSlotId,
} from "../context/GiftDraftContext";
import {
  decorationAssets,
  decorationCollectionLabels,
  decorationSlotLabels,
  getDecorationAsset,
} from "../data/decorationCatalog";
import "./DecorationPicker.css";

type DecorationPickerProps = {
  slot: DecorationSlotId;
  value: DecorationAssetId | null;
  onChange: (assetId: DecorationAssetId | null) => void;
};

export function DecorationPicker({ slot, value, onChange }: DecorationPickerProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const selectedAsset = getDecorationAsset(value);

  function selectAsset(assetId: DecorationAssetId | null) {
    onChange(assetId);
    dialogRef.current?.close();
  }

  return (
    <section className="decoration-picker" aria-labelledby={`decoration-${slot}-title`}>
      <div className="decoration-picker__heading">
        <span aria-hidden="true">✦</span>
        <div>
          <strong id={`decoration-${slot}-title`}>{decorationSlotLabels[slot]}</strong>
          <small>Escolha um detalhe ou deixe esta parte mais limpa.</small>
        </div>
      </div>

      <button
        className="decoration-picker__trigger"
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        {selectedAsset ? (
          <>
            <span className="decoration-picker__current">
              <img src={selectedAsset.src} alt="" />
            </span>
            <span>
              <small>Escolhido</small>
              <strong>{selectedAsset.name}</strong>
            </span>
            <em>Trocar</em>
          </>
        ) : (
          <>
            <span className="decoration-picker__add" aria-hidden="true">＋</span>
            <span>
              <strong>Adicionar personagem</strong>
              <small>Veja todos os elementos disponíveis</small>
            </span>
            <em>Escolher</em>
          </>
        )}
      </button>

      <dialog
        ref={dialogRef}
        className="decoration-library"
        aria-labelledby={`decoration-${slot}-library-title`}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="decoration-library__sheet">
          <header>
            <div>
              <span>Biblioteca de personagens</span>
              <h3 id={`decoration-${slot}-library-title`}>Escolha um personagem</h3>
              <p>A prévia muda assim que você escolher.</p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Fechar galeria"
            >
              ×
            </button>
          </header>

          <div className="decoration-library__grid decoration-library__grid--none">
            <button
              className={!value ? "is-selected decoration-library__none" : "decoration-library__none"}
              type="button"
              onClick={() => selectAsset(null)}
              aria-pressed={!value}
            >
              <span aria-hidden="true">—</span>
              <strong>Sem personagem</strong>
              <small>Deixa esta etapa mais limpa.</small>
            </button>
          </div>

          {(["hello-kitty", "snoopy", "keroppi", "aurora"] as const).map((collection) => (
            <section className="decoration-library__collection" key={collection}>
              <h4>{decorationCollectionLabels[collection]}</h4>
              <div className="decoration-library__grid">
                {decorationAssets
                  .filter((asset) => asset.collection === collection)
                  .map((asset) => (
                    <button
                      className={value === asset.id ? "is-selected" : ""}
                      type="button"
                      key={asset.id}
                      onClick={() => selectAsset(asset.id)}
                      aria-pressed={value === asset.id}
                    >
                      <span className="decoration-library__preview">
                        <img src={asset.src} alt="" />
                      </span>
                      <strong>{asset.name}</strong>
                      <small>{asset.description}</small>
                    </button>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </dialog>
    </section>
  );
}

type DecorationVisualProps = {
  assetId: DecorationAssetId | null | undefined;
  className?: string;
  decorative?: boolean;
};

export function DecorationVisual({
  assetId,
  className = "",
  decorative = true,
}: DecorationVisualProps) {
  const asset = getDecorationAsset(assetId);
  if (!asset) return null;

  return (
    <span className={`decoration-visual ${className}`.trim()}>
      <img
        src={asset.src}
        alt={decorative ? "" : asset.name}
        draggable="false"
        decoding="async"
      />
    </span>
  );
}
