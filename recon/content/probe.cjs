const {chromium}=require('playwright');
const fs=require('fs');
const routes=process.argv[2].split(',');
const widths=(process.argv[3]||'1440,390').split(',').map(Number);
const OUT='/Users/riyaghosh/V3/siena/recon/content/out';
(async()=>{
 const b=await chromium.launch();
 for(const r of routes){
  for(const w of widths){
   const ctx=await b.newContext({viewport:{width:w,height:w>800?900:844},deviceScaleFactor:1});
   const p=await ctx.newPage();
   const reqs=[];
   p.on('response',res=>{const u=res.url();const t=res.request().resourceType();if(['image','media','font'].includes(t)||/\.(svg|png|jpe?g|webp|gif|mp4|webm|avif)/.test(u))reqs.push({u,t,ct:res.headers()['content-type']})});
   const name=(r.replace(/^\//,'').replace(/\//g,'__')||'home')+'-'+w;
   try{await p.goto('https://www.siena.cx'+r,{waitUntil:'networkidle',timeout:60000});}catch(e){console.log('nav',e.message)}
   await p.waitForTimeout(1500);
   // dismiss cookie
   await p.evaluate(()=>{document.querySelectorAll('.cky-consent-container,.cky-overlay').forEach(e=>e.remove())});
   const H=await p.evaluate(()=>document.documentElement.scrollHeight);
   for(let y=0;y<H;y+=600){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(120);}
   await p.waitForTimeout(1200);
   await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(800);
   await p.screenshot({path:`${OUT}/../${name}.png`,fullPage:true});
   const html=await p.content(); fs.writeFileSync(`${OUT}/${name}.html`,html);
   fs.writeFileSync(`${OUT}/${name}-net.json`,JSON.stringify(reqs,null,1));
   console.log(name,'H',H,'reqs',reqs.length);
   await ctx.close();
  }
 }
 await b.close();
})();
