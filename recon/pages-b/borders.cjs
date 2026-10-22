const {chromium}=require('playwright');const fs=require('fs');
const routes=process.argv[2].split(',');const w=+(process.argv[3]||1440);
(async()=>{const b=await chromium.launch();for(const r of routes){const p=await b.newPage({viewport:{width:w,height:w>800?900:844}});
await p.goto('https://www.siena.cx/'+r,{waitUntil:'load',timeout:120000});await p.waitForTimeout(3000);
const H=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<H;y+=500){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(100);}await p.waitForTimeout(1500);
const o=await p.evaluate(()=>{const rgb=c=>{const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return c;const p=m[1].split(',').map(x=>+x);const h='#'+p.slice(0,3).map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();return p.length>3&&p[3]!==1?`${h}/${p[3]}`:h};
 const seen=new Set();return [...document.querySelectorAll('#main [data-border]')].filter(e=>!e.closest('nav')).map(e=>{const a=getComputedStyle(e,'::after');const bb=e.getBoundingClientRect();let n=null,x=e;while(x&&!n){n=x.getAttribute&&x.getAttribute('data-framer-name');x=x.parentElement}
 const key=`${n} ${Math.round(bb.width)}x${Math.round(bb.height)} ${a.borderTopWidth} ${a.borderRightWidth} ${a.borderBottomWidth} ${a.borderLeftWidth} ${a.borderTopStyle} ${rgb(a.borderTopColor)} r:${a.borderRadius}`;if(seen.has(key))return null;seen.add(key);return `y${Math.round(bb.y+scrollY)} x${Math.round(bb.x)} ${key} txt:${(e.textContent||'').slice(0,40)}`}).filter(Boolean)});
fs.writeFileSync(`/Users/riyaghosh/V3/siena/recon/pages-b/${r.replace(/\//g,'_')}-${w}-borders.txt`,o.join('\n'));console.log(r,o.length);await p.close()}await b.close()})();
