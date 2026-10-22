const {chromium}=require('playwright');const fs=require('fs');
const OUT='/Users/riyaghosh/V3/siena/recon/pages-b/';
const r=process.argv[2];const w=+(process.argv[3]||1440);
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:w,height:w>800?900:844}});const page=await ctx.newPage();
await page.goto('https://www.siena.cx/'+r,{waitUntil:'load',timeout:90000});await page.waitForTimeout(3500);
const snap=()=>page.evaluate(()=>{const o=[];document.querySelectorAll('#main *').forEach(e=>{const c=getComputedStyle(e);const bb=e.getBoundingClientRect();if(bb.width<10||bb.height<10)return;
 const op=+c.opacity;const tf=c.transform;const id=e.getAttribute('data-framer-appear-id');
 if(op<0.99||tf!=='none'||id||c.animationName!=='none'||(c.transitionDuration!=='0s'&&c.transitionProperty!=='all'))o.push({n:e.getAttribute('data-framer-name')||e.tagName,id,b:[Math.round(bb.x),Math.round(bb.y+scrollY),Math.round(bb.width),Math.round(bb.height)],op:c.opacity,tf:tf==='none'?undefined:tf,an:c.animationName!=='none'?c.animationName+' '+c.animationDuration+' '+c.animationTimingFunction:undefined,tr:c.transitionDuration!=='0s'?c.transitionProperty+' '+c.transitionDuration+' '+c.transitionTimingFunction:undefined,wc:c.willChange!=='auto'?c.willChange:undefined,txt:(e.innerText||'').slice(0,40)})});return o});
const s0=await snap();
const H=await page.evaluate(()=>document.documentElement.scrollHeight);
for(let y=0;y<H+1000;y+=250){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(150);}
await page.waitForTimeout(1500);
const s1=await snap();
fs.writeFileSync(OUT+`${r.replace(/\//g,'_')}-${w}-motion.json`,JSON.stringify({s0,s1}));
console.log(s0.length,s1.length);await b.close();})();
