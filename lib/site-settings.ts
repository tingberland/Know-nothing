export type CoreSectionId = "hero" | "manifesto" | "archive";
export type CustomSection = {
  id: string;
  enabled: boolean;
  eyebrow: string;
  title: string;
  body: string;
  tone: "paper" | "ink" | "accent";
};
export type SiteDesign = {
  theme: {
    paper: string;
    ink: string;
    coral: string;
    acid: string;
    blue: string;
    headingFont: "editorial" | "modern" | "humanist";
    bodyFont: "sans" | "serif";
    density: "airy" | "balanced" | "compact";
    corners: "sharp" | "soft";
  };
  sectionOrder: string[];
  visibility: Record<CoreSectionId, boolean>;
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
    deck: string;
    promptLabel: string;
    prompt: string;
    promptLink: string;
  };
  manifesto: {
    eyebrow: string;
    title: string;
    accent: string;
    lead: string;
    body: string;
  };
  archive: {
    eyebrow: string;
    title: string;
    searchPlaceholder: string;
    showCategories: boolean;
    layout: "list" | "grid";
    limit: number;
  };
  customSections: CustomSection[];
};

export type SiteSettings = {
  name: string;
  description: string;
  footer: string;
  logoMediaId: number | null;
  faviconMediaId: number | null;
  socialImageMediaId: number | null;
  analytics: string;
  navigation: Array<{ label: string; href: string }>;
  socialLinks: Array<{ label: string; href: string }>;
  design: SiteDesign;
};

export const defaultSiteDesign: SiteDesign = {
  theme: {
    paper: "#f4f0e7", ink: "#14213d", coral: "#f06f5f", acid: "#d9ff4f", blue: "#6c77e8",
    headingFont: "editorial", bodyFont: "sans", density: "airy", corners: "sharp",
  },
  sectionOrder: ["hero", "manifesto", "archive"],
  visibility: { hero: true, manifesto: true, archive: true },
  hero: {
    eyebrow: "A PERSONAL ARCHIVE OF CURIOSITY · EST. 2026",
    titleBefore: "รู้จักโลก", titleAccent: "เพิ่มขึ้น", titleAfter: "ทุกวัน",
    deck: "เปลี่ยนความสงสัยเล็ก ๆ ให้กลายเป็นบันทึกที่ค้นเจอได้เสมอ—หนึ่งคำถาม หนึ่งการค้นพบ ในแต่ละวัน",
    promptLabel: "TODAY’S PROMPT · วันนี้",
    prompt: "มีเรื่องอะไรที่คุณเคยเห็นผ่านตา แต่ยังไม่เคยหยุดถามว่า “ทำไม?”",
    promptLink: "เริ่มจากคลังความรู้ ↓",
  },
  manifesto: {
    eyebrow: "01 / THE PHILOSOPHY", title: "Curiosity makes the world", accent: "wider.",
    lead: "ความรู้ไม่จำเป็นต้องยิ่งใหญ่ แค่ทำให้โลกของเรากว้างขึ้นวันละนิดก็พอ",
    body: "ที่นี่ไม่ใช่สารานุกรม แต่เป็นร่องรอยของคำถาม ความบังเอิญ และช่วงเวลาที่ทำให้เราเข้าใจบางอย่างมากขึ้น",
  },
  archive: {
    eyebrow: "02 / THE ARCHIVE", title: "Latest discoveries.", searchPlaceholder: "ค้นหาสิ่งที่เคยสงสัย...",
    showCategories: true, layout: "list", limit: 24,
  },
  customSections: [],
};

const defaultSite: SiteSettings = {
  name: "Know Nothing Daily",
  description: "A personal archive of curiosity",
  footer: "ONE NEW THING · EVERY DAY",
  logoMediaId: null, faviconMediaId: null, socialImageMediaId: null, analytics: "",
  navigation: [{ label: "แนวคิด", href: "/#manifesto" }, { label: "คลังความรู้", href: "/#archive" }],
  socialLinks: [], design: defaultSiteDesign,
};

const text = (value: unknown, fallback: string, max = 1200) => {
  const cleaned = String(value ?? "").replace(/[<>]/g, "").trim().slice(0, max);
  return cleaned || fallback;
};
const hex = (value: unknown, fallback: string) => /^#[0-9a-f]{6}$/i.test(String(value)) ? String(value) : fallback;
const id = (value: unknown) => { const n = Number(value); return Number.isInteger(n) && n > 0 ? n : null; };
const choice = <T extends string>(value: unknown, options: readonly T[], fallback: T) => options.includes(value as T) ? value as T : fallback;

export function normalizeSiteSettings(value: unknown): SiteSettings {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const designRaw = raw.design && typeof raw.design === "object" ? raw.design as Record<string, unknown> : {};
  const themeRaw = designRaw.theme && typeof designRaw.theme === "object" ? designRaw.theme as Record<string, unknown> : {};
  const heroRaw = designRaw.hero && typeof designRaw.hero === "object" ? designRaw.hero as Record<string, unknown> : {};
  const manifestoRaw = designRaw.manifesto && typeof designRaw.manifesto === "object" ? designRaw.manifesto as Record<string, unknown> : {};
  const archiveRaw = designRaw.archive && typeof designRaw.archive === "object" ? designRaw.archive as Record<string, unknown> : {};
  const visibilityRaw = designRaw.visibility && typeof designRaw.visibility === "object" ? designRaw.visibility as Record<string, unknown> : {};
  const customSections = Array.isArray(designRaw.customSections) ? designRaw.customSections.slice(0, 8).map((section, index) => {
    const item = section && typeof section === "object" ? section as Record<string, unknown> : {};
    return {
      id: text(item.id, `section-${index + 1}`, 60).replace(/[^a-z0-9-]/gi, "-"),
      enabled: item.enabled !== false,
      eyebrow: text(item.eyebrow, "CUSTOM SECTION", 100), title: text(item.title, "A new section", 180),
      body: text(item.body, "Add your story here.", 3000),
      tone: choice(item.tone, ["paper", "ink", "accent"] as const, "paper"),
    } satisfies CustomSection;
  }) : [];
  const customIds = new Set(customSections.map(section => `custom:${section.id}`));
  const requestedOrder = Array.isArray(designRaw.sectionOrder) ? designRaw.sectionOrder.map(String) : [];
  const allowed = new Set(["hero", "manifesto", "archive", ...customIds]);
  const sectionOrder = [...new Set(requestedOrder.filter(section => allowed.has(section)))];
  for (const section of ["hero", "manifesto", "archive", ...customIds]) if (!sectionOrder.includes(section)) sectionOrder.push(section);
  const limit = Math.max(3, Math.min(60, Number(archiveRaw.limit) || defaultSiteDesign.archive.limit));
  return {
    name: text(raw.name, defaultSite.name, 100), description: text(raw.description, defaultSite.description, 300),
    footer: text(raw.footer, defaultSite.footer, 200), logoMediaId: id(raw.logoMediaId), faviconMediaId: id(raw.faviconMediaId),
    socialImageMediaId: id(raw.socialImageMediaId), analytics: text(raw.analytics, "", 500),
    navigation: Array.isArray(raw.navigation) ? raw.navigation.slice(0, 8).map((link, index) => { const item = link && typeof link === "object" ? link as Record<string, unknown> : {}; return { label: text(item.label, `Link ${index + 1}`, 50), href: text(item.href, "/", 300) }; }) : defaultSite.navigation,
    socialLinks: Array.isArray(raw.socialLinks) ? raw.socialLinks.slice(0, 8).map((link, index) => { const item = link && typeof link === "object" ? link as Record<string, unknown> : {}; return { label: text(item.label, `Social ${index + 1}`, 50), href: text(item.href, "#", 300) }; }) : [],
    design: {
      theme: {
        paper: hex(themeRaw.paper, defaultSiteDesign.theme.paper), ink: hex(themeRaw.ink, defaultSiteDesign.theme.ink),
        coral: hex(themeRaw.coral, defaultSiteDesign.theme.coral), acid: hex(themeRaw.acid, defaultSiteDesign.theme.acid), blue: hex(themeRaw.blue, defaultSiteDesign.theme.blue),
        headingFont: choice(themeRaw.headingFont, ["editorial", "modern", "humanist"] as const, "editorial"),
        bodyFont: choice(themeRaw.bodyFont, ["sans", "serif"] as const, "sans"), density: choice(themeRaw.density, ["airy", "balanced", "compact"] as const, "airy"),
        corners: choice(themeRaw.corners, ["sharp", "soft"] as const, "sharp"),
      },
      sectionOrder, visibility: { hero: visibilityRaw.hero !== false, manifesto: visibilityRaw.manifesto !== false, archive: visibilityRaw.archive !== false },
      hero: {
        eyebrow: text(heroRaw.eyebrow, defaultSiteDesign.hero.eyebrow, 140), titleBefore: text(heroRaw.titleBefore, defaultSiteDesign.hero.titleBefore, 100),
        titleAccent: text(heroRaw.titleAccent, defaultSiteDesign.hero.titleAccent, 100), titleAfter: text(heroRaw.titleAfter, defaultSiteDesign.hero.titleAfter, 100),
        deck: text(heroRaw.deck, defaultSiteDesign.hero.deck, 700), promptLabel: text(heroRaw.promptLabel, defaultSiteDesign.hero.promptLabel, 100),
        prompt: text(heroRaw.prompt, defaultSiteDesign.hero.prompt, 600), promptLink: text(heroRaw.promptLink, defaultSiteDesign.hero.promptLink, 100),
      },
      manifesto: {
        eyebrow: text(manifestoRaw.eyebrow, defaultSiteDesign.manifesto.eyebrow, 100), title: text(manifestoRaw.title, defaultSiteDesign.manifesto.title, 240),
        accent: text(manifestoRaw.accent, defaultSiteDesign.manifesto.accent, 100), lead: text(manifestoRaw.lead, defaultSiteDesign.manifesto.lead, 800),
        body: text(manifestoRaw.body, defaultSiteDesign.manifesto.body, 1200),
      },
      archive: {
        eyebrow: text(archiveRaw.eyebrow, defaultSiteDesign.archive.eyebrow, 100), title: text(archiveRaw.title, defaultSiteDesign.archive.title, 180),
        searchPlaceholder: text(archiveRaw.searchPlaceholder, defaultSiteDesign.archive.searchPlaceholder, 180), showCategories: archiveRaw.showCategories !== false,
        layout: choice(archiveRaw.layout, ["list", "grid"] as const, "list"), limit,
      }, customSections,
    },
  };
}

export function siteThemeStyle(settings: SiteSettings) {
  const fonts = {
    editorial: 'Georgia, "Times New Roman", serif', modern: 'Arial, Helvetica, sans-serif', humanist: 'Trebuchet MS, Arial, sans-serif',
  };
  return {
    "--paper": settings.design.theme.paper, "--ink": settings.design.theme.ink, "--coral": settings.design.theme.coral,
    "--acid": settings.design.theme.acid, "--blue": settings.design.theme.blue,
    "--font-heading": fonts[settings.design.theme.headingFont],
    "--font-body": settings.design.theme.bodyFont === "serif" ? 'Georgia, "Times New Roman", serif' : 'Arial, Helvetica, sans-serif',
    "--section-space": settings.design.theme.density === "compact" ? "70px" : settings.design.theme.density === "balanced" ? "90px" : "110px",
    "--corner": settings.design.theme.corners === "soft" ? "18px" : "0px",
  } as CSSProperties;
}
import type { CSSProperties } from "react";
