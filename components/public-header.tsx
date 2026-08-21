import Link from "next/link";
import { getSettings } from "@/lib/database";
import { normalizeSiteSettings, type SiteSettings } from "@/lib/site-settings";

async function resolvedSite(site?:SiteSettings){if(site)return site;const settings=await getSettings();return normalizeSiteSettings(settings.site)}
export async function PublicHeader({site}:{site?:SiteSettings}={}){const current=await resolvedSite(site);return <header className="site-header page-shell"><Link className="wordmark" href="/" aria-label={`${current.name}, home`}><span aria-hidden="true">✦</span> {current.name}</Link><nav aria-label="Main navigation">{current.navigation.map(link=><Link href={link.href} key={`${link.label}-${link.href}`}>{link.label}</Link>)}<Link href="/search">ค้นหา</Link><Link className="nav-pill" href="/admin">Admin ↗</Link></nav></header>}
export async function PublicFooter({site}:{site?:SiteSettings}={}){const current=await resolvedSite(site);return <footer><div className="page-shell footer-inner"><Link className="wordmark" href="/"><span aria-hidden="true">✦</span> {current.name}</Link><span>{current.footer}</span><a href="#top">BACK TO TOP ↑</a></div></footer>}
