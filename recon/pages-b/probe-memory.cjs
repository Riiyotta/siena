const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/memory',{waitUntil:'load'});await p.waitForTimeout(3000);
await p.evaluate(()=>document.querySelectorAll('.cky-consent-container,.cky-overlay').forEach(e=>e.remove()));
// ticker speed hero
const tick=async(sel)=>p.evaluate(async(sel)=>{const ul=document.querySelectorAll('ul')[sel];const r0=ul.firstElementChild.getBoundingClientRect().x;await new Promise(r=>setTimeout(r,2000));const r1=ul.firstElementChild.getBoundingClientRect().x;return {ulY:ul.getBoundingClientRect().y+scrollY,dxPerSec:(r1-r0)/2,cs:getComputedStyle(ul).transform, mask:getComputedStyle(ul.parentElement).maskImage+' | '+getComputedStyle(ul.parentElement.parentElement).maskImage, gap:getComputedStyle(ul).gap, n:ul.children.length}},sel);
console.log('ULs',await p.evaluate(()=>[...document.querySelectorAll('ul')].map(u=>[Math.round(u.getBoundingClientRect().y+scrollY),u.children.length,getComputedStyle(u).gap])));
console.log('ticker0',await tick(0));
// hero logos detail
console.log(await p.evaluate(()=>{const ul=document.querySelectorAll('ul')[0];return [...ul.children].slice(0,ul.children.length/2|0).map(li=>{const e=li.querySelector('img,svg,[style*=background-image],div');const bb=li.getBoundingClientRect();const img=li.querySelector('img');return [Math.round(bb.width),Math.round(bb.height),img?img.src.split('/').pop().split('?')[0]:(li.querySelector('svg')?'svg':(li.innerHTML.includes('data:image/svg')?'datauri':'?')),li.querySelector('[data-framer-name]')?.getAttribute('data-framer-name')]})}));
// scroll to memory in action
await p.evaluate(()=>window.scrollTo(0,3300));await p.waitForTimeout(1500);
const cardsX=()=>p.evaluate(()=>[...document.querySelectorAll('[data-framer-name="9 / Hair Type"]')].map(e=>Math.round(e.getBoundingClientRect().x)));
console.log('cards t0',await cardsX());await p.waitForTimeout(4000);console.log('cards t4s',await cardsX());
// card internals
console.log(await p.evaluate(()=>{const c=document.querySelector('[data-framer-name="9 / Hair Type"]');const walk=(e,d)=>{const s=getComputedStyle(e);const bb=e.getBoundingClientRect();let o=`${' '.repeat(d)}${e.tagName} ${e.getAttribute('data-framer-name')||''} [${Math.round(bb.x)},${Math.round(bb.y)},${Math.round(bb.width)},${Math.round(bb.height)}] ${s.display==='flex'?s.flexDirection+' gap'+s.gap+' jc'+s.justifyContent:''} p:${s.padding} bd:${s.borderTopWidth} ${s.borderTopColor} bg:${s.backgroundColor} sh:${s.boxShadow} op:${s.opacity}\n`;if(e.tagName!=='svg')[...e.children].forEach(k=>o+=walk(k,d+1));return o};return walk(c,0)}));
// fieldset arrows
const fs=await p.evaluate(()=>{const f=document.querySelector('fieldset');return f?f.outerHTML.slice(0,1500):null});console.log('fieldset',fs);
// click next and sample
const btns=await p.$$('fieldset button');console.log('btns',btns.length);
if(btns.length){const samp=p.evaluate(async()=>{const c=document.querySelector('[data-framer-name="9 / Hair Type"]');const o=[];const t0=performance.now();return await new Promise(r=>{const f=()=>{const t=performance.now()-t0;o.push([Math.round(t),Math.round(c.getBoundingClientRect().x)]);if(t<1500)requestAnimationFrame(f);else r(o)};f()})});await p.waitForTimeout(50);await btns[btns.length-1].click();console.log('next anim',JSON.stringify(await samp));}
// hover a card
const c=await p.$('[data-framer-name="10 / Milestones"]');await c.hover();await p.waitForTimeout(600);
console.log('hover',await p.evaluate(()=>{const c=document.querySelector('[data-framer-name="10 / Milestones"]');const s=getComputedStyle(c);return [s.transform,s.boxShadow,s.backgroundColor]}));
await b.close();})();
