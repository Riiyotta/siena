const {chromium}=require('playwright');
const route=process.argv[2];const W=+(process.argv[3]||1440);
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:W,height:W>800?900:844}})).newPage();
 await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:90000});await p.waitForTimeout(3500);
 await p.addStyleTag({content:'.cky-consent-container,.cky-overlay{display:none!important}'});
 // ticker speeds
 const sp=await p.evaluate(async()=>{const uls=[...document.querySelectorAll('[data-framer-name="Ticker"] ul')].filter(u=>u.offsetWidth);const g=()=>uls.map(u=>new DOMMatrix(getComputedStyle(u).transform).m41);const a=g();const t0=performance.now();await new Promise(r=>setTimeout(r,2000));const bb=g();const dt=(performance.now()-t0)/1000;
   return uls.map((u,i)=>({speed:((bb[i]-a[i])/dt).toFixed(1),gap:getComputedStyle(u).gap,mask:getComputedStyle(u.parentElement).maskImage||getComputedStyle(u.parentElement).webkitMaskImage,n:u.children.length,first:[...u.querySelectorAll('img')].slice(0,3).map(i=>i.alt).join('/')}))});
 console.log('TICKERS',JSON.stringify(sp));
 // nav threshold
 const nav=[];for(let y=0;y<=260;y+=20){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(350);nav.push(y+':'+await p.evaluate(()=>{const n=[...document.querySelectorAll('nav [data-framer-name="Desktop"],nav [data-framer-name="Main"]')].find(e=>e.offsetHeight>0);const d=document.querySelector('nav');const x=[...document.querySelectorAll('nav *')].find(e=>e.offsetHeight===64&&e.offsetWidth>1000)||d;return getComputedStyle(x).backgroundColor}));}
 console.log('NAV',nav.join(' '));
 // testimonials
 const secs=await p.$$('[data-framer-name="Testimonials"]');
 for(const [si,s] of secs.entries()){ if(!(await s.isVisible())) continue;
   await s.scrollIntoViewIfNeeded();await p.waitForTimeout(800);
   const btns=await s.$$('button');const read=()=>s.evaluate(s=>{const vis=[...s.querySelectorAll('p,span,img')].filter(e=>{const r=e.getBoundingClientRect();const sr=s.getBoundingClientRect();return r.width>0&&r.left>=sr.left-5&&r.right<=sr.right+5&&r.bottom>0});
     return vis.map(e=>e.tagName==='IMG'?'IMG:'+e.src.split('/').pop().split('?')[0]+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height):e.textContent.trim()).filter(Boolean).join(' || ')});
   console.log('TESTI'+si+' btns='+btns.length+' S0:',await read());
   if(btns.length>=2){for(let k=1;k<12;k++){await btns[btns.length-1].click();await p.waitForTimeout(900);const t=await read();console.log(' S'+k+':',t);if(/^1\b|\|\| 1 \|\|/.test(t)&&k>1)break;}}
 }
 await b.close();})();
