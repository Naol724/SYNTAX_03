import { z } from "zod";

export const insertContactMessageSchema = z
  .object({
    // Canonical fields
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    subject: z.string().min(5).optional(),
    message: z.string().min(10).optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    // Legacy / form field names from ContactClient
    sender_name: z.string().min(2).optional(),
    sender_email: z.string().email().optional(),
    sender_phone: z.string().optional(),
  })
  .transform((data) => {
    const name = (data.name || data.sender_name || "").trim();
    const email = (data.email || data.sender_email || "").trim();
    const subject = (data.subject || "").trim();
    const message = (data.message || "").trim();
    const phone = (data.phone || data.sender_phone || "").trim() || undefined;
    const company = (data.company || "").trim() || undefined;

    return { name, email, subject, message, phone, company };
  })
  .superRefine((data, ctx) => {
    if (data.name.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required", path: ["name"] });
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid email is required", path: ["email"] });
    }
    if (data.subject.length < 5) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Subject is required", path: ["subject"] });
    }
    if (data.message.length < 10) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Message is too short", path: ["message"] });
    }
  });

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
