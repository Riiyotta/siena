const {chromium}=require('playwright');const fs=require('fs');
const OUT='/Users/riyaghosh/V3/siena/recon/pages-a/states/';
const route=process.argv[2];const ys=process.argv[3].split(',').map(Number);const W=+process.argv[4]||1440;const VH=W>800?900:844;
const sel=process.argv[5]||null; // optional data-framer-name of section to restrict text dump
(async()=>{
 const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:W,height:VH}})).newPage();
 await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:90000});await p.waitForTimeout(3500);
 await p.addStyleTag({content:'.cky-consent-container,.cky-overlay,.cky-btn-revisit-wrapper{display:none!important}'});
 const out=[];
 // scroll progressively to each y
 let cur=0;
 for(const y of ys){
   while(cur<y){cur=Math.min(y,cur+150);await p.evaluate(v=>window.scrollTo(0,v),cur);await p.waitForTimeout(40);}
   if(cur>y){cur=y;await p.evaluate(v=>window.scrollTo(0,v),cur);}
   await p.waitForTimeout(1600);
   await p.screenshot({path:`${OUT}${route}-${W}-${y}.jpg`,type:'jpeg',quality:60,scale:'css'});
   const t=await p.evaluate(()=>{const res=[];const vh=innerHeight;
     document.querySelectorAll('#main *').forEach(e=>{const direct=[...e.childNodes].filter(c=>c.nodeType===3&&c.textContent.trim()).map(c=>c.textContent.trim()).join(' ');
       if(!direct||e.closest('nav')) return;const r=e.getBoundingClientRect();if(r.bottom<0||r.top>vh||r.width===0)return;
       let op=1,n=e;while(n&&n!==document.body){const cs=getComputedStyle(n);if(cs.display==='none'||cs.visibility==='hidden'){op=0;break;}op*=+cs.opacity;n=n.parentElement;}
       if(op<0.05)return;res.push(`${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} op${op.toFixed(2)} "${direct.slice(0,90)}"`)});return res});
   out.push('=== y='+y+'\n'+t.join('\n'));
 }
 fs.writeFileSync(`${OUT}${route}-${W}.states.txt`,out.join('\n'));await b.close();console.log('ok');
})();
