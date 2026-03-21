import { useState } from "react";
import { useDocumentOperation } from "sanity";
import type { DocumentActionComponent } from "sanity";

export const SendNewsletterAction: DocumentActionComponent = (props) => {
  const { id, published } = props;
  const [sending, setSending] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { publish } = useDocumentOperation(id, "newsletter");

  const isAlreadySent = published?.envoye === true;
  const hasContent = published?.objet && published?.contenu;

  return {
    label: sending
      ? "Envoi en cours..."
      : isAlreadySent
        ? "Newsletter envoyée ✓"
        : "Envoyer la newsletter",
    tone: isAlreadySent ? "positive" : "primary",
    disabled: isAlreadySent || sending || !hasContent,
    onHandle: () => {
      setDialogOpen(true);
    },
    dialog: dialogOpen
      ? {
          type: "confirm",
          message: `Envoyer la newsletter "${published?.objet || ""}" à tous les abonnés ? Cette action est irréversible.`,
          onCancel: () => setDialogOpen(false),
          onConfirm: async () => {
            setDialogOpen(false);
            setSending(true);

            try {
              // S'assurer que le document est publié d'abord
              if (props.draft) {
                publish.execute();
                // Attendre un peu que la publication soit effective
                await new Promise((resolve) => setTimeout(resolve, 2000));
              }

              const res = await fetch("/api/newsletter/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ documentId: id }),
              });

              const data = await res.json();

              if (!res.ok) {
                throw new Error(data.error || "Erreur inconnue");
              }

              // Rafraîchir le document pour voir les changements
              window.location.reload();
            } catch (err) {
              setSending(false);
              alert(
                `Erreur lors de l'envoi : ${err instanceof Error ? err.message : "Erreur inconnue"}`,
              );
            }
          },
        }
      : null,
  };
};
