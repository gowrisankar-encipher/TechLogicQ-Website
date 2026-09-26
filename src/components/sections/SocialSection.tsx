import { siteConfig } from "@/lib/site";
import CTASection from "../CTASection";
import SocialIcon from "../SocialIcon";

export default function SocialSection() {
  const [primary, ...others] = siteConfig.social;
  return (
    <CTASection
      title={
        <>
          Build Your Skills.
          <br />
          Create Your <span className="text-accent-400">Future.</span>
        </>
      }
      description="Follow TechLogicQ for technology insights, career opportunities, hands-on learning, projects and industry updates."
      primaryCta={{
        label: "Follow Us",
        href: primary.href,
        external: true,
        icon: <SocialIcon name={primary.name} />,
      }}
    >
      <ul className="mt-6 flex justify-center gap-3" aria-label="More social media">
        {others.map((s) => (
          <li key={s.name}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`TechLogicQ on ${s.name}`}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              <SocialIcon name={s.name} />
            </a>
          </li>
        ))}
      </ul>
    </CTASection>
  );
}
