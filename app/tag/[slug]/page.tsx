import { ContentList } from "@/components/content-list";
import { PublicFooter, PublicHeader } from "@/components/public-header";
import { listContent, listTags } from "@/lib/database";
import { notFound } from "next/navigation";
type Props={params:Promise<{slug:string}>};
export const dynamic="force-dynamic";
export default async function Page({params}:Props){const slug=(await params).slug;const [items,tags]=await Promise.all([listContent({publishedOnly:true,tag:slug}),listTags()]);const tag=tags.find(t=>t.slug===slug);if(!tag)notFound();return <main id="top"><PublicHeader/><section className="listing-page page-shell"><div className="section-mark">TAGGED</div><h1>#{tag.name}</h1><ContentList items={items}/></section><PublicFooter/></main>}
