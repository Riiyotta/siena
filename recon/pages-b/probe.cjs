const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});const t=Date.now();
p.goto('https://www.siena.cx/order-tracking',{waitUntil:'commit'}).then(()=>console.log('commit',Date.now()-t));
p.on('load',()=>console.log('load',Date.now()-t));p.on('domcontentloaded',()=>console.log('dcl',Date.now()-t));
await p.waitForTimeout(30000);console.log(await p.evaluate(()=>[document.documentElement.scrollHeight,document.title,document.readyState]));
await b.close();})();
