import { listContent } from "@/lib/database";
import { typePath } from "@/components/content-list";
export async function GET(request:Request){const origin=new URL(request.url).origin;const items=await listContent({publishedOnly:true,limit:500});const urls=[`${origin}/`,`${origin}/search`,...items.map(i=>`${origin}/${typePath[i.type]}/${i.slug}`)];const xml=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${escapeXml(url)}</loc></url>`).join("")}</urlset>`;return new Response(xml,{headers:{"content-type":"application/xml; charset=utf-8","cache-control":"public,max-age=3600"}})}
function escapeXml(value:string){return value.replace(/[<>&'"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"}[c]!))}
