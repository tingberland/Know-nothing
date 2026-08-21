import type { Metadata } from "next";
import { getSettings } from "@/lib/database";
import { normalizeSiteSettings, siteFontFaceCss, siteThemeStyle } from "@/lib/site-settings";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://know-nothing-daily.tingting581190.chatgpt.site"),
  title: {
    default: "Know Nothing Daily — รู้จักโลกเพิ่มขึ้นทุกวัน",
    template: "%s — Know Nothing Daily",
  },
  description: "A personal archive of curiosity — บันทึกสิ่งใหม่ที่ได้เรียนรู้ในแต่ละวัน",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    type: "website",
    title: "Know Nothing Daily",
    description: "A personal archive of curiosity — รู้จักโลกเพิ่มขึ้นทุกวัน",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Know Nothing Daily — A personal archive of curiosity" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Know Nothing Daily",
    description: "A personal archive of curiosity — รู้จักโลกเพิ่มขึ้นทุกวัน",
    images: ["/og.png"],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  const site = normalizeSiteSettings(settings.site);
  return (
    <html lang="th">
      <head><style>{siteFontFaceCss(site)}</style></head>
      <body style={siteThemeStyle(site)} data-heading-font={site.design.theme.headingFont} data-body-font={site.design.theme.bodyFont} data-corners={site.design.theme.corners}>{children}</body>
    </html>
  );
}
