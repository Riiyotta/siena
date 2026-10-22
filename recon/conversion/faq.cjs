const {chromium}=require('playwright');const fs=require('fs');
const [,,url,slug,w]=process.argv;const W=+(w||1440);
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:W>800?900:844}});const p=await ctx.newPage();
await p.goto(url,{waitUntil:'networkidle',timeout:90000});await p.waitForTimeout(1000);
await p.evaluate(()=>{document.querySelectorAll('[class*="cky"]').forEach(e=>e.remove())});
const out={};
out.faq=await p.evaluate(()=>{const f=document.querySelector('[data-framer-name="FAQ"]');f.scrollIntoView({block:'center'});
 const items=[...f.querySelectorAll('img')].map(img=>{const head=img.parentElement;const item=head.parentElement;const ans=item.children[1];
  return {q:head.innerText.trim(),a:ans?ans.innerText.trim():'',icon:img.src.split('/').pop().split('?')[0]}});
 return {items,html:f.outerHTML.replace(/class="[^"]*"/g,'').slice(0,3500)}});
await p.waitForTimeout(800);
// click 2nd question and sample
const heads=await p.$$('[data-framer-name="FAQ"] img');
await p.evaluate(()=>{window.__f=[];const f=document.querySelector('[data-framer-name="FAQ"]');const imgs=[...f.querySelectorAll('img')];const it1=imgs[0].parentElement.parentElement,it2=imgs[1].parentElement.parentElement;const t0=performance.now();
 const g=()=>{const a1=it1.children[1],a2=it2.children[1];window.__f.push([Math.round(performance.now()-t0),Math.round(it1.getBoundingClientRect().height),a1?getComputedStyle(a1).opacity:'-',a1?Math.round(a1.getBoundingClientRect().height):0,Math.round(it2.getBoundingClientRect().height),a2?getComputedStyle(a2).opacity:'-',a2?Math.round(a2.getBoundingClientRect().height):0,getComputedStyle(imgs[1]).transform,imgs[1].src.split('/').pop().split('?')[0].slice(0,6),getComputedStyle(imgs[1].parentElement).backgroundColor,a2?getComputedStyle(a2).transition:''].join(' '));if(performance.now()-t0<1500)requestAnimationFrame(g)};window.__go=()=>requestAnimationFrame(g)});
await p.evaluate(()=>window.__go());await heads[1].click();await p.waitForTimeout(1700);
out.timeline=await p.evaluate(()=>window.__f.filter((x,i,a)=>i===0||x.split(' ').slice(1).join(' ')!==a[i-1].split(' ').slice(1).join(' ')));
// hover state on a header
await heads[2].hover();await p.waitForTimeout(400);
out.hover=await heads[2].evaluate(e=>{const h=e.parentElement;const s=getComputedStyle(h);return {bg:s.backgroundColor,c:s.color,cursor:s.cursor,tr:s.transition}});
await p.screenshot({path:`${slug}-faq-${W}.png`,fullPage:false});
// styles
out.styles=await p.evaluate(()=>{const f=document.querySelector('[data-framer-name="FAQ"]');const img=f.querySelector('img');const head=img.parentElement,item=head.parentElement,ans=item.children[1];const S=e=>{const s=getComputedStyle(e);return {style:e.getAttribute('style'),ff:s.fontFamily,fs:s.fontSize,lh:s.lineHeight,fw:s.fontWeight,c:s.color}};const q=head.firstElementChild||head;return {item:S(item),head:S(head),q:S(q),ans:S(ans),ansInner:ans.firstElementChild?S(ans.firstElementChild):null,img:img.getAttribute('style'),wrap:S(item.parentElement)}});
fs.writeFileSync(`faq-${slug}-${W}.json`,JSON.stringify(out,null,1));await b.close();})();
