import { Mail, MapPin, Phone } from "lucide-react";
import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import SocialIcon from "@/components/SocialIcon";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with TechLogicQ about training, academy courses, web development services or career opportunities.",
  path: "/contact",
});

const details = [
  { icon: Mail, label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  { icon: Phone, label: "Phone", value: siteConfig.contact.phone, href: siteConfig.contact.phoneHref },
  { icon: MapPin, label: "Location", value: siteConfig.contact.location, href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <Hero
        eyebrow="Contact Us"
        title="Let's Talk"
        description="Questions about training, courses, a web project or career opportunities? Send us a message and we'll get back to you."
      />

      <section className="pb-20 pt-4 sm:pt-8">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-8">
          <Reveal as="aside" className="space-y-4">
            <div className="rounded-3xl bg-navy-900 p-7 text-white sm:p-8">
              <h2 className="text-xl font-bold !text-white">Contact Information</h2>
              <ul className="mt-6 space-y-5">
                {details.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-400">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm text-white/60">{label}</p>
                      {href ? (
                        <a href={href} className="font-medium break-all hover:text-accent-400">
                          {value}
                        </a>
                      ) : (
                        <p className="font-medium">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider !text-white/70">Social Media</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {siteConfig.social.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-medium transition hover:bg-accent-500"
                    >
                      <SocialIcon name={s.name} className="h-4 w-4" />
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100} className="rounded-3xl border border-navy-900/8 bg-white p-6 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold">Send Us a Message</h2>
            <p className="mt-2 text-muted">Fill in the form and we&apos;ll get back to you.</p>
            <div className="mt-8">
              <Suspense fallback={<div className="h-96" aria-hidden />}>
                <ContactForm />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
