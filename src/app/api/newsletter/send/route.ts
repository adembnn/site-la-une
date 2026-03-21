import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { toHTML } from "@portabletext/to-html";
import mailchimp from "@mailchimp/mailchimp_marketing";
import { projectId, dataset, apiVersion } from "@/sanity/env";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const SANITY_WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN;

if (MAILCHIMP_API_KEY && MAILCHIMP_SERVER_PREFIX) {
  mailchimp.setConfig({ apiKey: MAILCHIMP_API_KEY, server: MAILCHIMP_SERVER_PREFIX });
}

// Client Sanity avec token d'écriture pour mettre à jour le document
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: SANITY_WRITE_TOKEN,
});

export async function POST(request: Request) {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_SERVER_PREFIX) {
    return NextResponse.json({ error: "Configuration Mailchimp manquante." }, { status: 500 });
  }

  if (!SANITY_WRITE_TOKEN) {
    return NextResponse.json({ error: "Token Sanity manquant." }, { status: 500 });
  }

  try {
    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json({ error: "ID du document manquant." }, { status: 400 });
    }

    // Récupérer la newsletter depuis Sanity
    const newsletter = await writeClient.fetch(
      `*[_type == "newsletter" && _id == $id][0]{ objet, contenu, envoye }`,
      { id: documentId },
    );

    if (!newsletter) {
      return NextResponse.json({ error: "Newsletter introuvable." }, { status: 404 });
    }

    if (newsletter.envoye) {
      return NextResponse.json({ error: "Cette newsletter a déjà été envoyée." }, { status: 409 });
    }

    if (!newsletter.contenu || !newsletter.objet) {
      return NextResponse.json({ error: "L'objet et le contenu sont requis." }, { status: 400 });
    }

    // Convertir Portable Text en HTML
    const contentHtml = toHTML(newsletter.contenu);

    // Template HTML de l'email
    const emailHtml = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-top:4px solid #D4A843;">
    <div style="padding:30px 40px;text-align:center;background:#003366;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:bold;">La UN'e</h1>
      <p style="margin:5px 0 0;color:#D4A843;font-size:12px;font-style:italic;">par UN'ESSEC</p>
    </div>
    <div style="padding:30px 40px;color:#333333;font-size:16px;line-height:1.7;">
      ${contentHtml}
    </div>
    <div style="padding:20px 40px;text-align:center;border-top:1px solid #eee;color:#999;font-size:12px;">
      <p>La UN'e — UN'ESSEC, ESSEC Business School</p>
      <p><a href="*|UNSUB|*" style="color:#009EDB;">Se désinscrire</a></p>
    </div>
  </div>
</body>
</html>`;

    // Créer la campagne Mailchimp
    const campaign = await mailchimp.campaigns.create({
      type: "regular",
      recipients: { list_id: MAILCHIMP_AUDIENCE_ID },
      settings: {
        subject_line: newsletter.objet,
        from_name: "La UN'e par UN'ESSEC",
        reply_to: "launessec@gmail.com",
      },
    });

    const campaignId = (campaign as { id: string }).id;

    // Ajouter le contenu HTML à la campagne
    await mailchimp.campaigns.setContent(campaignId, {
      html: emailHtml,
    });

    // Envoyer la campagne
    await mailchimp.campaigns.send(campaignId);

    // Marquer comme envoyée dans Sanity
    await writeClient
      .patch(documentId)
      .set({ envoye: true, dateEnvoi: new Date().toISOString() })
      .commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur envoi newsletter:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi. Vérifiez la configuration Mailchimp." },
      { status: 500 },
    );
  }
}
