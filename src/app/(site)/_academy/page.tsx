// Academy page is temporarily disabled.
// Folders starting with "_" are not routed by Next.js, so /academy is not published.
// To bring it back: rename this folder to `academy`, then uncomment the Academy
// entries in src/lib/site.ts (navLinks), src/components/Footer.tsx and src/app/page.tsx.

import CourseCard from "@/components/CourseCard";
import CTASection from "@/components/CTASection";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import LearnBuildGrow from "@/components/sections/LearnBuildGrow";
import { courses } from "@/data/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Academy",
  description:
    "TechLogicQ Academy offers practical, career-focused courses in Java, full stack and web development, SQL, Spring Boot, Generative AI, Git and cloud.",
  path: "/academy",
});

export default function AcademyPage() {
  return (
    <>
      <Hero
        eyebrow="TechLogicQ Academy"
        title="Learn. Practice. Build. Grow."
        description="The Academy provides practical, career-focused learning. Each course combines clear explanations with hands-on practice and projects, so you finish with skills you can show."
        primaryCta={{ label: "Browse Courses", href: "#courses" }}
        secondaryCta={{ label: "Talk to Us", href: "/contact?subject=Academy%20enquiry" }}
      />

      <section id="courses" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Courses"
            title="Choose Your Learning Path"
            description="Course durations and schedules will be announced soon. Get in touch to register your interest."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course, i) => (
              <CourseCard key={course.title} {...course} delay={(i % 4) * 80} />
            ))}
          </div>
        </div>
      </section>

      <LearnBuildGrow />

      <CTASection
        title="Start learning with TechLogicQ"
        description="Have questions about a course or which path suits you? We're happy to help."
        primaryCta={{ label: "Contact Us", href: "/contact?subject=Academy%20enquiry" }}
      />
    </>
  );
}
