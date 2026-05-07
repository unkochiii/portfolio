"use server";

/*
  Required environment variables in .env.local:
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_SECURE=false
    SMTP_USER=votre-email@gmail.com
    SMTP_PASS=votre-mot-de-passe-app
    SMTP_TO=anais.picaut@gmail.com
*/

import nodemailer from "nodemailer";

export type ContactState = {
  success?: boolean;
  error?: string;
};

export async function sendContactEmail(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Tous les champs sont requis." };
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return {
      error:
        "Configuration email manquante. Contactez-moi directement par téléphone.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Anaïs" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO ?? "anais.picaut@gmail.com",
      replyTo: `"${name}" <${email}>`,
      subject: `Portfolio — Message de ${name}`,
      text: `Nom : ${name}\nEmail : ${email}\n\n${message}`,
      html: `
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
        <hr/>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("Email error:", err);
    return { error: "Erreur lors de l'envoi. Veuillez réessayer." };
  }
}
