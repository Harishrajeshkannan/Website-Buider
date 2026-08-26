import { z } from "zod";
import { isValidEmail } from "./validators";

/**
 * Contact-form inquiry schema (Task 2.8; Req 15.2, 15.3, 15.6).
 */
export const InquiryInput = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z
    .string()
    .min(1, "Email is required")
    .max(254)
    .refine(isValidEmail, "Enter a valid email address"), // Req 15.6
  // Country code (e.g. +91) prefixed to the digits, stored as one string.
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(40)
    .refine(
      (v) => /^\+\d{1,4}\s?\d{4,15}$/.test(v.trim()),
      "Enter a valid phone number with country code",
    ),
  message: z.string().min(1, "Message is required").max(2000),
});
export type InquiryInput = z.infer<typeof InquiryInput>;

export const Inquiry = InquiryInput.extend({
  id: z.string().uuid(),
  createdAt: z.string(),
});
export type Inquiry = z.infer<typeof Inquiry>;
