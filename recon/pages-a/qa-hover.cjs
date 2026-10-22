const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();await p.goto('https://www.siena.cx/qa-agent',{waitUntil:'load'});await p.waitForTimeout(2500);
await p.addStyleTag({content:'.cky-consent-container,.cky-overlay{display:none!important}'});
for(let v=0;v<=3400;v+=300){await p.evaluate(v=>scrollTo(0,v),v);await p.waitForTimeout(250)}await p.waitForTimeout(1500);
for(const t of ['Slack notifications','Help desk tasks','Internal notes']){
 const card=p.locator(`text=${t}`).first().locator('xpath=ancestor::div[contains(@style,"border-radius") or @data-framer-name][3]');
 const h=await p.locator(`text=${t}`).first().evaluate(e=>{let n=e;for(let i=0;i<6;i++){n=n.parentElement;if(n.offsetWidth===325)break}n.setAttribute('data-probe','1');return n.getAttribute('data-framer-name')});
 const c=p.locator('[data-probe="1"]');
 const st=()=>c.evaluate(e=>[...e.querySelectorAll('*')].filter(x=>x.offsetWidth>20).map(x=>{const cs=getComputedStyle(x);return (x.getAttribute('data-framer-name')||x.tagName)+':'+(+cs.opacity).toFixed(2)+':'+(cs.transform==='none'?'':cs.transform.replace('matrix','m').slice(0,50))}).filter(s=>!/:1.00:$/.test(s)).join(' '));
 const a=await st();await c.hover();await p.waitForTimeout(1000);const bb=await st();console.log(t,'['+h+']\n before:',a,'\n after:',bb);
 const tt=await p.evaluate(async()=>{const e=document.querySelector('[data-probe="1"]');const els=[...e.querySelectorAll('*')];const t0=performance.now();return 'n/a'});
 await p.mouse.move(5,5);await p.waitForTimeout(800);console.log(' afterLeave:',await st());
 await c.evaluate(e=>e.removeAttribute('data-probe'));}
await b.close()})();
