const {chromium}=require('playwright');const fs=require('fs');const crypto=require('crypto');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/memory',{waitUntil:'load'});await p.waitForTimeout(3000);
await p.evaluate(()=>document.querySelectorAll('.cky-consent-container,.cky-overlay').forEach(e=>e.remove()));
// data-uri logos
const du=await p.evaluate(()=>{const o={};document.querySelectorAll('#main [data-framer-name]').forEach(e=>{const bi=getComputedStyle(e).backgroundImage;if(bi.startsWith('url("data:image/svg')){const n=e.getAttribute('data-framer-name');const bb=e.getBoundingClientRect();o[n+'_'+Math.round(bb.width)]=decodeURIComponent(bi.slice(5,-2).replace(/^data:image\/svg\+xml,/,'').replace(/%22/g,'"'))}});return o});
for(const [k,v] of Object.entries(du)){const f='/Users/riyaghosh/V3/siena/public/svg/memory-ticker-'+k.replace(/[^a-zA-Z0-9]+/g,'-')+'.svg';fs.writeFileSync(f,v);console.log('wrote',f,v.length)}
// cards: name -> logo svg hash
const cards=await p.evaluate(()=>{const o={};document.querySelectorAll('#main [data-framer-name*=" / "]').forEach(c=>{const n=c.getAttribute('data-framer-name');if(o[n])return;const s=c.querySelector('svg');const img=c.querySelector('img');const ic=c.querySelector('p');o[n]={title:c.querySelector('h3')?.innerText,desc:c.querySelectorAll('p')[1]?.innerText,icon:ic&&ic.innerText?ic.innerText.codePointAt(0).toString(16):null,logo:s?s.outerHTML:(img?img.src:null),logoBox:(s||img)?[Math.round((s||img).getBoundingClientRect().width),Math.round((s||img).getBoundingClientRect().height)]:null}});return o});
for(const [n,c] of Object.entries(cards)){if(c.logo&&c.logo.startsWith('<svg')){let h=c.logo;if(!/xmlns=/.test(h))h=h.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');const f=`memory-card-${n.split(' / ')[1].replace(/[^a-zA-Z]+/g,'')}.svg`;fs.writeFileSync('/Users/riyaghosh/V3/siena/public/svg/'+f,h);c.logo='public/svg/'+f}console.log(n,'|',c.title,'|',c.desc,'| icon U+'+c.icon,'|',c.logo,c.logoBox)}
// how-it-works icons + feature icons codepoints
console.log('icons',await p.evaluate(()=>[...document.querySelectorAll('#main p')].filter(e=>getComputedStyle(e).fontFamily.includes('Font Awesome')&&!e.closest('nav')&&!e.closest('[data-framer-name*=" / "]')).map(e=>[(e.innerText||' ').codePointAt(0).toString(16),Math.round(e.getBoundingClientRect().y+scrollY),getComputedStyle(e).fontSize]).slice(0,20)));
// bubbles appear timing
await p.evaluate(()=>window.scrollTo(0,500));
const tl=await p.evaluate(async()=>{const els=[...document.querySelectorAll('[data-framer-name="Feature 1"] *')].filter(e=>{const c=getComputedStyle(e);return c.opacity==='0'});const o=els.map(()=>[]);const t0=performance.now();return await new Promise(r=>{const f=()=>{const t=performance.now()-t0;els.forEach((e,i)=>{const c=getComputedStyle(e);o[i].push([Math.round(t),+(+c.opacity).toFixed(2),c.transform])});if(t<3500)requestAnimationFrame(f);else r(els.map((e,i)=>{const s=o[i];const st=s.find(x=>x[1]>0.01);const en=s.find(x=>x[1]>=0.99);const half=s.find(x=>x[1]>=0.5);return [(e.innerText||'').slice(0,30),st&&st[0],half&&half[0],en&&en[0],s.filter((x,j)=>j%6==0).slice(0,14).map(x=>x[1]+'/'+x[2].replace('matrix(1, 0, 0, 1, 0, ','').replace(')','')).join(' ')]}))};f()})});
console.log(JSON.stringify(tl,null,0));
// testimonial slides
await p.evaluate(()=>window.scrollTo(0,3900));await p.waitForTimeout(800);
const nexts=await p.$$('button[aria-label="Next"]');
for(let i=0;i<4;i++){console.log('slide',i,await p.evaluate(()=>{const c=document.querySelector('[data-framer-name="content"]');const r=c.getBoundingClientRect();const vis=[...c.querySelectorAll('p,img')].filter(e=>{const b=e.getBoundingClientRect();return b.x>=r.x-2&&b.right<=r.right+2&&b.width>0});return vis.map(e=>e.tagName==='IMG'?'IMG '+e.src.split('/').pop().split('?')[0]:e.innerText.slice(0,400)).join(' || ')}));await nexts[1].click();await p.waitForTimeout(1200);}
await b.close();})();
