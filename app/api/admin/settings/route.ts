import { getSettings, saveSetting } from "@/lib/database";
import { requireApiUser } from "@/lib/auth";
import { sanitizePlain } from "@/lib/validation";
import { normalizeSiteSettings } from "@/lib/site-settings";
export async function GET(request:Request){const auth=await requireApiUser(request);if("response"in auth)return auth.response;return Response.json({settings:await getSettings()})}
export async function PUT(request:Request){
  const auth=await requireApiUser(request);if("response"in auth)return auth.response;if(auth.user.role!=="admin")return Response.json({error:"Admin role required."},{status:403});
  const p=await request.json() as Record<string,unknown>;const current=await getSettings();const previous=normalizeSiteSettings(current.site);const merged:Record<string,unknown>={...previous};
  for(const key of ["name","description","footer","logoMediaId","faviconMediaId","socialImageMediaId","analytics","socialLinks","navigation","design"])if(key in p)merged[key]=p[key];
  const site=normalizeSiteSettings(merged);site.name=sanitizePlain(site.name,100);site.description=sanitizePlain(site.description,300);site.footer=sanitizePlain(site.footer,200);site.analytics=sanitizePlain(site.analytics,500);
  await saveSetting("site",site,auth.user.userId);return Response.json({settings:await getSettings()});
}
