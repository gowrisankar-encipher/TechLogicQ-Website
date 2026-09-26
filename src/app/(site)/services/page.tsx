import CTASection from "@/components/CTASection";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/data/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Web Development Services",
  description:
    "Business websites, portfolios, landing pages, web applications, e-commerce, REST APIs, maintenance and custom software from TechLogicQ.",
  path: "/services",
});

const process = [
  { step: "01", title: "Discover", description: "We learn about your goals, audience and requirements." },
  { step: "02", title: "Design & Build", description: "We design and develop a responsive, modern solution." },
  { step: "03", title: "Launch & Support", description: "We launch your project and help keep it up to date." },
];

export default function ServicesPage() {
  return (
    <>
      <Hero
        eyebrow="Web Development Services"
        title="Build Your Digital Presence"
        description="Modern, responsive and scalable websites and web applications for businesses, startups and professionals."
        primaryCta={{ label: "Start a Project", href: "/contact?subject=New%20web%20project" }}
        secondaryCta={{ label: "View Services", href: "#services" }}
      />

      <section id="services" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="What We Build"
            title="Services for Your Business"
            description="From a single landing page to a custom web application."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <ServiceCard key={service.title} {...service} delay={(i % 4) * 80} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="How We Work" title="A Simple, Transparent Process" />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {process.map((item) => (
              <li key={item.step} className="rounded-2xl border border-navy-900/8 bg-white p-7">
                <span className="font-display text-3xl font-extrabold text-accent-500">{item.step}</span>
                <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection
        title="Have a project in mind? Let's build it together."
        description="Share a few details about what you need and we'll get back to you."
        primaryCta={{ label: "Start a Project", href: "/contact?subject=New%20web%20project" }}
      />
    </>
  );
}
