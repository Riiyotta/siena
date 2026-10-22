const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();
 // record h1 on load for sentiment page
 await p.goto('https://www.siena.cx/insights/sentiment-analysis-online',{waitUntil:'commit'});
 const h1t=[];const t0=Date.now();
 for(let i=0;i<60;i++){const s=await p.evaluate(()=>{const h=document.querySelector('h1');if(!h)return null;let e=h;for(let k=0;k<3&&e;k++){if(e.style&&e.style.willChange)break;e=e.parentElement;}const c=getComputedStyle(e||h);return c.opacity+' '+c.transform}).catch(()=>null);h1t.push([Date.now()-t0,s]);await p.waitForTimeout(40);}
 console.log('H1 timeline',JSON.stringify(h1t.filter((x,i)=>i%3==0)));
 await p.waitForLoadState('networkidle').catch(()=>{});
 await p.evaluate(()=>{document.querySelectorAll('.cky-consent-container,.cky-overlay').forEach(e=>e.remove())});
 // bubbles
 const sel='[data-framer-name="Image - portait"]';
 const st0=await p.evaluate(sel=>{const c=document.querySelector(sel);const ws=[...c.querySelectorAll('[style*="will-change"]')];return ws.map(w=>w.getAttribute('style'))},sel);
 console.log('bubbles before view',st0);
 const y=await p.evaluate(sel=>document.querySelector(sel).getBoundingClientRect().top+scrollY,sel);
 await p.evaluate(y=>window.scrollTo(0,y-500),y);
 const tl=[];const t1=Date.now();
 for(let i=0;i<70;i++){const s=await p.evaluate(sel=>[...document.querySelector(sel).querySelectorAll('[style*="will-change"]')].map(w=>{const c=getComputedStyle(w);return (+c.opacity).toFixed(2)+'|'+c.transform.replace('matrix(1, 0, 0, 1, ','').replace(')','')}),sel);tl.push([Date.now()-t1,s.join('  ')]);await p.waitForTimeout(40);}
 tl.forEach((x,i)=>{if(i%2==0)console.log(x[0],x[1])});
 // feature rows: check any opacity/transform changes on scroll for images
 await b.close();
})();
