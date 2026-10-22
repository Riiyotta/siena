const {chromium}=require('playwright');const fs=require('fs');
const route=process.argv[2];const W=+process.argv[3]||1440;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:900}});
await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:60000});await p.waitForTimeout(2500);
await p.evaluate(()=>{const s=[...document.querySelectorAll('section')].find(s=>getComputedStyle(s).maskImage!=='none'&&s.getBoundingClientRect().height>0);s.scrollIntoView({block:'center'})});await p.waitForTimeout(800);
const r=await p.evaluate(async()=>{const secs=[...document.querySelectorAll('section')].filter(s=>getComputedStyle(s).maskImage!=='none'&&s.getBoundingClientRect().height>0);
 const read=()=>secs.map(s=>{const ul=s.querySelector('ul');const m=new DOMMatrix(getComputedStyle(ul).transform);return [m.m41,m.m42]});
 const a=read();const t0=performance.now();await new Promise(r=>setTimeout(r,1000));const bb=read();const dt=(performance.now()-t0)/1000;
 return secs.map((s,i)=>{const ul=s.querySelector('ul');const li=ul.children;const first=ul.querySelector('li')||li[0];
  const items=[...ul.querySelectorAll('li')];const cards=[];const set=items[0];
  const cardEls=[...set.querySelectorAll('[data-border="true"]')];
  const cs=cardEls[0]?getComputedStyle(cardEls[0]):null;const af=cardEls[0]?getComputedStyle(cardEls[0],'::after'):null;
  const sr=s.getBoundingClientRect();
  return {i,x:sr.left,w:sr.width,h:sr.height,mask:getComputedStyle(s).maskImage,lis:items.length,liH:items.map(l=>Math.round(l.getBoundingClientRect().height)),ulGap:getComputedStyle(ul).gap,speed:[(bb[i][0]-a[i][0])/dt,(bb[i][1]-a[i][1])/dt],
   card:cs&&{w:cardEls[0].getBoundingClientRect().width,h:cardEls[0].getBoundingClientRect().height,bg:cs.backgroundColor,pad:cs.padding,rad:cs.borderRadius,gap:cs.gap,sh:cs.boxShadow,border:af.borderWidth+' '+af.borderStyle+' '+af.borderColor},
   hoverPause:null,
   items:cardEls.map(c=>{const ps=[...c.querySelectorAll('p')];const img=c.querySelector('img');return {text:ps[0]?.innerText,name:ps[1]?.innerText,handle:ps[2]?.innerText,icon:ps[3]?'U+'+ps[3].textContent.charCodeAt(0).toString(16).toUpperCase():null,img:img?img.currentSrc.split('/').pop().split('?')[0]+' '+img.naturalWidth+'x'+img.naturalHeight:null,h:Math.round(c.getBoundingClientRect().height),font:getComputedStyle(ps[0]).fontFamily.split(',')[0]+' '+getComputedStyle(ps[0]).fontWeight+' '+getComputedStyle(ps[0]).fontSize+'/'+getComputedStyle(ps[0]).lineHeight}})}})});
// hover pause test
const sec=await p.$$('section');let hp=[];
const first=(await p.$$eval('section',ss=>ss.map((s,i)=>getComputedStyle(s).maskImage!=='none'&&s.getBoundingClientRect().height>0?i:-1).filter(i=>i>=0)))[0];
const box=await sec[first].boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.waitForTimeout(300);
const y1=await sec[first].evaluate(s=>new DOMMatrix(getComputedStyle(s.querySelector('ul')).transform).m42);await p.waitForTimeout(1000);const y2=await sec[first].evaluate(s=>new DOMMatrix(getComputedStyle(s.querySelector('ul')).transform).m42);
console.log('hover speed px/s',y2-y1);
fs.writeFileSync(`${route}-wall-${W}.json`,JSON.stringify(r,null,1));
r.forEach(c=>{console.log('COL',c.i,'x',c.x,'w',c.w,'h',c.h,'lis',c.lis,c.liH.join(','),'gap',c.ulGap,'speed',c.speed.map(v=>v.toFixed(1)).join(','),'\n mask',c.mask,'\n card',JSON.stringify(c.card));c.items.forEach(it=>console.log('  -',JSON.stringify(it)))});
await b.close()})()
