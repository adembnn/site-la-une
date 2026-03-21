"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm({ variant }: { variant: "page" | "banner" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Inscription confirmée ! Bienvenue.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion. Réessayez plus tard.");
    }
  }

  if (variant === "banner") {
    return (
      <div>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            disabled={status === "loading"}
            className="flex-1 px-5 py-4 rounded-xl bg-blanc/10 backdrop-blur-sm border border-blanc/20 text-blanc placeholder:text-blanc/40 focus:outline-none focus:ring-2 focus:ring-dore focus:bg-blanc/15 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-dore text-bleu-fonce font-semibold px-8 py-4 rounded-xl hover:bg-blanc hover:shadow-xl hover:shadow-dore/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Inscription..." : "S\u2019inscrire"}
          </button>
        </form>
        {message && (
          <p className={`mt-3 text-sm ${status === "success" ? "text-green-300" : "text-red-300"}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          disabled={status === "loading"}
          className="px-4 py-3 rounded-lg border border-gris/20 focus:outline-none focus:ring-2 focus:ring-bleu text-center disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-dore text-bleu-fonce font-semibold px-6 py-3 rounded-lg hover:bg-dore-clair transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Inscription..." : "S\u2019inscrire à la newsletter"}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm ${status === "success" ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
