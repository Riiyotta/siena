// usage: node ev.cjs <url> <width> <jsfile>  -> prints JSON result of evaluating function body in jsfile
const {chromium}=require('playwright');const fs=require('fs');
const [,,url,w,js]=process.argv;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:+w,height:+w>800?900:844}});const p=await ctx.newPage();
await p.goto(url,{waitUntil:'networkidle',timeout:90000});await p.waitForTimeout(1200);
await p.evaluate(()=>{document.querySelectorAll('[class*="cky"]').forEach(e=>e.remove())});
const H=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<H;y+=600){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(80)}await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(600);
const r=await p.evaluate(fs.readFileSync(js,'utf8'));console.log(typeof r==='string'?r:JSON.stringify(r,null,1));await b.close();})();
