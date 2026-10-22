const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/careers',{waitUntil:'load',timeout:60000});await p.waitForTimeout(2000);
const n=await p.evaluate(()=>document.querySelectorAll('[data-framer-name="Open roles"] button').length);
const all=[];
for(let i=0;i<n;i++){
 await p.evaluate(i=>{const bs=[...document.querySelectorAll('[data-framer-name="Open roles"] button')];bs.forEach(b=>{if(b.getAttribute('aria-expanded')==='true')b.click()});},i);await p.waitForTimeout(400);
 await p.evaluate(i=>document.querySelectorAll('[data-framer-name="Open roles"] button')[i].click(),i);await p.waitForTimeout(600);
 const r=await p.evaluate(i=>{const bt=document.querySelectorAll('[data-framer-name="Open roles"] button')[i];const panel=document.getElementById(bt.getAttribute('aria-controls'));const pc=getComputedStyle(panel);const bs=[...document.querySelectorAll('[data-framer-name="Open roles"] button')].map(b=>b.getAttribute('aria-expanded'));
 return {dept:bt.innerText.replace(/\n/g,' | '),exp:bs.join(','),panel:{h:panel.getBoundingClientRect().height,pad:pc.padding,ov:pc.overflow,tr:pc.transition,bg:pc.backgroundColor},roles:[...panel.querySelectorAll('a')].map(a=>{const c=getComputedStyle(a);const sp=[...a.querySelectorAll('span,svg')].map(s=>{const k=getComputedStyle(s);return s.tagName+'|'+(s.textContent||'').trim()+'|'+k.fontFamily.split(',')[0]+' '+k.fontWeight+' '+k.fontSize+'/'+k.lineHeight+' '+k.color+' ml:'+k.marginLeft+' w:'+Math.round(s.getBoundingClientRect().width)});return {href:a.href,text:a.innerText.replace(/\n/g,' | '),h:a.getBoundingClientRect().height,pad:c.padding,bb:c.borderBottom,bt:c.borderTop,disp:c.display+' '+c.justifyContent+' gap:'+c.gap+' tr:'+c.transition,sp}})}},i);
 all.push(r);
}
fs.writeFileSync('careers-roles.json',JSON.stringify(all,null,1));
console.log(JSON.stringify(all,null,1).slice(0,5000));
// hover a role link
await p.evaluate(()=>document.querySelectorAll('[data-framer-name="Open roles"] button')[0].click());await p.waitForTimeout(600);
const a=await p.$('[data-framer-name="Open roles"] a[href*="ashbyhq.com/siena/"]');const bb=await a.boundingBox();
await p.mouse.move(bb.x+300,bb.y+bb.height/2);await p.waitForTimeout(400);
console.log('role hover',await a.evaluate(e=>getComputedStyle(e).backgroundColor+' '+[...e.querySelectorAll('span,svg')].map(x=>getComputedStyle(x).color+'/'+getComputedStyle(x).transform+'/'+getComputedStyle(x).textDecorationLine).join(',')));
const svgs=await p.evaluate(()=>{const r=document.querySelector('[data-framer-name="Open roles"]');return {chev:r.querySelector('button svg').outerHTML,arrow:r.querySelector('a[href*="ashbyhq.com/siena/"] svg')?.outerHTML,style:[...r.querySelectorAll('style')].map(s=>s.textContent).join('\n').slice(0,4000)}});
console.log(JSON.stringify(svgs,null,1));
fs.writeFileSync('/Users/riyaghosh/V3/siena/recon/company/careers-svgs.json',JSON.stringify(svgs));
await p.evaluate(()=>{const e=document.querySelector('[data-framer-name="Open roles"]');scrollTo(0,e.getBoundingClientRect().top+scrollY-120)});await p.waitForTimeout(500);await p.screenshot({path:'careers-roles-open.png'});
await b.close()})()
