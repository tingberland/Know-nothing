"use client";

import { useMemo, useState } from "react";
import { normalizeSiteSettings, type CustomSection, type SiteDesign } from "@/lib/site-settings";

type Props = { settings: Record<string, unknown>; canEdit: boolean; onSaved: () => Promise<void> };
const coreNames: Record<string, string> = { hero: "Hero introduction", manifesto: "Philosophy", archive: "Learning archive" };

export function VisualController({ settings, canEdit, onSaved }: Props) {
  const initial = useMemo(() => normalizeSiteSettings(settings.site).design, [settings]);
  const [design, setDesign] = useState<SiteDesign>(initial);
  const [saving, setSaving] = useState(false);
  const [panel, setPanel] = useState<"sections" | "content" | "theme">("sections");

  function update<K extends keyof SiteDesign>(key: K, value: SiteDesign[K]) { setDesign(current => ({ ...current, [key]: value })); }
  function updateTheme<K extends keyof SiteDesign["theme"]>(key: K, value: SiteDesign["theme"][K]) { update("theme", { ...design.theme, [key]: value }); }
  function updateBlock<K extends "hero" | "manifesto" | "archive">(block: K, key: keyof SiteDesign[K], value: SiteDesign[K][keyof SiteDesign[K]]) {
    update(block, { ...design[block], [key]: value } as SiteDesign[K]);
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
    const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ design }) });
    const result = await response.json(); setSaving(false);
    if (!response.ok) { alert(result.error); return; }
    await onSaved();
  }

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
      <div className="design-tabs" role="tablist">{([['sections','Sections'],['content','Words & layout'],['theme','Theme']] as const).map(([id,label]) => <button role="tab" aria-selected={panel===id} className={panel===id?"active":""} onClick={()=>setPanel(id)} key={id}>{label}</button>)}</div>
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
        <fieldset><legend>Typography & rhythm</legend><div className="form-two"><label>Heading personality<select value={design.theme.headingFont} onChange={event=>updateTheme("headingFont",event.target.value as SiteDesign["theme"]["headingFont"])}><option value="editorial">Editorial serif</option><option value="modern">Modern sans</option><option value="humanist">Warm humanist</option></select></label><label>Body type<select value={design.theme.bodyFont} onChange={event=>updateTheme("bodyFont",event.target.value as SiteDesign["theme"]["bodyFont"])}><option value="sans">Clean sans</option><option value="serif">Literary serif</option></select></label><label>Section spacing<select value={design.theme.density} onChange={event=>updateTheme("density",event.target.value as SiteDesign["theme"]["density"])}><option value="airy">Airy</option><option value="balanced">Balanced</option><option value="compact">Compact</option></select></label><label>Corner style<select value={design.theme.corners} onChange={event=>updateTheme("corners",event.target.value as SiteDesign["theme"]["corners"])}><option value="sharp">Sharp editorial</option><option value="soft">Soft rounded</option></select></label></div></fieldset>
      </div>}
    </section>
    <aside className="design-preview-wrap"><div className="preview-label"><span>LIVE PREVIEW</span><a href="/" target="_blank">Open full site ↗</a></div><MiniPreview design={design}/></aside>
  </div>;
}

function MiniPreview({ design }: { design: SiteDesign }) {
  const style = { "--p":design.theme.paper, "--i":design.theme.ink, "--c":design.theme.coral, "--a":design.theme.acid, "--b":design.theme.blue } as React.CSSProperties;
  return <div className={`mini-site mini-${design.theme.headingFont} mini-${design.theme.corners}`} style={style}><header><b>✦ KNOW NOTHING DAILY</b><span>MENU · SEARCH</span></header>{design.sectionOrder.filter(key=>key.startsWith("custom:")?design.customSections.find(section=>`custom:${section.id}`===key)?.enabled:design.visibility[key as keyof typeof design.visibility]).map(key=>{
    if(key==="hero")return <section className="mini-hero" key={key}><small>{design.hero.eyebrow}</small><h3>{design.hero.titleBefore} <em>{design.hero.titleAccent}</em> {design.hero.titleAfter}</h3><p>{design.hero.deck}</p><i>{design.hero.prompt}</i></section>;
    if(key==="manifesto")return <section className="mini-manifesto" key={key}><small>{design.manifesto.eyebrow}</small><h3>{design.manifesto.title} <em>{design.manifesto.accent}</em></h3><p>{design.manifesto.lead}</p></section>;
    if(key==="archive")return <section className="mini-archive" key={key}><small>{design.archive.eyebrow}</small><h3>{design.archive.title}</h3><div className={design.archive.layout}>{[1,2,3].map(item=><span key={item}><b>0{item}</b><i>Discovery title</i></span>)}</div></section>;
    const custom=design.customSections.find(section=>`custom:${section.id}`===key);return custom?<section className={`mini-custom ${custom.tone}`} key={key}><small>{custom.eyebrow}</small><h3>{custom.title}</h3><p>{custom.body}</p></section>:null;
  })}<footer>{design.theme.acid} · ONE NEW THING</footer></div>;
}
