const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/about-us',{waitUntil:'load',timeout:60000});await p.waitForTimeout(1500);
await p.screenshot({path:'about-hero-1440.png'});
for(const [i,y] of [[0,900],[1,3200],[2,5400],[3,7500]]){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(1500);await p.screenshot({path:`about-hscroll-${i}.png`})}
await b.close()})()
