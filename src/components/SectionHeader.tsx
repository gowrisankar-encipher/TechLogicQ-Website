import Reveal from "./Reveal";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  as: Heading = "h2",
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <Reveal className={`max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p
          className={`text-sm font-semibold uppercase tracking-[0.18em] ${
            tone === "light" ? "text-accent-400" : "text-accent-600"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={`mt-3 text-3xl font-bold leading-tight sm:text-4xl ${tone === "light" ? "!text-white" : ""}`}
      >
        {title}
      </Heading>
      {description && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${tone === "light" ? "text-white/75" : "text-muted"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
