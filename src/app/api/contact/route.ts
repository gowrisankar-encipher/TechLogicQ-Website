import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";
import { isMailConfigured, sendContactEmail } from "@/lib/mailer";

/** Receives contact form submissions and emails them to CONTACT_TO_EMAIL (see .env.example). */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { data, errors } = validateContact((body ?? {}) as Record<string, unknown>);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  if (!isMailConfigured()) {
    console.error("[contact] SMTP_USER / SMTP_PASS are not set; message not delivered.", { ...data });
    return NextResponse.json(
      { ok: false, error: "The contact form isn't available right now. Please email or call us instead." },
      { status: 503 },
    );
  }

  try {
    await sendContactEmail(data);
  } catch (error) {
    console.error("[contact] Failed to send email", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your message right now. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
