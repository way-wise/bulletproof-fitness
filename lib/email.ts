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

export async function sendVerificationEmail(
  to: string,
  token: string,
  url: string,
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "Verify Your Email",
    text: `Verify your email address by visiting: ${url} `,
    html: `
      <div style="font-family:sans-serif;">
        <h2>Verify your email</h2>
        <p>Click below to verify your email address. This link will expire in 1 hour.</p>
        <a href="${url}" style="display:inline-block;margin-top:10px;padding:10px 15px;background:#0070f3;color:white;text-decoration:none;border-radius:5px;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p>${url}</p>
        <hr />
        <small>If you didn't request this, you can safely ignore this email.</small>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  token: string,
  url: string,
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "Reset Account Password",
    text: `Reset your password by visiting: ${url} `,
    html: `
      <div style="font-family:sans-serif;">
        <h2>Reset your password</h2>
        <p>Click below to verify your email and reset password. This link will expire in 1 hour.</p>
        <a href="${url}" style="display:inline-block;margin-top:10px;padding:10px 15px;background:#0070f3;color:white;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p>${url}</p>
        <hr />
        <small>If you didn't request this, you can safely ignore this email.</small>
      </div>
    `,
  });
}
