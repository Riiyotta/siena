const {chromium}=require('playwright');const fs=require('fs');
const route=process.argv[2];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:60000});await p.waitForTimeout(2500);
await p.evaluate(()=>document.querySelectorAll('[class*=cky]').forEach(e=>e.remove()));
const t=p.locator('[data-framer-name="Testimonial"]').first();await t.scrollIntoViewIfNeeded();
const total=+(await p.evaluate(()=>[...document.querySelectorAll('span')].find(s=>/^\/ \d+$/.test(s.textContent.trim())).textContent.replace('/','').trim()));
const slides=[];
for(let i=0;i<total;i++){
 const s=await p.evaluate(()=>{const ts=[...document.querySelectorAll('[data-framer-name="Testimonial"]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.left>=0&&r.left<1440&&getComputedStyle(e).opacity!=='0'});const e=ts.sort((a,b)=>Math.abs(a.getBoundingClientRect().left-200)-Math.abs(b.getBoundingClientRect().left-200))[0];
  const ps=[...e.querySelectorAll('p,h1,h2,h3,h4,h5,h6')].map(x=>x.innerText.trim()).filter(Boolean);const imgs=[...e.querySelectorAll('img')].map(i=>i.currentSrc.split('/').pop().split('?')[0]+' '+Math.round(i.getBoundingClientRect().width)+'x'+Math.round(i.getBoundingClientRect().height));const a=[...e.querySelectorAll('a')].map(a=>a.getAttribute('href')+' "'+a.innerText.trim()+'"');return {ps,imgs,a,counter:[...document.querySelectorAll('span')].filter(s=>/^\d+$/.test(s.textContent.trim())&&s.nextElementSibling&&/^\//.test(s.nextElementSibling.textContent.trim())).map(s=>s.textContent).join()}});
 slides.push(s);
 const next=p.locator('button:has(svg)').filter({has:p.locator('xpath=.')});
 await p.evaluate(()=>{const span=[...document.querySelectorAll('span')].find(s=>/^\/ \d+$/.test(s.textContent.trim()));const btns=span.closest('div').parentElement.querySelectorAll('button');btns[btns.length-1].click()});await p.waitForTimeout(1200);
}
fs.writeFileSync(route+'-slides.json',JSON.stringify(slides,null,1));slides.forEach((s,i)=>console.log(i+1,'ctr',s.counter,JSON.stringify(s.ps).slice(0,500),'|',s.imgs.join(', '),'|',s.a.join(' ')));
await b.close()})()
