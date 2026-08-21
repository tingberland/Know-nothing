export function GET(){return new Response("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\nSitemap: /sitemap.xml\n",{headers:{"content-type":"text/plain; charset=utf-8"}})}
