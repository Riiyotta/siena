const {chromium}=require('playwright');const fs=require('fs');
const OUT='/Users/riyaghosh/V3/siena/recon/pages-a/';
const route=process.argv[2];const W=+process.argv[3]||1440;const VH=W>800?900:844;
(async()=>{
 const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:W,height:VH}})).newPage();
 await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:90000});await p.waitForTimeout(4000);
 await p.addStyleTag({content:'.cky-consent-container,.cky-overlay,.cky-btn-revisit-wrapper{display:none!important}'});
 const cap=()=>p.evaluate(()=>{const o={};const all=document.querySelectorAll('#main *');all.forEach((e,i)=>{const cs=getComputedStyle(e);if(cs.display==='none')return;const r=e.getBoundingClientRect();
   o[i]=[cs.opacity,cs.transform==='none'?'':cs.transform,Math.round(r.width),Math.round(r.height),cs.filter==='none'?'':cs.filter,cs.backgroundColor,cs.color,Math.round(r.top)]});return o});
 const names=await p.evaluate(()=>[...document.querySelectorAll('#main *')].map(e=>(e.getAttribute('data-framer-name')||e.tagName)+(e.children.length?'':':'+(e.textContent||'').trim().slice(0,30))));
 const H=await p.evaluate(()=>document.documentElement.scrollHeight);
 const series=[];
 for(let y=0;y<=H-VH+100;y+=100){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(350);series.push([y,await cap()]);}
 // summarize changes vs scroll (excluding pure top changes for non-sticky)
 const res=[];const keys=Object.keys(series[0][1]);
 const fields=['op','tf','w','h','filter','bg','color'];
 for(const k of keys){for(let f=0;f<7;f++){let prev=null,ch=[];for(const [y,o] of series){const v=o[k]?o[k][f]:'(none)';if(prev!==null&&v!==prev)ch.push(y+':'+v);prev=v;}
   if(ch.length&&ch.length<60) res.push(`#${k} ${names[k]} ${fields[f]} start=${series[0][1][k]?series[0][1][k][f]:''} -> ${ch.slice(0,25).join(' | ')}${ch.length>25?' ...('+ch.length+')':''}`);}}
 fs.writeFileSync(OUT+route+'-'+W+'.scroll.txt',res.join('\n'));
 // time sampling at a few positions given as args or every 900px
 const tres=[];
 const pos=[];for(let y=0;y<H;y+=VH) pos.push(y);
 for(const y of pos){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(600);const t=[];const t0=Date.now();
   for(let i=0;i<24;i++){t.push([Date.now()-t0,await cap()]);await p.waitForTimeout(250);}
   for(const k of Object.keys(t[0][1])){for(let f=0;f<7;f++){if(f===3||f===2)continue;let prev=null,ch=[];for(const [ms,o] of t){const v=o[k]?o[k][f]:'(none)';if(prev!==null&&v!==prev)ch.push(ms+'ms:'+v);prev=v;}
     if(ch.length) tres.push(`@y${y} #${k} ${names[k]} ${fields[f]} start=${t[0][1][k]?t[0][1][k][f]:''} -> ${ch.slice(0,12).join(' | ')}${ch.length>12?' ...('+ch.length+')':''}`);}}
 }
 fs.writeFileSync(OUT+route+'-'+W+'.time.txt',tres.join('\n'));
 await b.close();console.log(route,W,'ok');
})().catch(e=>{console.error(route,e.message);process.exit(1)});
