import { deleteMedia, listMedia, runtimeEnv, saveMedia } from "@/lib/database";
import { requireApiUser } from "@/lib/auth";
import { sanitizePlain } from "@/lib/validation";

const fontTypes:Record<string,string>={".woff":"font/woff",".woff2":"font/woff2"};
function validFont(bytes:ArrayBuffer,extension:string){const minimum=extension===".woff2"?48:44;if(bytes.byteLength<minimum)return false;const view=new DataView(bytes);const signature=new TextDecoder("latin1").decode(bytes.slice(0,4));const expected=extension===".woff2"?"wOF2":"wOFF";const declaredLength=view.getUint32(8);const tableCount=view.getUint16(12);const expandedSize=view.getUint32(16);return signature===expected&&declaredLength===bytes.byteLength&&tableCount>0&&expandedSize>0}
export async function GET(request:Request){const auth=await requireApiUser(request);if("response"in auth)return auth.response;return Response.json({media:await listMedia()})}

export async function POST(request:Request){
  const auth=await requireApiUser(request);if("response"in auth)return auth.response;const bucket=runtimeEnv().MEDIA;if(!bucket)return Response.json({error:"Media storage is unavailable."},{status:503});
  try{
    const form=await request.formData();const file=form.get("file");if(!(file instanceof File))return Response.json({error:"Choose an image, video, or brand font."},{status:400});
    const lower=file.name.toLowerCase();const extension=lower.endsWith(".woff2")?".woff2":lower.endsWith(".woff")?".woff":"";const isFont=Boolean(extension);const isVisual=/^(image|video)\//.test(file.type);
    if(!isVisual&&!isFont)return Response.json({error:"Only images, videos, WOFF, and WOFF2 fonts are supported."},{status:415});
    const max=isFont?5*1024*1024:file.type.startsWith("video/")?250*1024*1024:25*1024*1024;if(file.size>max)return Response.json({error:isFont?"Font files must be 5 MB or smaller.":"File is too large."},{status:413});
    const mimeType=isFont?fontTypes[extension]:file.type;let payload:ReadableStream|ArrayBuffer=file.stream();
    if(isFont){const bytes=await file.arrayBuffer();if(!validFont(bytes,extension))return Response.json({error:"This file is not a valid WOFF font."},{status:415});payload=bytes}
    const safeName=file.name.replace(/[^a-zA-Z0-9._-]+/g,"-").slice(-120);const key=`${new Date().toISOString().slice(0,10)}-${crypto.randomUUID()}-${safeName}`;
    await bucket.put(key,payload,{httpMetadata:{contentType:mimeType},customMetadata:{originalName:file.name,assetKind:isFont?"font":"media"}});
    const id=await saveMedia({objectKey:key,fileName:file.name,mimeType,size:file.size,altText:sanitizePlain(form.get("altText"),300),caption:sanitizePlain(form.get("caption"),500)},auth.user.userId);
    return Response.json({id,media:await listMedia()},{status:201});
  }catch(error){return Response.json({error:error instanceof Error?error.message:"Upload failed."},{status:400})}
}

export async function DELETE(request:Request){const auth=await requireApiUser(request);if("response"in auth)return auth.response;try{await deleteMedia(Number(new URL(request.url).searchParams.get("id")),auth.user.userId);return Response.json({media:await listMedia()})}catch(error){return Response.json({error:error instanceof Error?error.message:"Delete failed."},{status:409})}}
