const {chromium}=require('playwright');const [route,W]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:+W,height:+W>800?900:844}})).newPage();
await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:90000});await p.waitForTimeout(3000);
await p.addStyleTag({content:'.cky-consent-container,.cky-overlay,.cky-btn-revisit-wrapper{display:none!important}'});
const H=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<H;y+=300){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(100)}await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(1500);
await p.screenshot({path:`/Users/riyaghosh/V3/siena/recon/pages-a/${route}-${W}.png`,fullPage:true,timeout:120000});await b.close();console.log('ok',route,W)})();
