import "server-only";
import type { Inquiry } from "@/lib/schema/inquiry";

/**
 * Inquiry email notification via Resend's REST API.
 *
 * Uses a direct fetch (no SDK dependency) so setup stays simple. Configured
 * entirely through environment variables:
 *   RESEND_API_KEY      - your Resend API key (secret, server-only)
 *   INQUIRY_NOTIFY_TO   - the address that receives inquiry notifications
 *   INQUIRY_NOTIFY_FROM - the verified sender (defaults to Resend's test sender)
 *
 * Sending is best-effort: if it fails or isn't configured, it returns false and
 * never throws, so a notification problem can't break the DB save or the
 * customer's confirmation.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendInquiryNotification(
  inquiry: Inquiry,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_NOTIFY_TO;
  const from =
    process.env.INQUIRY_NOTIFY_FROM ?? "onboarding@resend.dev";

  // Not configured -> skip quietly.
  if (!apiKey || !to) return false;

  const subject = `New inquiry from ${inquiry.name}`;
  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; color:#0a0a0a; line-height:1.6;">
      <h2 style="font-family: Georgia, serif; margin:0 0 16px;">New project inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(inquiry.email)}">${escapeHtml(inquiry.email)}</a></p>
      <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone || "Not provided")}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap; padding:12px 16px; background:#f0efec; border-radius:4px;">${escapeHtml(inquiry.message)}</p>
      <p style="color:#6b6b6b; font-size:12px; margin-top:24px;">Received ${new Date(inquiry.createdAt).toLocaleString()}</p>
    </div>
  `;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Portfolio Inquiries <${from}>`,
        to: [to],
        reply_to: inquiry.email,
        subject,
        html,
      }),
    });
    return res.ok;
  } catch {
    // Best-effort: never throw from a notification.
    return false;
  }
}
