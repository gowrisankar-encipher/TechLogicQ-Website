import CTASection from "@/components/CTASection";
import Hero from "@/components/Hero";
import TechnologyCard from "@/components/TechnologyCard";
import WhyTechLogicQ from "@/components/sections/WhyTechLogicQ";
import { techCategories } from "@/data/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Training & Skills",
  description:
    "Hands-on technical training in Java, Python, JavaScript, Spring Boot, React, Next.js, databases, AWS, Docker and Generative AI at TechLogicQ.",
  path: "/training",
});

export default function TrainingPage() {
  return (
    <>
      <Hero
        eyebrow="Training & Skills"
        title="Build Skills That Matter"
        description="Structured, hands-on training in the languages, frameworks and tools used across the technology industry, from programming fundamentals to modern AI."
        primaryCta={{ label: "Get in Touch", href: "/contact?subject=Training%20enquiry" }}
      />

      <section className="py-16 sm:py-20" aria-label="Technology categories">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {techCategories.map((category, i) => (
            <TechnologyCard key={category.title} {...category} delay={(i % 3) * 100} />
          ))}
        </div>
      </section>

      <WhyTechLogicQ />

      <CTASection
        title="Not sure where to begin?"
        description="Tell us about your background and goals, and we'll help you find a learning path that fits."
        primaryCta={{ label: "Get in Touch", href: "/contact?subject=Training%20enquiry" }}
        secondaryCta={{ label: "View Job Openings", href: "/careers" }}
      />
    </>
  );
}
