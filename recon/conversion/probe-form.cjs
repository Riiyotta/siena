// usage: node probe-form.cjs <url> <slug>  -- inspects Framer form states without final submit
const {chromium}=require('playwright');const fs=require('fs');
const [,,url,slug]=process.argv;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();
await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
await p.evaluate(()=>{document.querySelectorAll('[class*="cky"]').forEach(e=>e.remove())});
const out={};
const field=async(name)=>p.evaluate(name=>{const i=document.querySelector(`[name="${name}"]`);if(!i)return null;const lab=i.closest('label');const s=getComputedStyle(i);const spans=[...lab.querySelectorAll('span,p')].filter(x=>x.innerText.trim());
 const anc=[];let e=i;for(let k=0;k<3;k++){e=e.parentElement;const cs=getComputedStyle(e);anc.push({tag:e.tagName,bg:cs.backgroundColor,sh:cs.boxShadow,rad:cs.borderRadius,tr:cs.transition,r:[...Object.values(e.getBoundingClientRect().toJSON())].slice(0,4).map(Math.round)})}
 return {inp:{tag:i.tagName,ff:s.fontFamily,fs:s.fontSize,lh:s.lineHeight,fw:s.fontWeight,c:s.color,p:s.padding,bg:s.backgroundColor,sh:s.boxShadow,tr:s.transition,h:i.getBoundingClientRect().height,caret:s.caretColor},
 labelBefore:getComputedStyle(i,'::placeholder').color,
 spans:spans.map(x=>{const c=getComputedStyle(x);const r=x.getBoundingClientRect();return {t:x.innerText,fs:c.fontSize,lh:c.lineHeight,c:c.color,op:c.opacity,tf:c.transform,tr:c.transition,y:Math.round(r.y),x:Math.round(r.x)}}),anc}},name);
const textNames=await p.evaluate(()=>[...document.querySelectorAll('form input:not([type=hidden]):not([tabindex="-1"]), form textarea')].filter(i=>i.name).map(i=>i.name));
out.textNames=textNames;
out.default={};for(const n of textNames)out.default[n]=await field(n);
const first=textNames[0];
await p.focus(`[name="${first}"]`);await p.waitForTimeout(700);out.focus=await field(first);
await p.keyboard.type('Jane Test');await p.waitForTimeout(300);out.typed=await field(first);
await p.focus(`[name="${textNames[1]}"]`);await p.waitForTimeout(700);out.blurFilled=await field(first);
// Hover over an input
await p.hover(`[name="${textNames[2]||textNames[1]}"]`);await p.waitForTimeout(500);out.hover=await field(textNames[2]||textNames[1]);
// dropdown buttons
const dds=await p.$$('form button[type=button]');out.dropdowns=[];
for(const d of dds){if(!(await d.isVisible()))continue;const txt=await d.innerText();if(/Next|Previous|Back/.test(txt))continue;
 const st=await d.evaluate(e=>{const s=getComputedStyle(e);return {txt:e.innerText,bg:s.backgroundColor,sh:s.boxShadow,p:s.padding,rad:s.borderRadius,h:e.getBoundingClientRect().height}});
 await d.click();await p.waitForTimeout(700);
 const pan=await p.evaluate(()=>{const opts=[...document.querySelectorAll('[role="option"],[role="menuitemcheckbox"],[role="checkbox"],[role="menuitemradio"]')].filter(o=>o.getBoundingClientRect().width>0);
  if(!opts.length){return {html:document.activeElement.outerHTML.slice(0,500)}}
  let list=opts[0].parentElement;while(list&&getComputedStyle(list).boxShadow==='none'&&list!==document.body)list=list.parentElement;const ls=getComputedStyle(list);const lr=list.getBoundingClientRect();
  const o=opts[0];const os=getComputedStyle(o);const box=o.querySelector('input,span,div');
  return {panel:{bg:ls.backgroundColor,sh:ls.boxShadow,rad:ls.borderRadius,p:ls.padding,r:[lr.x,lr.y,lr.width,lr.height].map(Math.round),tr:ls.transition,op:ls.opacity,tf:ls.transform},
   opt:{p:os.padding,h:o.getBoundingClientRect().height,ff:os.fontFamily,fs:os.fontSize,lh:os.lineHeight,c:os.color,gap:os.gap,bg:os.backgroundColor,role:o.getAttribute('role')},
   options:opts.map(o=>o.innerText.trim()), optHTML:o.outerHTML.replace(/class="[^"]*"/g,'').slice(0,1500)}});
 const after=await d.evaluate(e=>{const s=getComputedStyle(e);return {bg:s.backgroundColor,sh:s.boxShadow,spans:[...e.querySelectorAll('span')].map(x=>{const c=getComputedStyle(x);return x.innerText+'|'+c.fontSize+'|'+c.lineHeight+'|'+c.color+'|'+c.transform+'|'+c.opacity})}});
 // hover first option
 const o1=await p.$('[role="option"],[role="menuitemcheckbox"],[role="checkbox"]');let hov=null;
 if(o1){await o1.hover();await p.waitForTimeout(300);hov=await o1.evaluate(e=>getComputedStyle(e).backgroundColor);}
 out.dropdowns.push({st,pan,after,optHoverBg:hov});
 await p.screenshot({path:`${slug}-dd-${out.dropdowns.length}.png`,clip:{x:600,y:0,width:840,height:900}});
 await p.keyboard.press('Escape');await p.mouse.click(5,890);await p.waitForTimeout(400);}
fs.writeFileSync(`probe-form-${slug}.json`,JSON.stringify(out,null,1));
await b.close();})();
