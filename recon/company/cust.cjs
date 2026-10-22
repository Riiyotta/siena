const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/customers',{waitUntil:'load',timeout:60000});await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('[class*=cky]').forEach(e=>e.remove())});
const cardSel='[data-framer-name="Grid"] a';
const count=()=>p.evaluate(s=>document.querySelectorAll(s).length,cardSel);
console.log('initial cards',await count());
// load more
const lm=p.locator('p',{hasText:/^Load more$/}).first();
let rounds=0;while(await lm.isVisible().catch(()=>false)&&rounds<6){await lm.hover();await p.waitForTimeout(300);const lh=await lm.evaluate(e=>{let b=e;while(b&&getComputedStyle(b).backgroundColor==='rgba(0, 0, 0, 0)')b=b.parentElement;return getComputedStyle(b).backgroundImage.slice(0,200)+' '+getComputedStyle(b).borderRadius});if(rounds===0)console.log('loadmore hover',lh);await lm.click();await p.waitForTimeout(1500);rounds++;console.log('after load more',rounds,await count())}
const all=await p.evaluate(s=>[...document.querySelectorAll(s)].map(a=>{const img=a.querySelector('img');return [a.getAttribute('href'),img.currentSrc.split('/').pop().split('?')[0],img.naturalWidth+'x'+img.naturalHeight,[...a.querySelectorAll('p')].filter(p=>getComputedStyle(p).fontFamily.includes('Geist')).map(p=>p.textContent).join('/'),a.querySelector('h2').textContent].join(' | ')}),cardSel);
fs.writeFileSync('customers-cards.txt',all.join('\n'));console.log('total after loadmore',all.length);
await b.close()})()
