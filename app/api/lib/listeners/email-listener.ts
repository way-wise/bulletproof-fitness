import { sendVerificationEmail } from "@/lib/email";
import { emailEvents, EmailEventType } from "../events/email_event";

emailEvents.on(EmailEventType.VERIFY_EMAIL, async ({ email, token, url }) => {
  try {
    await sendVerificationEmail(email, token, url);
    console.log("✅ Verification email sent to:", email);
  } catch (err) {
    console.error("❌ Failed to send verification email", err);
    // Optional: push to retry queue, Sentry, or log to DB
  }
});
