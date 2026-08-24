import type { CSSProperties } from "react";

export type FontAsset = { name: string; url: string; format: "woff" | "woff2" };
export type SocialLink = {
  platform: "instagram" | "youtube" | "tiktok" | "facebook" | "x" | "linkedin" | "other";
  label: string;
  href: string;
  placement: "header" | "footer" | "both";
};
export type CoreSectionId = "hero" | "manifesto" | "archive";
export type BackgroundSlot = { mediaId: number | null; position: "center" | "top" | "bottom"; overlay: number };
export type TextStyle = "normal" | "italic" | "uppercase";
export type TextFont = "theme" | "editorial" | "modern" | "humanist";
export type SectionTypography = {
  titleSize: number;
  bodySize: number;
  titleColor: string;
  bodyColor: string;
  titleStyle: TextStyle;
  titleFont: TextFont;
  bodyFont: "theme" | "serif" | "sans" | "humanist";
};
export type ContentTypography = SectionTypography;
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
    headingFont: "editorial" | "modern" | "humanist" | "custom";
    bodyFont: "sans" | "serif" | "custom";
    headingFontAsset: FontAsset | null;
    bodyFontAsset: FontAsset | null;
    density: "airy" | "balanced" | "compact";
    corners: "sharp" | "soft";
  };
  sectionOrder: string[];
  visibility: Record<CoreSectionId, boolean>;
  backgrounds: Record<CoreSectionId, BackgroundSlot>;
  typography: {
    sections: Record<CoreSectionId, SectionTypography>;
    content: ContentTypography;
  };
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
  socialLinks: SocialLink[];
  design: SiteDesign;
};

export const defaultSiteDesign: SiteDesign = {
  theme: {
    paper: "#f4f0e7", ink: "#14213d", coral: "#f06f5f", acid: "#d9ff4f", blue: "#6c77e8",
    headingFont: "editorial", bodyFont: "sans", headingFontAsset: null, bodyFontAsset: null, density: "airy", corners: "sharp",
  },
  sectionOrder: ["hero", "manifesto", "archive"],
  visibility: { hero: true, manifesto: true, archive: true },
  backgrounds: {
    hero: { mediaId: null, position: "center", overlay: 18 },
    manifesto: { mediaId: null, position: "center", overlay: 42 },
    archive: { mediaId: null, position: "center", overlay: 18 },
  },
  typography: {
    sections: {
      hero: { titleSize: 100, bodySize: 100, titleColor: "", bodyColor: "", titleStyle: "normal", titleFont: "theme", bodyFont: "theme" },
      manifesto: { titleSize: 100, bodySize: 100, titleColor: "", bodyColor: "", titleStyle: "normal", titleFont: "theme", bodyFont: "theme" },
      archive: { titleSize: 100, bodySize: 100, titleColor: "", bodyColor: "", titleStyle: "normal", titleFont: "theme", bodyFont: "theme" },
    },
    content: { titleSize: 100, bodySize: 100, titleColor: "", bodyColor: "", titleStyle: "normal", titleFont: "theme", bodyFont: "theme" },
  },
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
const optionalHex = (value: unknown) => /^#[0-9a-f]{6}$/i.test(String(value)) ? String(value) : "";
const id = (value: unknown) => { const n = Number(value); return Number.isInteger(n) && n > 0 ? n : null; };
const choice = <T extends string>(value: unknown, options: readonly T[], fallback: T) => options.includes(value as T) ? value as T : fallback;
const externalUrl = (value: unknown) => { try { const url = new URL(String(value)); return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : ""; } catch { return ""; } };
const navigationHref = (value: unknown) => { const href=String(value??"").trim().slice(0,300);if(!href)return "/";if(href.startsWith("/#")||href.startsWith("/"))return href;if(href.startsWith("#"))return `/${href}`;const external=externalUrl(href);return external||`/${href.replace(/^\/+/,"")}`; };
const fontAsset = (value: unknown): FontAsset | null => {
  if (!value || typeof value !== "object") return null; const raw = value as Record<string, unknown>;
  const url = String(raw.url ?? ""); if (!/^\/media\/[a-zA-Z0-9._%~-]+$/.test(url)) return null;
  const format = choice(raw.format, ["woff", "woff2"] as const, url.toLowerCase().endsWith(".woff2") ? "woff2" : "woff");
  return { name: text(raw.name, "Custom brand font", 120), url, format };
};
const backgroundSlot = (value: unknown, fallback: BackgroundSlot): BackgroundSlot => {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const overlay = Number(raw.overlay);
  return {
    mediaId: id(raw.mediaId),
    position: choice(raw.position, ["center", "top", "bottom"] as const, fallback.position),
    overlay: Number.isFinite(overlay) ? Math.max(0, Math.min(80, overlay)) : fallback.overlay,
  };
};
const scale = (value: unknown, fallback: number, min: number, max: number) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(Math.max(min, Math.min(max, number))) : fallback;
};
const sectionTypography = (value: unknown, fallback: SectionTypography): SectionTypography => {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    titleSize: scale(raw.titleSize, fallback.titleSize, 70, 160), bodySize: scale(raw.bodySize, fallback.bodySize, 75, 150),
    titleColor: optionalHex(raw.titleColor), bodyColor: optionalHex(raw.bodyColor),
    titleStyle: choice(raw.titleStyle, ["normal", "italic", "uppercase"] as const, fallback.titleStyle),
    titleFont: choice(raw.titleFont, ["theme", "editorial", "modern", "humanist"] as const, fallback.titleFont),
    bodyFont: choice(raw.bodyFont, ["theme", "serif", "sans", "humanist"] as const, fallback.bodyFont),
  };
};

export function normalizeSiteSettings(value: unknown): SiteSettings {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const designRaw = raw.design && typeof raw.design === "object" ? raw.design as Record<string, unknown> : {};
  const themeRaw = designRaw.theme && typeof designRaw.theme === "object" ? designRaw.theme as Record<string, unknown> : {};
  const heroRaw = designRaw.hero && typeof designRaw.hero === "object" ? designRaw.hero as Record<string, unknown> : {};
  const manifestoRaw = designRaw.manifesto && typeof designRaw.manifesto === "object" ? designRaw.manifesto as Record<string, unknown> : {};
  const archiveRaw = designRaw.archive && typeof designRaw.archive === "object" ? designRaw.archive as Record<string, unknown> : {};
  const visibilityRaw = designRaw.visibility && typeof designRaw.visibility === "object" ? designRaw.visibility as Record<string, unknown> : {};
  const backgroundsRaw = designRaw.backgrounds && typeof designRaw.backgrounds === "object" ? designRaw.backgrounds as Record<string, unknown> : {};
  const typographyRaw = designRaw.typography && typeof designRaw.typography === "object" ? designRaw.typography as Record<string, unknown> : {};
  const sectionTypographyRaw = typographyRaw.sections && typeof typographyRaw.sections === "object" ? typographyRaw.sections as Record<string, unknown> : {};
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
    navigation: Array.isArray(raw.navigation) ? raw.navigation.slice(0, 8).map((link, index) => { const item = link && typeof link === "object" ? link as Record<string, unknown> : {}; return { label: text(item.label, `Link ${index + 1}`, 50), href: navigationHref(item.href) }; }) : defaultSite.navigation,
    socialLinks: Array.isArray(raw.socialLinks) ? raw.socialLinks.slice(0, 12).map((link, index) => { const item = link && typeof link === "object" ? link as Record<string, unknown> : {}; return {
      platform: choice(item.platform, ["instagram","youtube","tiktok","facebook","x","linkedin","other"] as const, "other"),
      label: text(item.label, `Social ${index + 1}`, 50), href: externalUrl(item.href), placement: choice(item.placement, ["header","footer","both"] as const, "footer"),
    }; }).filter(link=>Boolean(link.href)) : [],
    design: {
      theme: {
        paper: hex(themeRaw.paper, defaultSiteDesign.theme.paper), ink: hex(themeRaw.ink, defaultSiteDesign.theme.ink),
        coral: hex(themeRaw.coral, defaultSiteDesign.theme.coral), acid: hex(themeRaw.acid, defaultSiteDesign.theme.acid), blue: hex(themeRaw.blue, defaultSiteDesign.theme.blue),
        headingFont: choice(themeRaw.headingFont, ["editorial", "modern", "humanist", "custom"] as const, "editorial"),
        bodyFont: choice(themeRaw.bodyFont, ["sans", "serif", "custom"] as const, "sans"),
        headingFontAsset: fontAsset(themeRaw.headingFontAsset), bodyFontAsset: fontAsset(themeRaw.bodyFontAsset),
        density: choice(themeRaw.density, ["airy", "balanced", "compact"] as const, "airy"),
        corners: choice(themeRaw.corners, ["sharp", "soft"] as const, "sharp"),
      },
      sectionOrder, visibility: { hero: visibilityRaw.hero !== false, manifesto: visibilityRaw.manifesto !== false, archive: visibilityRaw.archive !== false },
      backgrounds: {
        hero: backgroundSlot(backgroundsRaw.hero, defaultSiteDesign.backgrounds.hero),
        manifesto: backgroundSlot(backgroundsRaw.manifesto, defaultSiteDesign.backgrounds.manifesto),
        archive: backgroundSlot(backgroundsRaw.archive, defaultSiteDesign.backgrounds.archive),
      },
      typography: {
        sections: {
          hero: sectionTypography(sectionTypographyRaw.hero, defaultSiteDesign.typography.sections.hero),
          manifesto: sectionTypography(sectionTypographyRaw.manifesto, defaultSiteDesign.typography.sections.manifesto),
          archive: sectionTypography(sectionTypographyRaw.archive, defaultSiteDesign.typography.sections.archive),
        },
        content: sectionTypography(typographyRaw.content, defaultSiteDesign.typography.content),
      },
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
    "--font-heading": settings.design.theme.headingFont === "custom" && settings.design.theme.headingFontAsset ? '"KND Custom Heading", Georgia, serif' : fonts[settings.design.theme.headingFont as keyof typeof fonts] ?? fonts.editorial,
    "--font-body": settings.design.theme.bodyFont === "custom" && settings.design.theme.bodyFontAsset ? '"KND Custom Body", Arial, sans-serif' : settings.design.theme.bodyFont === "serif" ? 'Georgia, "Times New Roman", serif' : 'Arial, Helvetica, sans-serif',
    "--section-space": settings.design.theme.density === "compact" ? "70px" : settings.design.theme.density === "balanced" ? "90px" : "110px",
    "--corner": settings.design.theme.corners === "soft" ? "18px" : "0px",
  } as CSSProperties;
}

const typographyFonts = {
  editorial: 'Georgia, "Times New Roman", serif', modern: 'Arial, Helvetica, sans-serif', humanist: '"Trebuchet MS", Arial, sans-serif',
};
const typographyVariables = (value: SectionTypography, prefix: "section" | "content") => ({
  [`--${prefix}-title-scale`]: String(value.titleSize / 100),
  [`--${prefix}-body-scale`]: String(value.bodySize / 100),
  [`--${prefix}-title-font`]: value.titleFont === "theme" ? "var(--font-heading)" : typographyFonts[value.titleFont],
  [`--${prefix}-body-font`]: value.bodyFont === "theme" ? "var(--font-body)" : value.bodyFont === "serif" ? typographyFonts.editorial : value.bodyFont === "humanist" ? typographyFonts.humanist : typographyFonts.modern,
  [`--${prefix}-title-style`]: value.titleStyle === "italic" ? "italic" : "normal",
  [`--${prefix}-title-transform`]: value.titleStyle === "uppercase" ? "uppercase" : "none",
  ...(value.titleColor ? { [`--${prefix}-title-color`]: value.titleColor } : {}),
  ...(value.bodyColor ? { [`--${prefix}-body-color`]: value.bodyColor } : {}),
});

export function sectionTypographyStyle(settings: SiteSettings, section: CoreSectionId) {
  return typographyVariables(settings.design.typography.sections[section], "section") as CSSProperties;
}

export function contentTypographyStyle(settings: SiteSettings) {
  const value = settings.design.typography.content;
  return typographyVariables(value, "content") as CSSProperties;
}

export function siteFontFaceCss(settings: SiteSettings) {
  const heading=settings.design.theme.headingFontAsset;const body=settings.design.theme.bodyFontAsset;const rules:string[]=[];
  if(heading)rules.push(`@font-face{font-family:"KND Custom Heading";src:url("${heading.url}") format("${heading.format}");font-display:swap;}`);
  if(body)rules.push(`@font-face{font-family:"KND Custom Body";src:url("${body.url}") format("${body.format}");font-display:swap;}`);
  return rules.join("");
}
