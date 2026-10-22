// node svgx.cjs <url> <route> <w> ; extracts inline SVGs (resolving <use>) + data-URI svg backgrounds at scroll 0 and at each sticky block
const {chromium}=require('playwright');const fs=require('fs');const crypto=require('crypto');
const [,,url,route,w]=process.argv;const W=+(w||1440);
const OUT='/Users/riyaghosh/V3/siena/recon/conversion/svgdump/';
const grab=`(()=>{const res=[];const seen=new Set();
 const anc=e=>{const a=[];let p=e.parentElement;while(p&&a.length<3){const n=p.getAttribute&&p.getAttribute('data-framer-name');if(n&&n.length<40)a.push(n);p=p.parentElement}return a};
 const resolve=svg=>{const c=svg.cloneNode(true);c.setAttribute('xmlns','http://www.w3.org/2000/svg');c.removeAttribute('style');c.removeAttribute('class');
  const r=svg.getBoundingClientRect();c.setAttribute('width',Math.round(r.width*100)/100);c.setAttribute('height',Math.round(r.height*100)/100);
  let guard=0;let uses;while((uses=c.querySelectorAll('use')).length&&guard++<5){uses.forEach(u=>{const id=(u.getAttribute('href')||u.getAttribute('xlink:href')||'').slice(1);const ref=document.getElementById(id);if(!ref){u.remove();return}let n;if(ref.tagName.toLowerCase()==='symbol'){n=document.createElementNS('http://www.w3.org/2000/svg','g');[...ref.childNodes].forEach(k=>n.appendChild(k.cloneNode(true)))}else{n=ref.cloneNode(true);n.removeAttribute('id')}u.replaceWith(n)})}
  const ids=new Set();const scan=()=>{(c.outerHTML.match(/url\\(#([^)\"']+)\\)/g)||[]).forEach(m=>ids.add(m.slice(5,-1)))};scan();
  if(ids.size){const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');ids.forEach(id=>{if(c.querySelector('[id="'+id+'"]'))return;const ref=document.getElementById(id);if(ref)defs.appendChild(ref.cloneNode(true))});if(defs.childNodes.length)c.insertBefore(defs,c.firstChild)}
  return c.outerHTML};
 document.querySelectorAll('svg').forEach(s=>{const r=s.getBoundingClientRect();if(r.width<4||r.height<4)return;if(s.closest('[data-framer-name="Menu Area"]')||s.closest('nav'))return;if(getComputedStyle(s).visibility==='hidden')return;
  const html=resolve(s);if(seen.has(html))return;seen.add(html);res.push({kind:'svg',a:anc(s),w:Math.round(r.width),h:Math.round(r.height),y:Math.round(r.top+scrollY),html,color:getComputedStyle(s).color})});
 document.querySelectorAll('*').forEach(e=>{const b=getComputedStyle(e).backgroundImage;if(!b.startsWith('url("data:image/svg'))return;const r=e.getBoundingClientRect();if(r.width<4)return;if(e.closest('nav'))return;const u=decodeURIComponent(b.slice(5,-2).replace(/^data:image\\/svg\\+xml[^,]*,/,''));if(seen.has(u))return;seen.add(u);res.push({kind:'bg',a:[e.getAttribute('data-framer-name')||'',...anc(e)],w:Math.round(r.width),h:Math.round(r.height),y:Math.round(r.top+scrollY),html:u,bgsize:getComputedStyle(e).backgroundSize,bgrep:getComputedStyle(e).backgroundRepeat})});
 return res})()`;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:W>800?900:844}});const p=await ctx.newPage();
await p.goto(url,{waitUntil:'networkidle',timeout:90000});await p.waitForTimeout(1200);
await p.evaluate(()=>{document.querySelectorAll('[class*="cky"]').forEach(e=>e.remove())});
let all=await p.evaluate(grab);
const blocks=await p.evaluate(()=>{const c=document.querySelector('[data-framer-name="Scroll Area"] [data-framer-name="Content"]');return c?[...c.children].map(k=>k.getBoundingClientRect().top+scrollY+450-450+k.getBoundingClientRect().height/2-450):[]});
for(const y of blocks){await p.evaluate(y=>scrollTo(0,y),Math.round(y));await p.waitForTimeout(3000);all=all.concat(await p.evaluate(grab))}
const seen=new Set();const out=[];
for(const s of all){const h=crypto.createHash('md5').update(s.html).digest('hex').slice(0,8);if(seen.has(h))continue;seen.add(h);
 const nm=(s.a.filter(Boolean).slice(0,2).join('-')||'svg').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);
 const file=`${route}-${nm}-${h}.svg`;fs.writeFileSync(OUT+file,s.html.startsWith('<svg')?s.html:s.html);out.push({file,kind:s.kind,a:s.a.join(' < '),w:s.w,h:s.h,y:s.y,color:s.color,bgsize:s.bgsize,bgrep:s.bgrep,len:s.html.length})}
fs.writeFileSync(`svgx-${route}-${W}.json`,JSON.stringify(out,null,1));console.log(route,W,out.length);await b.close();})();
