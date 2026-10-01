import type { Metadata, Viewport } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import { siteConfig } from "@/config/site";
import { SiteProvider } from "@/components/SiteProvider";
import "./globals.css";

const display = Libre_Baskerville({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const ogImageUrl = new URL(siteConfig.ogImage, siteConfig.url).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "new home builder",
    "custom home plans",
    "Pennsylvania home builder",
    "Southern New York home builder",
    "North Carolina Triad home builder",
    "new home construction",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    locale: "en_US",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Beautiful, high-quality new homes in Pennsylvania, Southern New York and the NC Triad. Explore home plans and schedule a consultation.",
    images: [
      {
        url: ogImageUrl,
        secureUrl: ogImageUrl,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Fine Line Homes — Your Dream Home, Built the Right Way",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: "New homes in Pennsylvania, Southern New York and the NC Triad. Explore plans and schedule a consultation.",
    images: [{ url: ogImageUrl, alt: "Fine Line Homes — Your Dream Home, Built the Right Way" }],
  },
  formatDetection: { telephone: false },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#211f1d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: siteConfig.name,
  url: siteConfig.url,
  image: ogImageUrl,
  description: siteConfig.description,
  areaServed: [
    { "@type": "State", name: "Pennsylvania" },
    { "@type": "AdministrativeArea", name: "Southern New York" },
    { "@type": "AdministrativeArea", name: "Piedmont Triad, North Carolina" },
  ],
  ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
  ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a
          href="#main"
          className="sr-only z-[60] rounded bg-white px-4 py-2 font-semibold text-charcoal focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
