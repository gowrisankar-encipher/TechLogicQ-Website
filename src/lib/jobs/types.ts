export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Freelance"] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export type Job = {
  id: string;
  company: string;
  title: string;
  location: string;
  experience: string;
  skills: string[];
  type: EmploymentType;
  /** Where candidates apply: a URL or an email address. Optional. */
  applyLink: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type JobInput = Omit<Job, "id" | "createdAt" | "updatedAt">;
export type JobFieldErrors = Partial<Record<keyof JobInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string) {
  return EMAIL_RE.test(value);
}

/** Validates admin form input for a job opening. */
export function parseJobInput(form: FormData): { data: JobInput; errors: JobFieldErrors } {
  const str = (key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);
  const type = str("type", 20);
  const data: JobInput = {
    company: str("company", 120),
    title: str("title", 150),
    location: str("location", 120),
    experience: str("experience", 60),
    skills: str("skills", 400)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 12),
    type: (EMPLOYMENT_TYPES as readonly string[]).includes(type) ? (type as EmploymentType) : "Full-time",
    applyLink: str("applyLink", 500),
    description: str("description", 2000),
  };

  const errors: JobFieldErrors = {};
  if (data.company.length < 2) errors.company = "Company is required.";
  if (data.title.length < 2) errors.title = "Job title is required.";
  if (data.location.length < 2) errors.location = "Location is required.";
  if (!data.experience) errors.experience = "Experience is required.";
  if (data.skills.length === 0) errors.skills = "Add at least one skill.";
  if (data.applyLink && !isEmail(data.applyLink)) {
    try {
      const url = new URL(data.applyLink);
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    } catch {
      errors.applyLink = "Enter a full link (https://…) or an email address.";
    }
  }
  return { data, errors };
}
