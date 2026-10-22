const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/order-tracking',{waitUntil:'load'});await p.waitForTimeout(3000);
const H=await p.evaluate(()=>document.documentElement.scrollHeight);console.log('H',H);
for(let y=0;y<H;y+=600){const t=Date.now();await Promise.race([p.evaluate(y=>window.scrollTo(0,y),y),new Promise(r=>setTimeout(()=>r('TO'),10000))]).then(v=>v&&console.log('timeout at',y));console.log(y,Date.now()-t);}
await b.close();process.exit(0)})();
