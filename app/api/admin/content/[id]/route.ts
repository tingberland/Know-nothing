import { deleteContent, getContentById, updateContent } from "@/lib/database";
import { requireApiUser } from "@/lib/auth";
import { validateContent } from "@/lib/validation";
type Context={params:Promise<{id:string}>};
export async function GET(request:Request,{params}:Context){const auth=await requireApiUser(request);if("response"in auth)return auth.response;const item=await getContentById(Number((await params).id));return item?Response.json({item}):Response.json({error:"Not found."},{status:404})}
export async function PUT(request:Request,{params}:Context){const auth=await requireApiUser(request);if("response"in auth)return auth.response;try{const input=validateContent(await request.json() as Record<string,unknown>);const item=await updateContent(Number((await params).id),input,auth.user.userId);return item?Response.json({item}):Response.json({error:"Not found."},{status:404})}catch(error){return Response.json({error:error instanceof Error?error.message:"Could not save content."},{status:400})}}
export async function DELETE(request:Request,{params}:Context){const auth=await requireApiUser(request);if("response"in auth)return auth.response;const ok=await deleteContent(Number((await params).id),auth.user.userId);return ok?Response.json({ok:true}):Response.json({error:"Not found."},{status:404})}
