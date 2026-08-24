import { ContentList } from "@/components/content-list";
import { PublicFooter, PublicHeader } from "@/components/public-header";
/* eslint-disable @next/next/no-img-element */
import { getMediaById, getSettings, listCategories, listContent } from "@/lib/database";
import { normalizeSiteSettings, sectionTypographyStyle, siteThemeStyle, type BackgroundSlot, type CustomSection, type SiteSettings } from "@/lib/site-settings";
import type { MediaItem } from "@/lib/types";

export const dynamic="force-dynamic";

export default async function Home(){
  const settings=await getSettings();const site=normalizeSiteSettings(settings.site);
  const [items,categories,heroBackground,manifestoBackground,archiveBackground]=await Promise.all([listContent({publishedOnly:true,limit:site.design.archive.limit}),listCategories(),getMediaById(site.design.backgrounds.hero.mediaId),getMediaById(site.design.backgrounds.manifesto.mediaId),getMediaById(site.design.backgrounds.archive.mediaId)]);
  const customByKey=new Map(site.design.customSections.map(section=>[`custom:${section.id}`,section]));
  return <main id="top" className={`home-site archive-${site.design.archive.layout}`} style={siteThemeStyle(site)}>
    <PublicHeader site={site}/>
    {site.design.sectionOrder.map(key=>{
      if(key==="hero"&&site.design.visibility.hero)return <Hero site={site} background={heroBackground} itemCount={items.length} categoryCount={categories.length} key={key}/>;
      if(key==="manifesto"&&site.design.visibility.manifesto)return <Manifesto site={site} background={manifestoBackground} key={key}/>;
      if(key==="archive"&&site.design.visibility.archive)return <Archive site={site} background={archiveBackground} items={items} categories={categories} key={key}/>;
      const custom=customByKey.get(key);return custom?.enabled?<CustomBlock section={custom} key={key}/>:null;
    })}
    <PublicFooter site={site}/>
  </main>;
}

function Hero({site,background,itemCount,categoryCount}:{site:SiteSettings;background:MediaItem|null;itemCount:number;categoryCount:number}){const hero=site.design.hero;return <section className="hero page-shell" style={sectionTypographyStyle(site,"hero")} aria-labelledby="hero-title"><SectionBackground media={background} slot={site.design.backgrounds.hero}/><div className="eyebrow">{hero.eyebrow}</div><div className="hero-grid"><div><h1 id="hero-title">{hero.titleBefore} <span>{hero.titleAccent}</span> {hero.titleAfter}</h1><p className="hero-deck">{hero.deck}</p></div><aside className="prompt-note" aria-label="Today’s prompt"><div className="prompt-top"><span>{hero.promptLabel}</span></div><p>{hero.prompt}</p><a href="#archive">{hero.promptLink}</a></aside></div><div className="hero-footer"><a className="explore-link" href="#archive"><span>↓</span> EXPLORE THE ARCHIVE</a><dl className="stats" aria-label="Archive statistics"><div><dt>DISCOVERIES</dt><dd>{String(itemCount).padStart(2,"0")}</dd></div><div><dt>CATEGORIES</dt><dd>{String(categoryCount).padStart(2,"0")}</dd></div><div><dt>STARTED</dt><dd>AUG ’26</dd></div></dl></div></section>}

function Manifesto({site,background}:{site:SiteSettings;background:MediaItem|null}){const block=site.design.manifesto;return <section className="manifesto" id="manifesto" style={sectionTypographyStyle(site,"manifesto")}><SectionBackground media={background} slot={site.design.backgrounds.manifesto}/><div className="page-shell manifesto-grid"><div className="section-mark">{block.eyebrow}</div><h2>{block.title}<br/><em>{block.accent}</em></h2><div className="manifesto-copy"><p>{block.lead}</p><p>{block.body}</p></div></div></section>}

function Archive({site,background,items,categories}:{site:SiteSettings;background:MediaItem|null;items:Awaited<ReturnType<typeof listContent>>;categories:Awaited<ReturnType<typeof listCategories>>}){const block=site.design.archive;return <section className="archive page-shell" id="archive" style={sectionTypographyStyle(site,"archive")}><SectionBackground media={background} slot={site.design.backgrounds.archive}/><div className="archive-heading"><div><div className="section-mark">{block.eyebrow}</div><h2>{block.title}</h2></div><form className="search-field" action="/search"><span aria-hidden="true">⌕</span><label className="sr-only" htmlFor="home-search">ค้นหาบันทึก</label><input id="home-search" name="q" type="search" placeholder={block.searchPlaceholder}/></form></div>{block.showCategories&&<div className="filters" aria-label="Browse by category"><a className="active" href="#archive">ทั้งหมด</a>{categories.map(category=><a href={`/category/${category.slug}`} key={category.id}>{category.name}</a>)}</div>}<ContentList items={items} layout={block.layout}/></section>}

function CustomBlock({section}:{section:CustomSection}){return <section className={`custom-public-section tone-${section.tone}`}><div className="page-shell custom-public-grid"><div className="section-mark">{section.eyebrow}</div><h2>{section.title}</h2><div>{section.body.split(/\n+/).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div></div></section>}

function SectionBackground({media,slot}:{media:MediaItem|null;slot:BackgroundSlot}){if(!media||!/^(image|video)\//.test(media.mimeType))return null;return <div className="section-background" aria-hidden="true">{media.mimeType.startsWith("video/")?<video src={media.url} autoPlay muted loop playsInline style={{objectPosition:slot.position}}/>:<img src={media.url} alt="" style={{objectPosition:slot.position}}/>}<span style={{opacity:slot.overlay/100}}/></div>}
