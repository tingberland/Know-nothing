import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { authorizeUser } from "@/lib/auth";
import { ContentDetail } from "@/components/content-detail";
import { getContentById } from "@/lib/database";
import { notFound } from "next/navigation";
type Props={params:Promise<{id:string}>};
export const dynamic="force-dynamic";
export default async function Page({params}:Props){const identity=await requireChatGPTUser(`/admin/preview/${(await params).id}`);if(!await authorizeUser(identity))notFound();const item=await getContentById(Number((await params).id));if(!item)notFound();return <ContentDetail item={item} preview/>}
