import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import RevealObserver from "@/components/RevealObserver";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.message}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "TechLogicQ",
    "technical training",
    "graduate training",
    "web development services",
    "Java training",
    "full stack development",
    "career-focused learning",
    "job updates",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.message}`,
    description: siteConfig.description,
    url: "/",
    locale: "en_US",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "TechLogicQ – Where Technology Meets Logic" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.message}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a1f4d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
