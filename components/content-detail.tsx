/* eslint-disable jsx-a11y/media-has-caption */
import type { ContentItem } from "@/lib/types";
import Image from "next/image";
import { listContent } from "@/lib/database";
import { ContentList, formatDate } from "./content-list";
import { PublicFooter, PublicHeader } from "./public-header";
export async function ContentDetail({item,preview=false}:{item:ContentItem;preview?:boolean}){
  const related=(await listContent({publishedOnly:true,category:item.categorySlug??undefined,limit:4})).filter(v=>v.id!==item.id).slice(0,3);
  let details:Record<string,unknown>={};try{details=JSON.parse(item.fieldsJson)}catch{details={}}
  const coverPosition=["50% 50%","50% 0%","50% 100%","0% 50%","100% 50%"].includes(String(details.coverPosition))?String(details.coverPosition):"50% 50%";
  const coverFit=details.coverFit==="contain"?"contain":"cover";const coverRatio=["wide","landscape","portrait","natural"].includes(String(details.coverRatio))?String(details.coverRatio):"landscape";
  return <main id="top" className="article-site"><PublicHeader/>{preview&&<div className="preview-banner">DRAFT PREVIEW · Only visible in the admin</div>}<article className="article-page page-shell">
    <header className="article-hero"><div className="article-kicker">{item.categoryName??item.type.toUpperCase()} · {item.type.toUpperCase()}</div><h1>{item.title}</h1>{item.subtitle&&<p className="article-deck">{item.subtitle}</p>}<div className="article-byline"><span>BY {item.authorName??"KNOW NOTHING DAILY"}</span><time>{formatDate(item.publishedAt??item.updatedAt)}</time><span>{estimateReadingTime(item.bodyHtml)} MIN READ</span></div></header>
    {item.featuredImageUrl&&<figure className={`article-hero-media cover-${coverRatio} fit-${coverFit}`}>{item.featuredImageMime?.startsWith("video/")?<video src={item.featuredImageUrl} controls preload="metadata" style={{objectPosition:coverPosition}}/>:<Image src={item.featuredImageUrl} alt={item.featuredImageAlt??""} width={1600} height={900} sizes="(max-width: 850px) 100vw, 1120px" style={{objectPosition:coverPosition}} priority/>}</figure>}
    <div className="article-layout"><aside><span>ABOUT THIS {item.type.toUpperCase()}</span><strong>{item.categoryName??item.type}</strong>{typeof details.source==="string"&&<p>SOURCE<br/>{details.source}</p>}</aside><div className="article-body" dangerouslySetInnerHTML={{__html:item.bodyHtml}}/></div>
    {!!item.tags?.length&&<div className="article-tags">{item.tags.map(tag=><a href={`/tag/${tag.slug}`} key={tag.id}>#{tag.name}</a>)}</div>}
  </article>{related.length>0&&<section className="related page-shell"><div className="section-mark">CONTINUE EXPLORING</div><h2>Keep wandering.</h2><ContentList items={related}/></section>}<PublicFooter/></main>
}
function estimateReadingTime(html:string){const words=html.replace(/<[^>]+>/g," ").trim().split(/\s+/).length;return Math.max(1,Math.ceil(words/200))}
