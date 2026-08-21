import { deleteTaxonomy, listTags, saveTaxonomy } from "@/lib/database";
import { requireApiUser } from "@/lib/auth";
import { sanitizePlain, slugify } from "@/lib/validation";
export async function GET(request:Request){const auth=await requireApiUser(request);if("response"in auth)return auth.response;return Response.json({tags:await listTags()})}
export async function POST(request:Request){const auth=await requireApiUser(request);if("response"in auth)return auth.response;const p=await request.json() as Record<string,unknown>;const name=sanitizePlain(p.name,80);const slug=slugify(sanitizePlain(p.slug||name,100));if(!name||!slug)return Response.json({error:"Name and slug are required."},{status:400});await saveTaxonomy("tags",{name,slug});return Response.json({tags:await listTags()})}
export async function DELETE(request:Request){const auth=await requireApiUser(request);if("response"in auth)return auth.response;const id=Number(new URL(request.url).searchParams.get("id"));await deleteTaxonomy("tags",id);return Response.json({tags:await listTags()})}
