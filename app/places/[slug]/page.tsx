import { contentMetadata, renderContent } from "@/lib/content-page";
type Props={params:Promise<{slug:string}>};
export const dynamic="force-dynamic";
export async function generateMetadata({params}:Props){return contentMetadata("place",(await params).slug)}
export default async function Page({params}:Props){return renderContent("place",(await params).slug)}
