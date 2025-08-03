import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: parseInt(process.env.SMTP_PORT!),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const link = `${process.env.APP_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "Verify Your Email",
    text: `Verify your email address by visiting: ${link}`,
    html: `
      <div style="font-family:sans-serif;">
        <h2>Verify your email</h2>
        <p>Click below to verify your email address. This link will expire in 1 hour.</p>
        <a href="${link}" style="display:inline-block;margin-top:10px;padding:10px 15px;background:#0070f3;color:white;text-decoration:none;border-radius:5px;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p>${link}</p>
        <hr />
        <small>If you didn't request this, you can safely ignore this email.</small>
      </div>
    `,
  });
}
