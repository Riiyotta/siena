const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/memory',{waitUntil:'load'});await p.waitForTimeout(3000);
console.log('hero ticker',await p.evaluate(async()=>{const ul=[...document.querySelectorAll('ul')].find(u=>u.children.length>50);const li=ul.children[0];const x0=li.getBoundingClientRect().x;await new Promise(r=>setTimeout(r,2000));const x1=li.getBoundingClientRect().x;
 const items=[...ul.children].map(li=>{const bb=li.getBoundingClientRect();const img=li.querySelector('img');const n=li.querySelector('[data-framer-name]')?.getAttribute('data-framer-name');return [Math.round(bb.width),Math.round(bb.height),img?img.src.split('/').pop().split('?')[0]:(li.querySelector('svg')?'svg':'bg'),n]});
 const sec=ul.closest('section');return {speed:(x1-x0)/2,mask:getComputedStyle(sec).maskImage||getComputedStyle(sec).webkitMaskImage,secH:sec.getBoundingClientRect().height,items:items.slice(0,items.length/2)}}));
await p.evaluate(()=>window.scrollTo(0,3300));await p.waitForTimeout(500);
console.log('autoplay',JSON.stringify(await p.evaluate(async()=>{const c=document.querySelector('[data-framer-name="9 / Hair Type"]');const o=[];const t0=performance.now();let last=null;return await new Promise(r=>{const f=()=>{const t=performance.now()-t0;const x=Math.round(c.getBoundingClientRect().x);if(x!==last){o.push([Math.round(t),x]);last=x}if(t<9000)requestAnimationFrame(f);else r(o)};f()})})));
// testimonial slider next click
const tb=await p.$$('button[aria-label]');console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].map(b=>[b.getAttribute('aria-label'),Math.round(b.getBoundingClientRect().y+scrollY)])));
await b.close();})();
