import { philosophySteps } from "@/data/content";
import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";

const styles = [
  { card: "bg-brand-50 border-brand-100", icon: "bg-brand-600 text-white", step: "text-brand-600" },
  { card: "bg-navy-900 border-navy-900", icon: "bg-white text-navy-900", step: "text-brand-200" },
  { card: "bg-accent-50 border-accent-400/30", icon: "bg-accent-500 text-white", step: "text-accent-600" },
];

export default function LearnBuildGrow() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Philosophy"
          title="Learn • Build • Grow"
          description="Three simple steps that shape everything we do at TechLogicQ."
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {philosophySteps.map((step, i) => {
            const Icon = step.icon;
            const dark = i === 1;
            return (
              <Reveal as="li" key={step.title} delay={i * 120}>
                <article
                  className={`relative h-full overflow-hidden rounded-3xl border p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${styles[i].card}`}
                >
                  <span className={`text-sm font-bold tracking-widest ${styles[i].step}`}>STEP 0{i + 1}</span>
                  <span className={`mt-5 flex h-14 w-14 items-center justify-center rounded-2xl ${styles[i].icon}`}>
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h3 className={`mt-5 text-2xl font-bold ${dark ? "!text-white" : ""}`}>{step.title.toUpperCase()}</h3>
                  <p className={`mt-2 text-base leading-relaxed ${dark ? "text-white/80" : "text-muted"}`}>
                    {step.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
