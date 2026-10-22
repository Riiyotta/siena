// node tstates.cjs route W y "t1,t2,.." sectionName  -> screenshots + visible texts within section at times (ms) after reaching y
const {chromium}=require('playwright');const fs=require('fs');
const [route,W,y,ts,sec]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:+W,height:+W>800?900:844}})).newPage();
 await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:90000});await p.waitForTimeout(3000);
 await p.addStyleTag({content:'.cky-consent-container,.cky-overlay,.cky-btn-revisit-wrapper{display:none!important}'});
 for(let v=0;v<+y;v+=300){await p.evaluate(v=>scrollTo(0,v),v);await p.waitForTimeout(250);}await p.evaluate(v=>scrollTo(0,v),+y);
 const t0=Date.now();const out=[];
 for(const t of ts.split(',').map(Number)){const w=t-(Date.now()-t0);if(w>0)await p.waitForTimeout(w);
   await p.screenshot({path:`/Users/riyaghosh/V3/siena/recon/pages-a/states/${route}-${W}-y${y}-t${t}.jpg`,type:'jpeg',quality:60});
   const txt=await p.evaluate(sec=>{const s=[...document.querySelectorAll('[data-framer-name]')].find(e=>e.getAttribute('data-framer-name')===sec&&e.offsetHeight>0)||document.body;const res=[];
     s.querySelectorAll('*').forEach(e=>{const d=[...e.childNodes].filter(c=>c.nodeType===3&&c.textContent.trim()).map(c=>c.textContent.trim()).join(' ');if(!d)return;const r=e.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight||!r.width)return;let op=1,n=e;while(n&&n!==document.body){op*=+getComputedStyle(n).opacity;n=n.parentElement}if(op<0.05)return;res.push(`${Math.round(r.x)},${Math.round(r.y)} op${op.toFixed(2)} "${d.slice(0,100)}"`)});return res.join('\n')},sec||'');
   out.push('=== t='+t+'\n'+txt);}
 fs.writeFileSync(`/Users/riyaghosh/V3/siena/recon/pages-a/states/${route}-${W}-y${y}.tstates.txt`,out.join('\n'));console.log(out.join('\n'));await b.close();})();
