const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/partner-with-siena',{waitUntil:'load',timeout:60000});await p.waitForTimeout(2000);
const r=await p.evaluate(()=>[...document.querySelectorAll('[data-framer-name]')].filter(e=>getComputedStyle(e).backgroundImage.startsWith('url("data:image/svg')&&e.getBoundingClientRect().width>0).map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,u:getComputedStyle(e).backgroundImage.slice(5,-2)})));
const names=['partner-ltvplus.svg','partner-prive.svg'];r.forEach((x,i)=>{const svg=decodeURIComponent(x.u.replace(/^data:image\/svg\+xml,/,'').replace(/%22/g,'"'));fs.writeFileSync('/Users/riyaghosh/V3/siena/public/svg/'+(names[i]||'partner-datauri-'+i+'.svg'),svg);console.log(names[i],x.w,x.h,svg.length)});
await b.close()})()
