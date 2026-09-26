import type { MetadataRoute } from "next";
import { navLinks, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return navLinks.map((link) => ({
    url: new URL(link.href, siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency: link.href === "/careers" ? "weekly" : "monthly",
    priority: link.href === "/" ? 1 : 0.8,
  }));
}
