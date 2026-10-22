const {chromium}=require('playwright');
const [r,w,...names]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+w>800?900:844}});
await p.goto('https://www.siena.cx/'+r,{waitUntil:'load',timeout:120000});await p.waitForTimeout(3000);
await p.evaluate(()=>document.querySelectorAll('.cky-consent-container,.cky-overlay').forEach(e=>e.remove()));
for(const spec of names){const [n,idx]=spec.split('@');const els=(await p.$$(`[data-framer-name="${n}"]`));const el=els[+(idx||0)];if(!el){console.log('NF',n);continue}
 await el.scrollIntoViewIfNeeded();await p.waitForTimeout(3500);await el.screenshot({path:`${r.replace(/\//g,'_')}-${w}-sec-${n.replace(/\W+/g,'_')}${idx?'-'+idx:''}.png`}).catch(e=>console.log('fail',n,e.message));}
await b.close()})();
