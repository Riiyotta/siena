const {chromium}=require('playwright');const fs=require('fs');
const [,,url,slug]=process.argv;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();
await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
await p.evaluate(()=>{document.querySelectorAll('[class*="cky"]').forEach(e=>e.remove())});
const out={};
for(const [n,v] of [['fullName','Test Test'],['workEmail','test@example.com'],['companyWebsite','example.com']]){await p.fill(`[name="${n}"]`,v)}
// select goal option
await p.click('form button[type=button]');await p.waitForTimeout(400);await p.click('label:has(input[type=checkbox]:visible)');await p.keyboard.press('Escape');await p.mouse.click(10,700);
const nb=await p.$('form [data-framer-name="Next"] a, form a:has-text("Next step")');
out.nextDefault=await nb.evaluate(e=>{const s=getComputedStyle(e);return {bg:s.backgroundColor,bgi:s.backgroundImage,rad:s.borderRadius,p:s.padding,sh:s.boxShadow}});
// rAF sampling of page switch
await p.evaluate(()=>{window.__s=[];const t0=performance.now();const f=()=>{const pg=document.querySelector('[data-framer-name="Pages"]');const kids=pg?[...pg.querySelectorAll(':scope > *, :scope > * > *')].slice(0,4):[];window.__s.push([Math.round(performance.now()-t0),kids.map(k=>{const s=getComputedStyle(k);return (k.getAttribute('data-framer-name')||k.tagName)+':'+s.opacity+':'+s.transform+':'+Math.round(k.getBoundingClientRect().x)}).join(' ')]);if(performance.now()-t0<1200)requestAnimationFrame(f)};requestAnimationFrame(f)});
await nb.click();await p.waitForTimeout(1400);
out.switch=await p.evaluate(()=>window.__s.filter((x,i,a)=>i===0||x[1]!==a[i-1][1]));
out.p2=await p.evaluate(()=>[...document.querySelectorAll('form button, form a, form [data-framer-name]')].filter(e=>e.getBoundingClientRect().width>0&&/Previous|Get pricing|Book|Submit|Back/.test(e.innerText)&&e.innerText.length<30).map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();const t=e.querySelector('p')||e;const ts=getComputedStyle(t);return {tag:e.tagName,n:e.getAttribute('data-framer-name'),t:e.innerText,r:[r.x,r.y,r.width,r.height].map(Math.round),bg:s.backgroundColor,bgi:s.backgroundImage,sh:s.boxShadow,br:s.border,rad:s.borderRadius,p:s.padding,txt:ts.fontFamily.split(',')[0]+' '+ts.fontWeight+' '+ts.fontSize+'/'+ts.lineHeight+' '+ts.color}}));
const prev=await p.$('form a:has-text("Previous"), form [data-framer-name="Previous Button"] a');
if(prev){await prev.hover();await p.waitForTimeout(400);out.prevHover=await prev.evaluate(e=>{const s=getComputedStyle(e);return {bg:s.backgroundColor,bgi:s.backgroundImage,sh:s.boxShadow,c:getComputedStyle(e.querySelector('p')||e).color}});}
const sub=await p.$('form button[type=submit]');
await p.mouse.move(5,5);await p.waitForTimeout(400);out.submitDefault=await sub.evaluate(e=>{const s=getComputedStyle(e);return {bg:s.backgroundColor,bgi:s.backgroundImage,sh:s.boxShadow,op:s.opacity,c:getComputedStyle(e.querySelector('p')||e).color,html:e.outerHTML.replace(/class="[^"]*"/g,'').slice(0,800)}});
await sub.hover();await p.waitForTimeout(400);out.submitHover=await sub.evaluate(e=>{const s=getComputedStyle(e);return {bg:s.backgroundColor,bgi:s.backgroundImage,sh:s.boxShadow,op:s.opacity}});
// conditional social field: go back, select social goal
if(prev){await prev.click();await p.waitForTimeout(800);await p.click('form button[type=button]');await p.waitForTimeout(400);const labs=await p.$$('label:has(input[type=checkbox]:visible)');if(labs[3])await labs[3].click();await p.keyboard.press('Escape');await p.mouse.click(10,700);
 const nb2=await p.$('form a:has-text("Next step")');await nb2.click();await p.waitForTimeout(1000);
 out.p2social=await p.evaluate(()=>document.querySelector('form').innerText);
 const dd=await p.$$('form button[type=button]');for(const d of dd){const t=await d.innerText();if(/social/i.test(t)){await d.click();await p.waitForTimeout(500);out.socialOpts=await p.evaluate(()=>[...document.querySelectorAll('input[type=checkbox]')].filter(c=>c.getBoundingClientRect().width>0).map(c=>c.parentElement.innerText.trim()));await p.screenshot({path:`${slug}-form-page2-social.png`,clip:{x:500,y:0,width:940,height:900}});}}
}
fs.writeFileSync(`probe-p2-${slug}.json`,JSON.stringify(out,null,1));await b.close();})();
