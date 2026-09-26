import { BriefcaseBusiness } from "lucide-react";
import ButtonLink from "@/components/ButtonLink";
import Hero from "@/components/Hero";
import JobCard from "@/components/JobCard";
import { jobStore } from "@/lib/jobs/store";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Job Openings",
  description: "Current job openings, internships and fresher opportunities shared by TechLogicQ.",
  path: "/careers",
});

// Openings are managed from /admin, so always read the latest list.
export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const jobs = await jobStore.list().catch((error) => {
    console.error("[careers] Could not load job openings", error);
    return [];
  });

  return (
    <>
      <Hero
        eyebrow="Job Openings"
        title="Your Skills. Your Opportunity."
        description="Current job openings, internships and fresher opportunities. TechLogicQ shares openings to help you find your next role, but does not guarantee placement or employment."
      />

      <section id="openings" className="scroll-mt-24 pb-20 pt-4 sm:pt-8" aria-label="Job openings">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {jobs.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-navy-900/20 bg-white p-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <BriefcaseBusiness className="h-7 w-7" aria-hidden />
              </span>
              <h2 className="mt-5 text-xl font-bold">No openings right now</h2>
              <p className="mt-2 text-muted">New opportunities will be posted here. Please check back soon.</p>
              <ButtonLink href="/contact?subject=Job%20updates" variant="secondary" className="mt-6">
                Contact Us
              </ButtonLink>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted">
                {jobs.length} {jobs.length === 1 ? "opening" : "openings"}
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job, i) => (
                  <JobCard key={job.id} job={job} delay={(i % 3) * 80} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
