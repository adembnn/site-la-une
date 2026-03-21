import { NextResponse } from "next/server";
import mailchimp from "@mailchimp/mailchimp_marketing";

const API_KEY = process.env.MAILCHIMP_API_KEY;
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

if (API_KEY && SERVER_PREFIX) {
  mailchimp.setConfig({ apiKey: API_KEY, server: SERVER_PREFIX });
}

export async function POST(request: Request) {
  if (!API_KEY || !AUDIENCE_ID || !SERVER_PREFIX) {
    return NextResponse.json(
      { error: "Configuration newsletter manquante." },
      { status: 500 },
    );
  }

  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 },
      );
    }

    await mailchimp.lists.addListMember(AUDIENCE_ID, {
      email_address: email,
      status: "subscribed" as const,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const error = err as { response?: { body?: { title?: string } } };
    if (error.response?.body?.title === "Member Exists") {
      return NextResponse.json(
        { error: "Cette adresse est déjà inscrite." },
        { status: 409 },
      );
    }

    console.error("Erreur Mailchimp:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription. Réessayez plus tard." },
      { status: 500 },
    );
  }
}
