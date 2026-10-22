const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();
await Promise.all(['about-us','careers','customers','community','events','partner-with-siena','refer-a-friend'].map(async r=>{
for(const W of [1440,390]){
const p=await b.newPage({viewport:{width:W,height:900}});await p.goto('https://www.siena.cx/'+r,{waitUntil:'load',timeout:60000});await p.waitForTimeout(1500);
const H=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<H;y+=600){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(80)}await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(300);
const o=await p.evaluate(()=>{
 const nav=[...document.querySelectorAll('nav')].find(n=>n.getBoundingClientRect().height>0);
 const navLinks=nav?[...nav.querySelectorAll('a')].filter(a=>a.getBoundingClientRect().height>0).map(a=>(a.innerText||'').replace(/\s+/g,' ').trim()+' -> '+a.getAttribute('href')):[];
 const main=[...document.querySelectorAll('div[data-framer-name=Main]')].find(e=>e.getBoundingClientRect().height>0);
 const mb=main?main.getBoundingClientRect().bottom+scrollY:-1;
 const foot=[...document.querySelectorAll('footer,[data-framer-name=Footer]')].find(e=>e.getBoundingClientRect().height>0);
 const ft=foot?foot.getBoundingClientRect().top+scrollY:null;
 // collect visible text elements & images between main bottom and footer top
 const items=[];document.querySelectorAll('h1,h2,h3,h4,h5,p,a,img,[data-framer-name]').forEach(e=>{const rr=e.getBoundingClientRect();const y=rr.top+scrollY;if(rr.height>0&&y>=mb-5&&(ft==null||y<ft-1)){const c=getComputedStyle(e);items.push(e.tagName+'['+(e.getAttribute('data-framer-name')||'')+'] '+Math.round(rr.left)+','+Math.round(y)+' '+Math.round(rr.width)+'x'+Math.round(rr.height)+' '+(e.tagName==='IMG'?(e.currentSrc.split('/').pop().split('?')[0]+' nat'+e.naturalWidth+'x'+e.naturalHeight+' fit:'+c.objectFit):'"'+(e.childNodes[0]?.nodeType===3?e.childNodes[0].textContent.trim().slice(0,100):'')+'"')+(e.tagName==='A'?' href='+e.getAttribute('href'):'')+' bg:'+c.backgroundColor+(c.backgroundImage!=='none'?' bgi:'+c.backgroundImage.slice(0,140):'')+' pad:'+c.padding+' rad:'+c.borderRadius+(/H\d|P/.test(e.tagName)?' font:'+c.fontFamily.split(',')[0]+' '+c.fontWeight+' '+c.fontSize+'/'+c.lineHeight+' ls'+c.letterSpacing+' '+c.color+' '+c.textAlign:''))}});
 return {navVariant:nav?.getAttribute('data-framer-name'),navLinks,mainBottom:mb,footerTop:ft,H:document.documentElement.scrollHeight,items}});
console.log('== '+r+' '+W+' '+JSON.stringify({nv:o.navVariant,mb:o.mainBottom,ft:o.footerTop,H:o.H}));console.log(' nav: '+o.navLinks.join(' | '));o.items.forEach(i=>console.log('  '+i));
await p.close()}}));
await b.close()})()
