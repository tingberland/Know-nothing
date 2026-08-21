import { createContent, dashboardData, getSettings, listCategories, listContent, listMedia, listTags } from "@/lib/database";
import { requireApiUser } from "@/lib/auth";
import { validateContent } from "@/lib/validation";

export async function GET(request: Request) {
  const auth=await requireApiUser(request); if("response" in auth)return auth.response;
  const [items,categories,tags,media,dashboard,settings]=await Promise.all([listContent(),listCategories(),listTags(),listMedia(),dashboardData(),getSettings()]);
  return Response.json({items,categories,tags,media,dashboard,settings,user:auth.user});
}
export async function POST(request:Request){
  const auth=await requireApiUser(request);if("response"in auth)return auth.response;
  try{const input=validateContent(await request.json() as Record<string,unknown>);const item=await createContent(input,auth.user.userId);return Response.json({item},{status:201})}catch(error){return Response.json({error:error instanceof Error?error.message:"Could not create content."},{status:400})}
}
