const {chromium}=require('playwright');const fs=require('fs');
const OUT='/Users/riyaghosh/V3/siena/recon/pages-b/';
const [r,w]=[process.argv[2],+process.argv[3]];
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:w,height:w>800?900:844}});const page=await ctx.newPage();
await page.goto('https://www.siena.cx/'+r,{waitUntil:'load',timeout:90000});await page.waitForTimeout(3000);
const H=await page.evaluate(()=>document.documentElement.scrollHeight);
for(let y=0;y<H+1000;y+=400){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(100);}
await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(500);
const res=await page.evaluate((W)=>{const out=[];
 const walk=(e,d)=>{if(d>14)return;const c=getComputedStyle(e);if(c.display==='none')return;const bb=e.getBoundingClientRect();
  if(bb.width>=W*0.5&&bb.height>=40&&!e.closest('nav')&&!e.closest('svg')){const n=e.getAttribute('data-framer-name');
   out.push(`${'  '.repeat(Math.min(d,14))}${n||e.tagName.toLowerCase()}${e.id?'#'+e.id:''} [${Math.round(bb.x)},${Math.round(bb.y+scrollY)},${Math.round(bb.width)},${Math.round(bb.height)}] ${c.display==='flex'?c.flexDirection+' gap'+c.gap+' jc:'+c.justifyContent+' ai:'+c.alignItems:c.display} pad:${c.padding} ${c.backgroundColor!=='rgba(0, 0, 0, 0)'?'bg:'+c.backgroundColor:''} ${c.backgroundImage!=='none'?'bi:'+c.backgroundImage.slice(0,200):''} ${c.borderRadius!=='0px'?'r:'+c.borderRadius:''} ${c.position!=='relative'&&c.position!=='static'?c.position+' top:'+c.top:''} ${c.overflow!=='visible'?'ov:'+c.overflow:''} ${c.maxWidth!=='none'?'maxw:'+c.maxWidth:''}`);}
  [...e.children].forEach(k=>walk(k,d+1));};
 walk(document.body,0);return out.join('\n');},w);
fs.writeFileSync(OUT+`${r.replace(/\//g,'_')}-${w}-sections.txt`,res);console.log(res.split('\n').length);await b.close();})();
