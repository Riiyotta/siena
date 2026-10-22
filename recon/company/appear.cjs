const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
await Promise.all(['about-us','careers','customers','community','events','partner-with-siena','refer-a-friend'].map(async r=>{
const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto('https://www.siena.cx/'+r,{waitUntil:'load',timeout:60000});await p.waitForTimeout(500);
const o=await p.evaluate(()=>[...document.querySelectorAll('[data-framer-appear-id]')].map(e=>{const rr=e.getBoundingClientRect();return e.getAttribute('data-framer-appear-id')+' '+e.tagName+'['+(e.getAttribute('data-framer-name')||'')+'] y='+Math.round(rr.top+scrollY)+' '+Math.round(rr.width)+'x'+Math.round(rr.height)+' "'+(e.innerText||'').replace(/\s+/g,' ').slice(0,70)+'"'}));
console.log('== '+r+'\n'+o.join('\n'));await p.close()}));
await b.close()})()
