const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();await p.goto('https://www.siena.cx/qa-agent',{waitUntil:'load'});await p.waitForTimeout(2500);
await p.addStyleTag({content:'.cky-consent-container,.cky-overlay{display:none!important}'});
for(let v=0;v<=900;v+=300){await p.evaluate(v=>scrollTo(0,v),v);await p.waitForTimeout(300)}
console.log('gallery',await p.evaluate(async()=>{const s=document.querySelector('[data-framer-name="Complete Coverage"]');const ul=s.querySelector('ul');const g=()=>new DOMMatrix(getComputedStyle(ul).transform).m41;const a=g();await new Promise(r=>setTimeout(r,2000));const b=g();return {speed:((b-a)/2).toFixed(1),n:ul.children.length,mask:getComputedStyle(ul.parentElement).maskImage}}));
// leaderboard over time
for(let v=900;v<=2700;v+=300){await p.evaluate(v=>scrollTo(0,v),v);await p.waitForTimeout(300)}
const lb=()=>p.evaluate(()=>{const s=document.querySelector('[data-framer-name="Leaderboard"]');const tabs=[...s.querySelectorAll('[data-framer-name^="Tab"]')].map(t=>t.getAttribute('data-framer-name')+':'+getComputedStyle(t).backgroundColor.replace('rgb','')+':'+t.textContent.slice(0,8));const chip=s.querySelector('[data-framer-name="Chip/Filter"]');return tabs.join(' | ')+' => '+(chip?chip.textContent:'')+' / '+[...s.querySelectorAll('[data-framer-name="Container"] p')].slice(2,4).map(e=>e.textContent).join(';')});
for(let i=0;i<4;i++){console.log('t'+i*3,await lb());await p.waitForTimeout(3000)}
const tabs=p.locator('[data-framer-name="Leaderboard"] [data-framer-name^="Tab"]');
await tabs.nth(2).hover();await p.waitForTimeout(600);console.log('hover tab3',await lb());
await tabs.nth(2).click();await p.waitForTimeout(800);console.log('click tab3',await lb());
// cards hover
for(let v=2700;v<=3500;v+=300){await p.evaluate(v=>scrollTo(0,v),v);await p.waitForTimeout(300)}
for(const n of ['Slack','Icons','Notes']){const c=p.locator(`[data-framer-name="${n}"]`).first();const st=()=>c.evaluate(e=>[...e.querySelectorAll('*')].filter(x=>x.offsetWidth>40).map(x=>{const cs=getComputedStyle(x);return (x.getAttribute('data-framer-name')||x.tagName)+':'+(+cs.opacity).toFixed(2)+':'+(cs.transform==='none'?'':cs.transform.slice(0,40))}).filter(s=>!/:1.00:$/.test(s)).join(' '));
 const a=await st();await c.hover();await p.waitForTimeout(900);const bb=await st();console.log(n,'\n before:',a,'\n after:',bb);await p.mouse.move(5,5);await p.waitForTimeout(500);}
await b.close()})();
