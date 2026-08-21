import { requireChatGPTUser, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { authorizeUser } from "@/lib/auth";
import { dashboardData, getSettings, listCategories, listContent, listMedia, listTags } from "@/lib/database";
import { AdminClient } from "./admin-client";
export const dynamic="force-dynamic";
export default async function AdminPage(){
  const identity=await requireChatGPTUser("/admin"); const user=await authorizeUser(identity);
  if(!user)return <main className="admin-gate"><div className="gate-card"><span className="admin-brand">✦ KNOW NOTHING DAILY</span><div className="gate-code">403</div><h1>Signed in, but not invited.</h1><p>Your account <strong>{identity.email}</strong> is authenticated, but it is not on this site’s admin or editor list.</p><p className="gate-note">Add this email to the hosted <code>ADMIN_EMAILS</code> setting, then revisit this page.</p><a className="admin-button" href={chatGPTSignOutPath("/")}>Sign out</a></div></main>;
  const [items,categories,tags,media,dashboard,settings]=await Promise.all([listContent(),listCategories(),listTags(),listMedia(),dashboardData(),getSettings()]);
  return <AdminClient initial={{items,categories,tags,media,dashboard,settings}} user={user} signOutPath={chatGPTSignOutPath("/")}/>;
}
