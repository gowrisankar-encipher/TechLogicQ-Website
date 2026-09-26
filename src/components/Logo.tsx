import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  tone?: "dark" | "light";
  className?: string;
};

export default function Logo({ tone = "dark", className = "" }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="TechLogicQ home">
      <span className={`flex items-center justify-center ${tone === "light" ? "rounded-xl bg-white p-1.5" : ""}`}>
        <Image src="/logo-mark.png" alt="" width={400} height={273} priority className="h-8 w-auto sm:h-9" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">
        <span className={tone === "light" ? "text-white" : "text-navy-900"}>Tech</span>
        <span className={tone === "light" ? "text-brand-200" : "text-brand-600"}>Logic</span>
        <span className="text-accent-500">Q</span>
      </span>
    </Link>
  );
}
