import type { ContentItem } from "@/lib/types";
export const typePath={article:"articles",note:"notes",film:"films",place:"places"} as const;
const typeLabel={article:"ARTICLE",note:"NOTE",film:"FILM",place:"PLACE"};
export function ContentList({items}: {items:ContentItem[]}){
  if(!items.length)return <div className="empty-state"><span>⌕</span><h3>ยังไม่พบบันทึกในหมวดนี้</h3><p>ลองค้นหาด้วยคำอื่น หรือกลับมาสำรวจใหม่อีกครั้ง</p></div>;
  return <div className="discovery-list">{items.map((item,index)=><article className="discovery-row" key={item.id}>
    <div className={`discovery-number ${index%2?"blue":"coral"}`}>{String(index+1).padStart(2,"0")}</div>
    <div className="discovery-meta"><time>{formatDate(item.publishedAt??item.updatedAt)}</time><span style={{background:item.categoryColor??undefined}}>{item.categoryName??typeLabel[item.type]}</span></div>
    <div className="discovery-copy"><small>{typeLabel[item.type]}</small><h3>{item.title}</h3><p>{item.excerpt||item.subtitle}</p></div>
    <a href={`/${typePath[item.type]}/${item.slug}`} aria-label={`อ่าน ${item.title}`}>อ่านบันทึก <span>↗</span></a>
  </article>)}</div>
}
export function formatDate(value:string){return new Intl.DateTimeFormat("th-TH",{day:"numeric",month:"short",year:"numeric"}).format(new Date(value))}
