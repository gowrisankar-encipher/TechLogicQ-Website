import { whyPoints } from "@/data/content";
import FeatureCard from "../FeatureCard";
import SectionHeader from "../SectionHeader";

export default function WhyTechLogicQ() {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why TechLogicQ"
          title="Why Learn With TechLogicQ?"
          description="A practical, career-focused way to build your technology skills."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyPoints.map((point, i) => (
            <FeatureCard key={point.title} {...point} compact delay={(i % 4) * 80} accent={i % 2 ? "orange" : "blue"} />
          ))}
        </div>
      </div>
    </section>
  );
}
