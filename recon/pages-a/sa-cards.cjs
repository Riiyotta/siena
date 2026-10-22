const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
 await p.goto('https://www.siena.cx/shopping-agent',{waitUntil:'load',timeout:90000});await p.waitForTimeout(3000);
 await p.addStyleTag({content:'.cky-consent-container,.cky-overlay{display:none!important}'});
 const sec=p.locator('[data-framer-name="Your team of expert agents"]').first();await sec.scrollIntoViewIfNeeded();await p.waitForTimeout(800);
 const info=await sec.evaluate(s=>{const g=s.querySelector('[data-framer-name="Card grid"]');return {cards:[...g.children].map(c=>{const r=c.getBoundingClientRect();return Math.round(r.x)+':'+(c.querySelector('h6')||{}).textContent+':'+((c.querySelector('img')||{}).src||'').split('/').pop().split('?')[0]}),scrollW:g.scrollWidth,ovf:getComputedStyle(g).overflowX}});
 console.log(JSON.stringify(info,null,0));
 const icons=sec.locator('[data-framer-name="Navigation"] [data-framer-name="Icon"]');
 for(let k=0;k<4;k++){
  const tr=await p.evaluate(async()=>{const s=document.querySelector('[data-framer-name="Your team of expert agents"]');const g=s.querySelector('[data-framer-name="Card grid"]');const out=[];const t0=performance.now();
   await new Promise(r=>{const f=()=>{const t=performance.now()-t0;out.push(Math.round(t)+':'+Math.round(g.children[0].getBoundingClientRect().x)+'/'+g.scrollLeft);if(t<1200)requestAnimationFrame(f);else r()};window.__go=f;r()});return 'ready'});
  const pr=p.evaluate(async()=>{const s=document.querySelector('[data-framer-name="Your team of expert agents"]');const g=s.querySelector('[data-framer-name="Card grid"]');const out=[];const t0=performance.now();let prev='';
   await new Promise(r=>{const f=()=>{const t=performance.now()-t0;const v=Math.round(g.children[0].getBoundingClientRect().x)+'/'+Math.round(g.scrollLeft)+' ops:'+[...s.querySelectorAll('[data-framer-name="Navigation"] [data-framer-name="Icon"]')].map(i=>getComputedStyle(i).opacity).join(',');if(v!==prev){out.push(Math.round(t)+'ms '+v);prev=v;}if(t<1500)requestAnimationFrame(f);else r()};f()});return out.join(' | ')});
  await p.waitForTimeout(50);await icons.nth(1).click();console.log('click next',k,await pr);
 }
 // hover a card
 const c=sec.locator('[data-framer-name="Card grid"] > *').nth(1);
 const before=await c.evaluate(e=>{const cs=getComputedStyle(e);return cs.transform+' '+cs.boxShadow+' '+cs.backgroundColor});await c.hover();await p.waitForTimeout(800);
 const after=await c.evaluate(e=>{const cs=getComputedStyle(e);return cs.transform+' '+cs.boxShadow+' '+cs.backgroundColor});console.log('hover',before,'=>',after);
 await b.close();})();
