import { ContentList } from "@/components/content-list";
import { PublicFooter, PublicHeader } from "@/components/public-header";
import { listContent } from "@/lib/database";
import type { ContentType } from "@/lib/types";

const details:Record<ContentType,{eyebrow:string;title:string;description:string}>={
  article:{eyebrow:"ARTICLES",title:"Long-form discoveries.",description:"Ideas, explanations, and stories collected in depth."},
  note:{eyebrow:"NOTES",title:"Small things worth keeping.",description:"Short observations, references, and daily discoveries."},
  film:{eyebrow:"FILMS",title:"The screen archive.",description:"Films watched, questions raised, and details remembered."},
  place:{eyebrow:"PLACES",title:"Field notes from the world.",description:"Places visited, imagined, and worth returning to."},
};

export async function TypeListingPage({type}:{type:ContentType}){const copy=details[type];const items=await listContent({publishedOnly:true,type,limit:100});return <main id="top"><PublicHeader/><section className="listing-page page-shell"><div className="section-mark">{copy.eyebrow}</div><h1>{copy.title}</h1><p className="listing-intro">{copy.description}</p><ContentList items={items}/></section><PublicFooter/></main>}
