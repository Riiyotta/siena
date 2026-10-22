const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();await p.goto('https://www.siena.cx/ask-siena',{waitUntil:'load'});await p.waitForTimeout(2500);
await p.addStyleTag({content:'.cky-consent-container,.cky-overlay{display:none!important}'});
for(let v=0;v<=7800;v+=300){await p.evaluate(v=>scrollTo(0,v),v);await p.waitForTimeout(150)}
await p.evaluate(()=>{const t=[...document.querySelectorAll('p')].find(e=>e.textContent.includes('huge win'));let n=t;for(let i=0;i<14;i++){n=n.parentElement;if(n.querySelectorAll('button').length>=2){n.setAttribute('data-probe','testi');break}}
const t2=[...document.querySelectorAll('p')].find(e=>e.textContent.includes('Executive Report'));let m=t2;for(let i=0;i<16;i++){m=m.parentElement;if(m.querySelectorAll('button').length>=2){m.setAttribute('data-probe','play');break}}});
for(const [k,txt] of [['testi','huge win'],['play','Executive Report']]){
 await p.locator(`[data-probe="${k}"]`).scrollIntoViewIfNeeded();await p.waitForTimeout(800);
 const pr=p.evaluate(async([k,txt])=>{const s=document.querySelector(`[data-probe="${k}"]`);const t0=performance.now();const o=[];let prev='';await new Promise(r=>{const f=()=>{const els=[...s.querySelectorAll('p,h6')].filter(e=>/huge win|wanted a tool|Executive Report|Journey Review/.test(e.textContent)&&e.children.length===0);const v=els.map(e=>{const r=e.getBoundingClientRect();let op=1,n=e;while(n&&n!==s){op*=+getComputedStyle(n).opacity;n=n.parentElement}return e.textContent.slice(0,12)+'@x'+Math.round(r.x)+'/op'+op.toFixed(2)}).join(' ');if(v!==prev){o.push(Math.round(performance.now()-t0)+' '+v);prev=v}if(performance.now()-t0<1200)requestAnimationFrame(f);else r()};f()});return o},[k,txt]);
 await p.locator(`[data-probe="${k}"] button`).last().click();const o=await pr;console.log('==',k,o.length);console.log(o.filter((x,i)=>i%2==0||i==o.length-1).slice(0,30).join('\n'));}
await b.close()})();
