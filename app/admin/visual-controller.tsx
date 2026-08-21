"use client";

import { useMemo, useState, type CSSProperties, type ChangeEvent } from "react";
import { normalizeSiteSettings, type CustomSection, type FontAsset, type SiteDesign, type SocialLink } from "@/lib/site-settings";

type Props = { settings: Record<string, unknown>; canEdit: boolean; onSaved: () => Promise<void> };
const coreNames: Record<string, string> = { hero: "Hero introduction", manifesto: "Philosophy", archive: "Learning archive" };

export function VisualController({ settings, canEdit, onSaved }: Props) {
  const initial = useMemo(() => normalizeSiteSettings(settings.site), [settings]);
  const [design, setDesign] = useState<SiteDesign>(initial.design);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initial.socialLinks);
  const [saving, setSaving] = useState(false);
  const [uploadingFont, setUploadingFont] = useState<"heading"|"body"|null>(null);
  const [panel, setPanel] = useState<"sections" | "content" | "theme" | "social">("sections");

  function update<K extends keyof SiteDesign>(key: K, value: SiteDesign[K]) { setDesign(current => ({ ...current, [key]: value })); }
  function updateTheme<K extends keyof SiteDesign["theme"]>(key: K, value: SiteDesign["theme"][K]) { setDesign(current=>({...current,theme:{...current.theme,[key]:value}})); }
  function updateBlock<K extends "hero" | "manifesto" | "archive">(block: K, key: keyof SiteDesign[K], value: SiteDesign[K][keyof SiteDesign[K]]) {
    setDesign(current=>({...current,[block]:{...current[block],[key]:value}}));
  }
  function move(section: string, direction: -1 | 1) {
    const next = [...design.sectionOrder]; const index = next.indexOf(section); const target = index + direction;
    if (index < 0 || target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]]; update("sectionOrder", next);
  }
  function addCustom() {
    const id = crypto.randomUUID().slice(0, 8);
    const section: CustomSection = { id, enabled: true, eyebrow: "NEW SECTION", title: "A new chapter", body: "Tell visitors what belongs in this part of your archive.", tone: "paper" };
    update("customSections", [...design.customSections, section]); update("sectionOrder", [...design.sectionOrder, `custom:${id}`]);
  }
  function patchCustom(id: string, patch: Partial<CustomSection>) { update("customSections", design.customSections.map(section => section.id === id ? { ...section, ...patch } : section)); }
  function removeCustom(id: string) { update("customSections", design.customSections.filter(section => section.id !== id)); update("sectionOrder", design.sectionOrder.filter(section => section !== `custom:${id}`)); }
  async function save() {
    setSaving(true);
    const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ design, socialLinks }) });
    const result = await response.json(); setSaving(false);
    if (!response.ok) { alert(result.error); return; }
    await onSaved();
  }
  async function uploadFont(target:"heading"|"body",event:ChangeEvent<HTMLInputElement>){
    const file=event.target.files?.[0];if(!file)return;setUploadingFont(target);const form=new FormData();form.set("file",file);form.set("caption",`${target} brand font`);
    const response=await fetch("/api/admin/media",{method:"POST",body:form});const result=await response.json();setUploadingFont(null);event.target.value="";
    if(!response.ok){alert(result.error);return}const uploaded=(result.media as Array<{id:number;fileName:string;mimeType:string;url:string}>).find(item=>item.id===result.id);if(!uploaded)return;
    const asset:FontAsset={name:uploaded.fileName.replace(/\.woff2?$/i,""),url:uploaded.url,format:uploaded.mimeType==="font/woff2"?"woff2":"woff"};
    setDesign(current=>({...current,theme:{...current.theme,[`${target}Font`]:"custom",[`${target}FontAsset`]:asset}}));
  }
  function addSocial(){setSocialLinks(current=>[...current,{platform:"instagram",label:"Instagram",href:"https://instagram.com/",placement:"footer"}])}
  function patchSocial(index:number,patch:Partial<SocialLink>){setSocialLinks(current=>current.map((link,i)=>i===index?{...link,...patch}:link))}

  const sectionName = (key: string) => key.startsWith("custom:") ? design.customSections.find(section => `custom:${section.id}` === key)?.title ?? "Custom section" : coreNames[key];
  const sectionEnabled = (key: string) => key.startsWith("custom:") ? design.customSections.find(section => `custom:${section.id}` === key)?.enabled !== false : design.visibility[key as keyof typeof design.visibility];
  function toggleSection(key: string) {
    if (key.startsWith("custom:")) { const id = key.slice(7); const item = design.customSections.find(section => section.id === id); if (item) patchCustom(id, { enabled: !item.enabled }); return; }
    update("visibility", { ...design.visibility, [key]: !design.visibility[key as keyof typeof design.visibility] });
  }

  return <div className="design-workspace">
    <section className="design-controls">
      <div className="design-intro"><div><span>VISUAL WEBSITE CONTROLLER</span><h2>Shape the whole experience.</h2><p>Changes appear in the preview immediately and go live after you save.</p></div><button className="primary" disabled={!canEdit || saving} onClick={save}>{saving ? "Saving…" : "Save website design"}</button></div>
      {!canEdit && <p className="warning">Only administrators can change the website design.</p>}
      <div className="design-tabs" role="tablist">{([['sections','Sections'],['content','Words & layout'],['theme','Theme & fonts'],['social','Social links']] as const).map(([id,label]) => <button role="tab" aria-selected={panel===id} className={panel===id?"active":""} onClick={()=>setPanel(id)} key={id}>{label}</button>)}</div>
      {panel === "sections" && <div className="control-stack">
        <div className="control-heading"><div><h3>Homepage sections</h3><p>Choose how many sections appear and set their order.</p></div><button onClick={addCustom}>+ Add text section</button></div>
        <div className="section-sorter">{design.sectionOrder.map((key,index)=><div className={`section-sort-row ${sectionEnabled(key)?"":"off"}`} key={key}><span className="drag-mark">{String(index+1).padStart(2,"0")}</span><strong>{sectionName(key)}</strong><label><input type="checkbox" checked={sectionEnabled(key)} onChange={()=>toggleSection(key)}/> Show</label><button disabled={index===0} onClick={()=>move(key,-1)} aria-label={`Move ${sectionName(key)} up`}>↑</button><button disabled={index===design.sectionOrder.length-1} onClick={()=>move(key,1)} aria-label={`Move ${sectionName(key)} down`}>↓</button></div>)}</div>
        {design.customSections.map(section=><fieldset className="custom-section-editor" key={section.id}><legend>Custom section</legend><label>Small heading<input value={section.eyebrow} onChange={event=>patchCustom(section.id,{eyebrow:event.target.value})}/></label><label>Title<input value={section.title} onChange={event=>patchCustom(section.id,{title:event.target.value})}/></label><label>Body<textarea rows={4} value={section.body} onChange={event=>patchCustom(section.id,{body:event.target.value})}/></label><label>Color treatment<select value={section.tone} onChange={event=>patchCustom(section.id,{tone:event.target.value as CustomSection["tone"]})}><option value="paper">Paper</option><option value="ink">Dark ink</option><option value="accent">Accent note</option></select></label><button className="danger" onClick={()=>removeCustom(section.id)}>Remove section</button></fieldset>)}
      </div>}
      {panel === "content" && <div className="control-stack">
        <fieldset><legend>Hero introduction</legend><label>Eyebrow<input value={design.hero.eyebrow} onChange={event=>updateBlock("hero","eyebrow",event.target.value)}/></label><div className="form-three"><label>Title start<input value={design.hero.titleBefore} onChange={event=>updateBlock("hero","titleBefore",event.target.value)}/></label><label>Accent words<input value={design.hero.titleAccent} onChange={event=>updateBlock("hero","titleAccent",event.target.value)}/></label><label>Title end<input value={design.hero.titleAfter} onChange={event=>updateBlock("hero","titleAfter",event.target.value)}/></label></div><label>Introduction<textarea rows={3} value={design.hero.deck} onChange={event=>updateBlock("hero","deck",event.target.value)}/></label><label>Prompt label<input value={design.hero.promptLabel} onChange={event=>updateBlock("hero","promptLabel",event.target.value)}/></label><label>Prompt text<textarea rows={3} value={design.hero.prompt} onChange={event=>updateBlock("hero","prompt",event.target.value)}/></label><label>Prompt link text<input value={design.hero.promptLink} onChange={event=>updateBlock("hero","promptLink",event.target.value)}/></label></fieldset>
        <fieldset><legend>Philosophy section</legend><label>Eyebrow<input value={design.manifesto.eyebrow} onChange={event=>updateBlock("manifesto","eyebrow",event.target.value)}/></label><div className="form-two"><label>Title<input value={design.manifesto.title} onChange={event=>updateBlock("manifesto","title",event.target.value)}/></label><label>Accent ending<input value={design.manifesto.accent} onChange={event=>updateBlock("manifesto","accent",event.target.value)}/></label></div><label>Lead paragraph<textarea rows={3} value={design.manifesto.lead} onChange={event=>updateBlock("manifesto","lead",event.target.value)}/></label><label>Supporting paragraph<textarea rows={3} value={design.manifesto.body} onChange={event=>updateBlock("manifesto","body",event.target.value)}/></label></fieldset>
        <fieldset><legend>Archive section</legend><div className="form-two"><label>Eyebrow<input value={design.archive.eyebrow} onChange={event=>updateBlock("archive","eyebrow",event.target.value)}/></label><label>Title<input value={design.archive.title} onChange={event=>updateBlock("archive","title",event.target.value)}/></label></div><label>Search placeholder<input value={design.archive.searchPlaceholder} onChange={event=>updateBlock("archive","searchPlaceholder",event.target.value)}/></label><div className="form-three"><label>Content layout<select value={design.archive.layout} onChange={event=>updateBlock("archive","layout",event.target.value as "list"|"grid")}><option value="list">Editorial list</option><option value="grid">Card grid</option></select></label><label>Maximum entries<input type="number" min="3" max="60" value={design.archive.limit} onChange={event=>updateBlock("archive","limit",Number(event.target.value))}/></label><label className="check-row"><input type="checkbox" checked={design.archive.showCategories} onChange={event=>updateBlock("archive","showCategories",event.target.checked)}/> Show category filters</label></div></fieldset>
      </div>}
      {panel === "theme" && <div className="control-stack">
        <fieldset><legend>Brand colors</legend><div className="color-grid">{([['paper','Background'],['ink','Ink'],['coral','Coral'],['acid','Lime'],['blue','Periwinkle']] as const).map(([key,label])=><label className="color-control" key={key}><input type="color" value={design.theme[key]} onChange={event=>updateTheme(key,event.target.value)}/><span>{label}<small>{design.theme[key]}</small></span></label>)}</div></fieldset>
        <fieldset><legend>Typography & rhythm</legend><div className="form-two"><label>Heading personality<select value={design.theme.headingFont} onChange={event=>updateTheme("headingFont",event.target.value as SiteDesign["theme"]["headingFont"])}><option value="editorial">Editorial serif</option><option value="modern">Modern sans</option><option value="humanist">Warm humanist</option>{design.theme.headingFontAsset&&<option value="custom">{design.theme.headingFontAsset.name}</option>}</select></label><label>Body type<select value={design.theme.bodyFont} onChange={event=>updateTheme("bodyFont",event.target.value as SiteDesign["theme"]["bodyFont"])}><option value="sans">Clean sans</option><option value="serif">Literary serif</option>{design.theme.bodyFontAsset&&<option value="custom">{design.theme.bodyFontAsset.name}</option>}</select></label><label>Section spacing<select value={design.theme.density} onChange={event=>updateTheme("density",event.target.value as SiteDesign["theme"]["density"])}><option value="airy">Airy</option><option value="balanced">Balanced</option><option value="compact">Compact</option></select></label><label>Corner style<select value={design.theme.corners} onChange={event=>updateTheme("corners",event.target.value as SiteDesign["theme"]["corners"])}><option value="sharp">Sharp editorial</option><option value="soft">Soft rounded</option></select></label></div></fieldset>
        <fieldset><legend>Upload brand fonts</legend><p className="field-note">Use web-licensed WOFF or WOFF2 files. Each upload can be up to 5 MB.</p><div className="font-upload-grid"><label className="font-upload"><span>Heading font</span><strong>{design.theme.headingFontAsset?.name??"Built-in font"}</strong><input type="file" accept=".woff,.woff2,font/woff,font/woff2" disabled={!canEdit||uploadingFont!==null} onChange={event=>uploadFont("heading",event)}/><i>{uploadingFont==="heading"?"Uploading…":"Choose WOFF / WOFF2"}</i></label><label className="font-upload"><span>Body font</span><strong>{design.theme.bodyFontAsset?.name??"Built-in font"}</strong><input type="file" accept=".woff,.woff2,font/woff,font/woff2" disabled={!canEdit||uploadingFont!==null} onChange={event=>uploadFont("body",event)}/><i>{uploadingFont==="body"?"Uploading…":"Choose WOFF / WOFF2"}</i></label></div></fieldset>
      </div>}
      {panel === "social" && <div className="control-stack"><div className="control-heading"><div><h3>Social media links</h3><p>Add profiles and decide whether they appear in the header, footer, or both.</p></div><button onClick={addSocial}>+ Add social link</button></div>{socialLinks.length===0&&<div className="empty-controller-state">No social links yet. Add your first profile.</div>}<div className="social-link-editor">{socialLinks.map((link,index)=><fieldset key={`${index}-${link.platform}`}><legend>{link.label||`Social link ${index+1}`}</legend><div className="social-fields"><label>Platform<select value={link.platform} onChange={event=>patchSocial(index,{platform:event.target.value as SocialLink["platform"]})}>{["instagram","youtube","tiktok","facebook","x","linkedin","other"].map(platform=><option value={platform} key={platform}>{platform[0].toUpperCase()+platform.slice(1)}</option>)}</select></label><label>Label<input value={link.label} onChange={event=>patchSocial(index,{label:event.target.value})}/></label><label>Profile URL<input type="url" value={link.href} placeholder="https://…" onChange={event=>patchSocial(index,{href:event.target.value})}/></label><label>Display location<select value={link.placement} onChange={event=>patchSocial(index,{placement:event.target.value as SocialLink["placement"]})}><option value="footer">Footer</option><option value="header">Header</option><option value="both">Header and footer</option></select></label><button className="danger" onClick={()=>setSocialLinks(current=>current.filter((_,i)=>i!==index))}>Remove</button></div></fieldset>)}</div></div>}
    </section>
    <aside className="design-preview-wrap"><div className="preview-label"><span>LIVE PREVIEW</span><a href="/" target="_blank">Open full site ↗</a></div><MiniPreview design={design} socialLinks={socialLinks}/></aside>
  </div>;
}

function MiniPreview({ design,socialLinks }: { design: SiteDesign;socialLinks:SocialLink[] }) {
  const heading=design.theme.headingFont==="custom"&&design.theme.headingFontAsset?'"Mini Custom Heading"':design.theme.headingFont==="modern"?'Arial':design.theme.headingFont==="humanist"?'Trebuchet MS':'Georgia';const body=design.theme.bodyFont==="custom"&&design.theme.bodyFontAsset?'"Mini Custom Body"':design.theme.bodyFont==="serif"?'Georgia':'Arial';
  const style = { "--p":design.theme.paper, "--i":design.theme.ink, "--c":design.theme.coral, "--a":design.theme.acid, "--b":design.theme.blue,"--mini-heading":heading,"--mini-body":body } as CSSProperties;
  const fontCss=[design.theme.headingFontAsset&&`@font-face{font-family:"Mini Custom Heading";src:url("${design.theme.headingFontAsset.url}") format("${design.theme.headingFontAsset.format}");font-display:swap}`,design.theme.bodyFontAsset&&`@font-face{font-family:"Mini Custom Body";src:url("${design.theme.bodyFontAsset.url}") format("${design.theme.bodyFontAsset.format}");font-display:swap}`].filter(Boolean).join("");
  return <div className={`mini-site mini-${design.theme.headingFont} mini-${design.theme.corners}`} style={style}><style>{fontCss}</style><header><b>✦ KNOW NOTHING DAILY</b><span>{socialLinks.filter(link=>link.placement!=="footer").map(link=>link.label).join(" · ")||"MENU · SEARCH"}</span></header>{design.sectionOrder.filter(key=>key.startsWith("custom:")?design.customSections.find(section=>`custom:${section.id}`===key)?.enabled:design.visibility[key as keyof typeof design.visibility]).map(key=>{
    if(key==="hero")return <section className="mini-hero" key={key}><small>{design.hero.eyebrow}</small><h3>{design.hero.titleBefore} <em>{design.hero.titleAccent}</em> {design.hero.titleAfter}</h3><p>{design.hero.deck}</p><i>{design.hero.prompt}</i></section>;
    if(key==="manifesto")return <section className="mini-manifesto" key={key}><small>{design.manifesto.eyebrow}</small><h3>{design.manifesto.title} <em>{design.manifesto.accent}</em></h3><p>{design.manifesto.lead}</p></section>;
    if(key==="archive")return <section className="mini-archive" key={key}><small>{design.archive.eyebrow}</small><h3>{design.archive.title}</h3><div className={design.archive.layout}>{[1,2,3].map(item=><span key={item}><b>0{item}</b><i>Discovery title</i></span>)}</div></section>;
    const custom=design.customSections.find(section=>`custom:${section.id}`===key);return custom?<section className={`mini-custom ${custom.tone}`} key={key}><small>{custom.eyebrow}</small><h3>{custom.title}</h3><p>{custom.body}</p></section>:null;
  })}<footer>{socialLinks.filter(link=>link.placement!=="header").map(link=>link.label).join(" · ")||"ONE NEW THING · EVERY DAY"}</footer></div>;
}
