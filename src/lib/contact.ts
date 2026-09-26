export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-\s\d]{7,20}$/;

/** Shared validation for the contact form (client) and the contact API route (server). */
export function validateContact(input: Partial<Record<keyof ContactPayload, unknown>>): {
  data: ContactPayload;
  errors: ContactErrors;
} {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const data: ContactPayload = {
    name: str(input.name).slice(0, 100),
    email: str(input.email).slice(0, 200),
    phone: str(input.phone).slice(0, 20),
    subject: str(input.subject).slice(0, 150),
    message: str(input.message).slice(0, 5000),
  };

  const errors: ContactErrors = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address.";
  if (data.phone && !PHONE_RE.test(data.phone)) errors.phone = "Please enter a valid phone number.";
  if (data.subject.length < 3) errors.subject = "Please add a subject.";
  if (data.message.length < 10) errors.message = "Please write a message of at least 10 characters.";

  return { data, errors };
}
