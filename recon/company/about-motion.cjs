const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();
for(const W of [1440,390]){
const p=await b.newPage({viewport:{width:W,height:W>800?900:844}});
await p.goto('https://www.siena.cx/about-us',{waitUntil:'networkidle'});
const nav=await p.evaluate(()=>{const n=document.querySelector('nav');const pill=n.querySelector('[class*=container]>*')||n.children[1];const all=[...n.querySelectorAll('*')].filter(e=>getComputedStyle(e).boxShadow!=='none'||getComputedStyle(e).backgroundColor!=='rgba(0, 0, 0, 0)').slice(0,5).map(e=>{const c=getComputedStyle(e);const r=e.getBoundingClientRect();return {n:e.getAttribute('data-framer-name'),w:r.width,h:r.height,bg:c.backgroundColor,sh:c.boxShadow}});return {variant:n.getAttribute('data-framer-name'),all}});
console.log(W,'nav@0',JSON.stringify(nav));
const res=[];
const sc=await p.evaluate(()=>{const s=document.querySelector('[data-framer-name="Scroll Container"]');const r=s.getBoundingClientRect();return {top:r.top+scrollY,h:r.height}});
for(let f=-0.1;f<=1.05;f+=0.05){const y=Math.round(sc.top+f*(sc.h-(W>800?900:844)));await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(250);
 const t=await p.evaluate(()=>{const c=document.querySelector('[data-framer-name="Content"]');const tr=c.firstElementChild.tagName==='DIV'?c.querySelector(':scope > div > div')||c.firstElementChild:c.firstElementChild;const track=[...c.querySelectorAll('div')].find(d=>getComputedStyle(d).transform!=='none');return track?getComputedStyle(track).transform+' w='+track.scrollWidth+' '+track.getBoundingClientRect().width:'none'});
 res.push([y,t]);}
console.log(W,'scrollContainer',JSON.stringify(sc));res.forEach(r=>console.log(' ',r.join(' -> ')));
// wheel jump to check smoothing
await p.evaluate(y=>scrollTo(0,y),sc.top+1000);const samples=[];const t0=Date.now();for(let i=0;i<12;i++){samples.push(await p.evaluate(()=>{const c=document.querySelector('[data-framer-name="Content"]');const track=[...c.querySelectorAll('div')].find(d=>getComputedStyle(d).transform!=='none');return getComputedStyle(track).transform.split(',')[4]}));await p.waitForTimeout(50)}
console.log(W,'after jump samples(50ms):',samples.join(' '));
if(W===1440){const svg=await p.evaluate(()=>document.querySelector('[data-framer-name="Flow"] svg').outerHTML);fs.writeFileSync('about-flow.svg',svg);
 const h2=await p.evaluate(()=>[...document.querySelectorAll('h2')].map(h=>h.innerHTML.slice(0,300)));console.log(h2);
 // hover social
 const a=p.locator('a[href*="linkedin.com/in/lisapopovici"]');await a.scrollIntoViewIfNeeded();await a.hover();await p.waitForTimeout(400);
 console.log('social hover',await a.evaluate(e=>{const c=getComputedStyle(e);return c.backgroundColor+' '+c.backgroundImage.slice(0,80)+' border:'+c.border+' icon:'+getComputedStyle(e.querySelector('p')).color}));
 const a2=p.locator('a[href="./careers"]').first();await a2.hover();await p.waitForTimeout(400);console.log('hiring hover',await a2.evaluate(e=>getComputedStyle(e).backgroundImage.slice(0,200)));
 const fb=await p.evaluate(()=>{const e=document.querySelector('a[href*="linkedin.com/in/lisapopovici"]');return getComputedStyle(e).border+' sh:'+getComputedStyle(e).boxShadow});console.log('social static',fb);
}
await p.close();}
await b.close()})()
