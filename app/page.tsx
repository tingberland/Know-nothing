import { ContentList } from "@/components/content-list";
import { PublicFooter } from "@/components/public-header";
import { getSettings, listCategories, listContent } from "@/lib/database";
import { normalizeSiteSettings, siteThemeStyle, type CustomSection, type SiteSettings } from "@/lib/site-settings";

export const dynamic="force-dynamic";

export default async function Home(){
  const settings=await getSettings();const site=normalizeSiteSettings(settings.site);
  const [items,categories]=await Promise.all([listContent({publishedOnly:true,limit:site.design.archive.limit}),listCategories()]);
  const customByKey=new Map(site.design.customSections.map(section=>[`custom:${section.id}`,section]));
  return <main id="top" className={`home-site archive-${site.design.archive.layout}`} style={siteThemeStyle(site)}>
    <header className="site-header page-shell"><a className="wordmark" href="#top"><span aria-hidden="true">✦</span> {site.name}</a><nav aria-label="Main navigation">{site.navigation.map(link=><a href={link.href} key={`${link.label}-${link.href}`}>{link.label}</a>)}<a href="/search">ค้นหา</a><a className="nav-pill" href="/admin">Admin ↗</a></nav></header>
    {site.design.sectionOrder.map(key=>{
      if(key==="hero"&&site.design.visibility.hero)return <Hero site={site} itemCount={items.length} categoryCount={categories.length} key={key}/>;
      if(key==="manifesto"&&site.design.visibility.manifesto)return <Manifesto site={site} key={key}/>;
      if(key==="archive"&&site.design.visibility.archive)return <Archive site={site} items={items} categories={categories} key={key}/>;
      const custom=customByKey.get(key);return custom?.enabled?<CustomBlock section={custom} key={key}/>:null;
    })}
    <PublicFooter site={site}/>
  </main>;
}

function Hero({site,itemCount,categoryCount}:{site:SiteSettings;itemCount:number;categoryCount:number}){const hero=site.design.hero;return <section className="hero page-shell" aria-labelledby="hero-title"><div className="eyebrow">{hero.eyebrow}</div><div className="hero-grid"><div><h1 id="hero-title">{hero.titleBefore} <span>{hero.titleAccent}</span> {hero.titleAfter}</h1><p className="hero-deck">{hero.deck}</p></div><aside className="prompt-note" aria-label="Today’s prompt"><div className="prompt-top"><span>{hero.promptLabel}</span></div><p>{hero.prompt}</p><a href="#archive">{hero.promptLink}</a></aside></div><div className="hero-footer"><a className="explore-link" href="#archive"><span>↓</span> EXPLORE THE ARCHIVE</a><dl className="stats" aria-label="Archive statistics"><div><dt>DISCOVERIES</dt><dd>{String(itemCount).padStart(2,"0")}</dd></div><div><dt>CATEGORIES</dt><dd>{String(categoryCount).padStart(2,"0")}</dd></div><div><dt>STARTED</dt><dd>AUG ’26</dd></div></dl></div></section>}

function Manifesto({site}:{site:SiteSettings}){const block=site.design.manifesto;return <section className="manifesto" id="manifesto"><div className="page-shell manifesto-grid"><div className="section-mark">{block.eyebrow}</div><h2>{block.title}<br/><em>{block.accent}</em></h2><div className="manifesto-copy"><p>{block.lead}</p><p>{block.body}</p></div></div></section>}

function Archive({site,items,categories}:{site:SiteSettings;items:Awaited<ReturnType<typeof listContent>>;categories:Awaited<ReturnType<typeof listCategories>>}){const block=site.design.archive;return <section className="archive page-shell" id="archive"><div className="archive-heading"><div><div className="section-mark">{block.eyebrow}</div><h2>{block.title}</h2></div><form className="search-field" action="/search"><span aria-hidden="true">⌕</span><label className="sr-only" htmlFor="home-search">ค้นหาบันทึก</label><input id="home-search" name="q" type="search" placeholder={block.searchPlaceholder}/></form></div>{block.showCategories&&<div className="filters" aria-label="Browse by category"><a className="active" href="#archive">ทั้งหมด</a>{categories.map(category=><a href={`/category/${category.slug}`} key={category.id}>{category.name}</a>)}</div>}<ContentList items={items} layout={block.layout}/></section>}

function CustomBlock({section}:{section:CustomSection}){return <section className={`custom-public-section tone-${section.tone}`}><div className="page-shell custom-public-grid"><div className="section-mark">{section.eyebrow}</div><h2>{section.title}</h2><div>{section.body.split(/\n+/).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div></div></section>}
