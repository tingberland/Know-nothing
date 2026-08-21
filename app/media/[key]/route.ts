import { runtimeEnv } from "@/lib/database";
type Context={params:Promise<{key:string}>};
export async function GET(_request:Request,{params}:Context){const key=decodeURIComponent((await params).key);const object=await runtimeEnv().MEDIA?.get(key);if(!object)return new Response("Not found",{status:404});const headers=new Headers();object.writeHttpMetadata(headers);headers.set("etag",object.httpEtag);headers.set("cache-control","public, max-age=31536000, immutable");return new Response(object.body,{headers})}
