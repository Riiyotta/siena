const {chromium}=require('playwright');
const routes=process.argv[2].split(',');const widths=(process.argv[3]||'1440,390').split(',').map(Number);
(async()=>{
 const b=await chromium.launch();
 for(const r of routes)for(const w of widths){
  const ctx=await b.newContext({viewport:{width:w,height:w>800?900:844}});const p=await ctx.newPage();
  try{await p.goto('https://www.siena.cx'+r,{waitUntil:'load',timeout:60000});}catch(e){}
  await p.waitForTimeout(2500);
  try{await p.getByRole('button',{name:/Accept All/i}).first().click({timeout:3000});}catch(e){}
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<H;y+=600){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(100);}
  await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(1500);
  const name=r.replace(/^\//,'').replace(/\//g,'__')+'-'+w;
  await p.screenshot({path:`/Users/riyaghosh/V3/siena/recon/content/${name}.png`,fullPage:true});
  console.log(name,H);await ctx.close();
 }
 await b.close();
})();
