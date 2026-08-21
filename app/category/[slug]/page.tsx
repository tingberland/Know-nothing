import { ContentList } from "@/components/content-list";
import { PublicFooter, PublicHeader } from "@/components/public-header";
import { listCategories, listContent } from "@/lib/database";
import { notFound } from "next/navigation";
type Props={params:Promise<{slug:string}>};
export const dynamic="force-dynamic";
export default async function Page({params}:Props){const slug=(await params).slug;const [items,categories]=await Promise.all([listContent({publishedOnly:true,category:slug}),listCategories()]);const category=categories.find(c=>c.slug===slug);if(!category)notFound();return <main id="top"><PublicHeader/><section className="listing-page page-shell"><div className="section-mark">CATEGORY</div><h1>{category.name}</h1><p className="listing-deck">{category.description}</p><ContentList items={items}/></section><PublicFooter/></main>}
