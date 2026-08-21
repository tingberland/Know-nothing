import type { Metadata } from "next";
import { ContentList } from "@/components/content-list";
import { PublicFooter, PublicHeader } from "@/components/public-header";
import { listContent } from "@/lib/database";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Search",description:"Search the Know Nothing Daily archive"};
export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}){const q=((await searchParams).q??"").trim().slice(0,100);const items=q?await listContent({publishedOnly:true,search:q,limit:100}):[];return <main id="top"><PublicHeader/><section className="listing-page page-shell"><div className="section-mark">SEARCH THE ARCHIVE</div><h1>What are you<br/><em>curious</em> about?</h1><form className="big-search"><label><span className="sr-only">Search</span><input type="search" name="q" defaultValue={q} placeholder="Film, place, person, idea…"/></label><button type="submit">Search ↗</button></form>{q&&<div className="results-label">{items.length} result{items.length===1?"":"s"} for “{q}”</div>}<ContentList items={items}/></section><PublicFooter/></main>}
