"use client";

import { useState } from "react";

type Props = {
  nom: string;
  photoUrl?: string;
  size?: "sm" | "lg";
};

const sizeClasses = {
  sm: { container: "w-20 h-20", text: "text-2xl" },
  lg: { container: "w-24 h-24", text: "text-3xl" },
};

export default function MembrePhoto({ nom, photoUrl, size = "sm" }: Props) {
  const [erreur, setErreur] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const initiales = nom
    .split(" ")
    .map((n) => n[0])
    .join("");

  const s = sizeClasses[size];

  if (!photoUrl || erreur) {
    return (
      <div className={`${s.container} rounded-full bg-bleu-fonce flex items-center justify-center text-blanc font-serif ${s.text} font-bold mx-auto`}>
        {initiales}
      </div>
    );
  }

  return (
    <div className={`${s.container} rounded-full bg-gris-clair flex items-center justify-center mx-auto overflow-hidden`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt=""
        className={`w-full h-full object-cover ${loaded ? "" : "hidden"}`}
        onError={() => setErreur(true)}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <span className={`text-bleu-fonce font-serif ${s.text} font-bold`}>
          {initiales}
        </span>
      )}
    </div>
  );
}
