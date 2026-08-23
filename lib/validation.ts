import type { ContentInput, ContentType, PublicationStatus } from "./types";
const allowedTypes = new Set<ContentType>(["article", "note", "film", "place"]);
const allowedStatuses = new Set<PublicationStatus>(["draft", "published"]);
export function slugify(value: string) { return value.trim().toLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}\p{M}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 120); }
export function sanitizePlain(value: unknown, max = 5000) { return String(value ?? "").replace(/[<>]/g, "").trim().slice(0, max); }
export function sanitizeHtml(value: unknown) {
  let html = String(value ?? "").slice(0, 250_000);
  html = html.replace(/<\/?(?:script|style|iframe|object|embed|form|input|button|textarea|select|meta|link)[^>]*>/gi, "");
  html = html.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(/\s(?:href|src)\s*=\s*(["'])\s*(?:javascript|data:text\/html):[^"']*\1/gi, "");
  return html.trim();
}
export function validateContent(payload: Record<string, unknown>): ContentInput {
  const type = sanitizePlain(payload.type, 20) as ContentType; const status = sanitizePlain(payload.status, 20) as PublicationStatus; const title = sanitizePlain(payload.title, 240); const slug = slugify(title);
  if (!allowedTypes.has(type)) throw new Error("Choose a valid content type."); if (!allowedStatuses.has(status)) throw new Error("Choose draft or published status."); if (!title) throw new Error("Title is required."); if (!slug) throw new Error("A valid slug is required.");
  return { type,status,title,slug,subtitle:sanitizePlain(payload.subtitle,500),excerpt:sanitizePlain(payload.excerpt,1200),bodyHtml:sanitizeHtml(payload.bodyHtml),categoryId:positiveId(payload.categoryId),featuredImageId:positiveId(payload.featuredImageId),socialImageId:positiveId(payload.socialImageId),galleryJson:validJson(payload.galleryJson,"[]"),fieldsJson:validJson(payload.fieldsJson,"{}"),seoTitle:sanitizePlain(payload.seoTitle,240),seoDescription:sanitizePlain(payload.seoDescription,500),featured:Boolean(payload.featured),tagIds:Array.isArray(payload.tagIds)?payload.tagIds.map(Number).filter((id)=>Number.isInteger(id)&&id>0).slice(0,50):[] };
}
function positiveId(value: unknown) { const id=Number(value); return Number.isInteger(id)&&id>0?id:null; }
function validJson(value: unknown, fallback: string) { try { return JSON.stringify(JSON.parse(String(value ?? fallback))); } catch { return fallback; } }
