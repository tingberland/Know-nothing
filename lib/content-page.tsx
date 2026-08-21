import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/content-detail";
import { getContentBySlug } from "./database";
import type { ContentType } from "./types";
export async function renderContent(type:ContentType,slug:string){const item=await getContentBySlug(type,slug);if(!item)notFound();return <ContentDetail item={item}/>}
export async function contentMetadata(type:ContentType,slug:string):Promise<Metadata>{const item=await getContentBySlug(type,slug);if(!item)return{title:"Not found",robots:{index:false,follow:false}};return{title:item.seoTitle||item.title,description:item.seoDescription||item.excerpt,alternates:{canonical:`/${typePath(type)}/${item.slug}`},openGraph:{type:"article",title:item.seoTitle||item.title,description:item.seoDescription||item.excerpt,images:item.featuredImageUrl?[{url:item.featuredImageUrl,alt:item.featuredImageAlt??""}]:[]},twitter:{card:"summary_large_image",title:item.seoTitle||item.title,description:item.seoDescription||item.excerpt,images:item.featuredImageUrl?[item.featuredImageUrl]:[]}}}
function typePath(type:ContentType){return{article:"articles",note:"notes",film:"films",place:"places"}[type]}
