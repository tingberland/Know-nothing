import { ContentDetail } from "@/components/content-detail";
import { getContentById } from "@/lib/database";
import { notFound } from "next/navigation";
type Props={params:Promise<{id:string}>};
export const dynamic="force-dynamic";
export default async function Page({params}:Props){const item=await getContentById(Number((await params).id),true);if(!item)notFound();return <ContentDetail item={item}/>}
