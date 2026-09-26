import { Eye, Target } from "lucide-react";
import CTASection from "@/components/CTASection";
import FeatureCard from "@/components/FeatureCard";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import LearnBuildGrow from "@/components/sections/LearnBuildGrow";
import { aboutFocus, values } from "@/data/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "TechLogicQ helps graduates bridge the gap between academic education and the professional technology industry through practical skills and real-world experience.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="About TechLogicQ"
        title="Where Technology Meets Logic"
        description="TechLogicQ is focused on helping graduates bridge the gap between academic education and the professional technology industry."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="What We Focus On"
            title="From Classroom to Career"
            description="We are an early-stage technology startup built around a simple idea: graduates learn best by doing. Here is where we put our energy."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aboutFocus.map((item, i) => (
              <FeatureCard key={item.title} {...item} delay={(i % 3) * 100} accent={i % 3 === 1 ? "orange" : "blue"} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <Reveal>
            <article className="h-full rounded-3xl bg-navy-900 p-8 sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-accent-400">
                <Target className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-5 text-2xl font-bold !text-white">Our Mission</h2>
              <p className="mt-3 text-lg leading-relaxed text-white/80">
                To empower graduates with practical technology skills and real-world experience that help them
                confidently enter the professional world.
              </p>
            </article>
          </Reveal>
          <Reveal delay={120}>
            <article className="h-full rounded-3xl border border-brand-100 bg-white p-8 sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Eye className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-5 text-2xl font-bold">Our Vision</h2>
              <p className="mt-3 text-lg leading-relaxed text-muted">
                To create a learning ecosystem where people can{" "}
                <strong className="text-navy-900">Learn, Build and Grow</strong>.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Our Values" title="What We Stand For" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, i) => (
              <FeatureCard key={value.title} {...value} compact delay={(i % 3) * 80} accent="navy" />
            ))}
          </div>
        </div>
      </section>

      <LearnBuildGrow />

      <CTASection
        title="Ready to start your journey?"
        description="Explore our training programmes, or get in touch to learn more about TechLogicQ."
        primaryCta={{ label: "Start Learning", href: "/training" }}
        secondaryCta={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
