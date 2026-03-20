"use client";

/**
 * COMPOSANT ImageLightbox
 *
 * Affiche une image cliquable. Au clic, l'image s'ouvre en plein écran
 * avec un fond noir. Cliquer n'importe où ou appuyer Escape ferme le lightbox.
 * Utilise createPortal pour monter le lightbox directement dans <body>,
 * évitant les problèmes de z-index et d'overflow.
 */

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export default function ImageLightbox({
  src,
  alt,
  width,
  height,
  sizes,
  className = "",
  priority = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // S'assurer qu'on est côté client pour le portail
  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // Fermer avec Escape + bloquer le scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const lightbox = isOpen && mounted
    ? createPortal(
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.92)",
            cursor: "pointer",
          }}
          onClick={close}
        >
          {/* Bouton fermer */}
          <button
            onClick={close}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              padding: 8,
              color: "rgba(255,255,255,0.7)",
              background: "none",
              border: "none",
              cursor: "pointer",
              zIndex: 10,
            }}
            aria-label="Fermer"
          >
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image en plein écran */}
          <div
            style={{
              position: "relative",
              width: "95vw",
              height: "90vh",
            }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="95vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setIsOpen(true);
        }}
        style={{ cursor: "zoom-in", width: "100%" }}
        aria-label="Cliquer pour agrandir l'image"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={className}
          priority={priority}
        />
      </div>
      {lightbox}
    </>
  );
}
