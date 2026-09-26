import type { Metadata } from "next";
import { siteConfig } from "./site";

/** Per-page metadata with matching Open Graph / Twitter tags and canonical URL. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: path,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "TechLogicQ – Where Technology Meets Logic" }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [siteConfig.ogImage] },
  };
}
