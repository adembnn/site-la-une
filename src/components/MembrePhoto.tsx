"use client";

import { useState } from "react";

type Props = {
  nom: string;
  photoUrl?: string;
};

export default function MembrePhoto({ nom, photoUrl }: Props) {
  const [erreur, setErreur] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const initiales = nom
    .split(" ")
    .map((n) => n[0])
    .join("");

  if (!photoUrl || erreur) {
    return (
      <div className="w-20 h-20 rounded-full bg-bleu-fonce flex items-center justify-center text-blanc font-serif text-2xl font-bold mx-auto">
        {initiales}
      </div>
    );
  }

  return (
    <div className="w-20 h-20 rounded-full bg-gris-clair flex items-center justify-center mx-auto overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt=""
        className={`w-full h-full object-cover ${loaded ? "" : "hidden"}`}
        onError={() => setErreur(true)}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <span className="text-bleu-fonce font-serif text-2xl font-bold">
          {initiales}
        </span>
      )}
    </div>
  );
}
