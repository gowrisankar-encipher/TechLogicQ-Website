function toSiteUrl(value: string | undefined) {
  const raw = value?.trim().replace(/\/+$/, "");
  if (!raw) return "https://www.techlogicq.com";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

export const siteConfig = {
  name: "TechLogicQ",
  tagline: "Where Technology Meets Logic",
  philosophy: "Learn • Build • Grow",
  message: "Empowering Graduates for the Professional World",
  description:
    "TechLogicQ helps graduates build industry-ready technical skills through practical training, projects, career-focused learning and technology services.",
  // TODO: replace with the production domain once it is live.
  url: toSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  ogImage: "/og-image.jpg",
  contact: {
    email: "techlogicq@gmail.com",
    phone: "+91 63841 22546",
    phoneHref: "tel:+916384122546",
    location: "Chennai, Tamil Nadu",
  },
  // Placeholders: point these at the official TechLogicQ profiles.
  social: [
    { name: "Instagram", href: "https://www.instagram.com/techlogicq?stkn=MWh6Y3Y3M3BpemF4NQ==" },
    { name: "LinkedIn", href: "https://www.linkedin.com/" },
    // { name: "YouTube", href: "https://www.youtube.com/" },
  ],
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Training", href: "/training" },
  { label: "Services", href: "/services" },
  // { label: "Academy", href: "/academy" }, // Academy page hidden for now
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

export function contactHref(subject: string) {
  return `/contact?subject=${encodeURIComponent(subject)}`;
}
