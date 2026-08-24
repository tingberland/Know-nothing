import type { Metadata } from "next";
import { getMediaById, getSettings } from "@/lib/database";
import { normalizeSiteSettings, siteFontFaceCss, siteThemeStyle } from "@/lib/site-settings";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata():Promise<Metadata>{const settings=await getSettings();const site=normalizeSiteSettings(settings.site);const card=await getMediaById(site.socialImageMediaId);const base=new URL(process.env.SITE_URL??"https://know-nothing-daily-studio.tingting581190.chatgpt.site");const image=card?.mimeType.startsWith("image/")?new URL(card.url,base).toString():new URL("/og.png",base).toString();return{metadataBase:base,title:{default:`${site.name} — รู้จักโลกเพิ่มขึ้นทุกวัน`,template:`%s — ${site.name}`},description:site.description,icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},openGraph:{type:"website",title:site.name,description:site.description,images:[{url:image,alt:`${site.name} — ${site.description}`}]},twitter:{card:"summary_large_image",title:site.name,description:site.description,images:[image]}}}

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
