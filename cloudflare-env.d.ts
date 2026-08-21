declare module "cloudflare:workers" { export const env: Record<string, unknown>; }
interface D1Result<T=unknown>{results?:T[];success:boolean;meta:{last_row_id?:number|string;[key:string]:unknown}}
interface D1PreparedStatement { bind(...values:unknown[]):D1PreparedStatement; run<T=unknown>():Promise<D1Result<T>>; all<T=Record<string,unknown>>():Promise<{results:T[];success:boolean;meta:Record<string,unknown>}>; first<T=Record<string,unknown>>():Promise<T|null>; }
interface D1Database { prepare(query:string):D1PreparedStatement; batch<T=unknown>(statements:D1PreparedStatement[]):Promise<D1Result<T>[]>; }
interface R2ObjectBody { body:ReadableStream; httpEtag:string; writeHttpMetadata(headers:Headers):void; }
interface R2Bucket { put(key:string,value:ReadableStream|ArrayBuffer|Blob,{httpMetadata,customMetadata}?:{httpMetadata?:{contentType?:string};customMetadata?:Record<string,string>}):Promise<unknown>; get(key:string):Promise<R2ObjectBody|null>; delete(key:string):Promise<void>; }
interface Fetcher { fetch(request:Request):Promise<Response>; }
