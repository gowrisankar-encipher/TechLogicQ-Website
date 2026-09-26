import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site";
import Logo from "./Logo";
import SocialIcon from "./SocialIcon";

const offerings = [
  { label: "Technical Training", href: "/training" },
  { label: "Web Development", href: "/services" },
  // { label: "Academy Courses", href: "/academy" }, // Academy page hidden for now
  { label: "Job Openings", href: "/careers" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/75">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            {siteConfig.tagline}. Helping graduates learn, build and grow into the professional world.
          </p>
          <p className="mt-4 text-sm font-semibold tracking-wide text-white">
            Learn <span className="text-accent-500">•</span> Build <span className="text-accent-500">•</span> Grow
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">What We Do</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {offerings.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Get in Touch</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" aria-hidden />
              <a href={`mailto:${siteConfig.contact.email}`} className="break-all transition-colors hover:text-white">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" aria-hidden />
              <a href={siteConfig.contact.phoneHref} className="transition-colors hover:text-white">
                {siteConfig.contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" aria-hidden />
              <span>{siteConfig.contact.location}</span>
            </li>
          </ul>
          <ul className="mt-5 flex gap-2" aria-label="Social media">
            {siteConfig.social.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`TechLogicQ on ${s.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-accent-500"
                >
                  <SocialIcon name={s.name} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} TechLogicQ. All rights reserved.</p>
          <p>#TechLogicQ · #TechTraining · #WebDevelopment · #CareerGrowth</p>
        </div>
      </div>
    </footer>
  );
}
