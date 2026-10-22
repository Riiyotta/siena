const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();await p.goto('https://www.siena.cx/ask-siena',{waitUntil:'load'});await p.waitForTimeout(2500);
await p.addStyleTag({content:'.cky-consent-container,.cky-overlay{display:none!important}'});
const go=async y=>{const cur=await p.evaluate(()=>scrollY);for(let v=cur;v<y;v+=300){await p.evaluate(v=>scrollTo(0,v),v);await p.waitForTimeout(200)}await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(1200)};
// sticky chip nav
for(const y of [900,1300,2200,3200,4300,5800,7000,8000]){await go(y);console.log('chip@'+y,await p.evaluate(()=>{const s=[...document.querySelectorAll('#main div')].find(e=>getComputedStyle(e).position==='sticky'&&getComputedStyle(e).top==='88px');const c=s.firstElementChild;const h=c.firstElementChild.getBoundingClientRect();return c.getAttribute('data-framer-name')+' top:'+Math.round(s.getBoundingClientRect().top)+' w:'+Math.round(c.offsetWidth)+' hl:'+Math.round(h.x)+'/'+Math.round(h.width)}))}
await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(500);
// sliders: find containers having buttons + counter
await go(7000);
const read=async(sel)=>p.evaluate(sel=>{const s=document.querySelector(sel);if(!s)return 'none';const sr=s.getBoundingClientRect();return [...s.querySelectorAll('p,span,img,h6')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.left>=sr.left-5&&r.right<=sr.right+5&&(e.tagName!=='SPAN'||e.children.length===0)}).map(e=>e.tagName==='IMG'?'IMG:'+e.src.split('/').pop().split('?')[0]+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height):e.textContent.trim()).filter(Boolean).join(' || ')},sel);
// mark testimonial container: ancestor of text 'huge win'
await p.evaluate(()=>{const t=[...document.querySelectorAll('p')].find(e=>e.textContent.includes('huge win'));let n=t;for(let i=0;i<14;i++){n=n.parentElement;if(n.querySelectorAll('button').length>=2){n.setAttribute('data-probe','testi');break}}
const t2=[...document.querySelectorAll('p')].find(e=>e.textContent.includes('Executive Report'));let m=t2;for(let i=0;i<16;i++){m=m.parentElement;if(m.querySelectorAll('button').length>=2){m.setAttribute('data-probe','play');break}}});
for(const k of ['testi','play']){const btns=p.locator(`[data-probe="${k}"] button`);const n=await btns.count();console.log('==',k,'buttons',n,'\nS0',await read(`[data-probe="${k}"]`));
 for(let i=1;i<5;i++){await btns.nth(n-1).click();await p.waitForTimeout(900);console.log('S'+i,await read(`[data-probe="${k}"]`))}}
await b.close()})();
