const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
p.on('request',r=>{if(/ashby|job/i.test(r.url()))console.log('REQ',r.method(),r.url().slice(0,200))});
p.on('requestfailed',r=>console.log('FAIL',r.url().slice(0,200),r.failure()?.errorText));
p.on('console',m=>{if(/ashby|job|error/i.test(m.text()))console.log('CONSOLE',m.text().slice(0,200))});
await p.goto('https://www.siena.cx/careers',{waitUntil:'networkidle'});await p.waitForTimeout(3000);
await p.evaluate(()=>document.querySelector('[data-framer-name="Open roles"]').scrollIntoView());await p.waitForTimeout(2000);
const btns=p.locator('[data-framer-name="Open roles"] button');const n=await btns.count();console.log('buttons',n);
// hover first button
const b0=btns.nth(0);const before=await b0.evaluate(e=>{const c=getComputedStyle(e);return {bg:c.backgroundColor,color:c.color,cursor:c.cursor,tr:c.transition}});await b0.hover();await p.waitForTimeout(400);
const after=await b0.evaluate(e=>{const c=getComputedStyle(e);return {bg:c.backgroundColor,color:c.color,span:getComputedStyle(e.querySelector('span')).color,par:getComputedStyle(e.parentElement).backgroundColor}});console.log('hover',JSON.stringify(before),JSON.stringify(after));
// click first and sample animation
const H0=await p.evaluate(()=>document.querySelector('[data-framer-name="Open roles"]').getBoundingClientRect().height);
await b0.click();const samp=[];for(let i=0;i<10;i++){samp.push(await p.evaluate(()=>{const d=document.querySelector('[data-framer-name="Open roles"] button').parentElement;const s=d.querySelector('svg');return Math.round(d.getBoundingClientRect().height)+'/'+getComputedStyle(s).transform}));await p.waitForTimeout(40)}
console.log('expand samples 40ms',samp.join(' '));
for(let i=1;i<n;i++){await btns.nth(i).click();await p.waitForTimeout(300)}
await p.waitForTimeout(800);
const html=await p.evaluate(()=>document.querySelector('[data-framer-name="Open roles"]').outerHTML);fs.writeFileSync('careers-openroles.html',html);
const roles=await p.evaluate(()=>{const root=document.querySelector('[data-framer-name="Open roles"]');const out=[];root.querySelectorAll('a').forEach(a=>{const c=getComputedStyle(a);const r=a.getBoundingClientRect();out.push({href:a.href,text:a.innerText.replace(/\n/g,' | '),x:r.left,y:r.top+scrollY,w:r.width,h:r.height,font:c.fontFamily+' '+c.fontWeight+' '+c.fontSize+'/'+c.lineHeight,color:c.color,pad:c.padding,bord:c.borderBottom,kids:[...a.querySelectorAll('*')].filter(e=>e.childNodes[0]?.nodeType===3).map(e=>{const s=getComputedStyle(e);return e.tagName+':'+e.textContent.trim()+' {'+s.fontFamily.split(',')[0]+' '+s.fontWeight+' '+s.fontSize+'/'+s.lineHeight+' '+s.color+' bg:'+s.backgroundColor+' pad:'+s.padding+' rad:'+s.borderRadius+'}'})})});return {H:root.getBoundingClientRect().height,out}});
console.log('H0',H0,'H all open',roles.H);roles.out.forEach(r=>console.log(JSON.stringify(r)));
const a=p.locator('[data-framer-name="Open roles"] a[href*="ashbyhq.com/siena/"]').first();if(await a.count()){const bf=await a.evaluate(e=>getComputedStyle(e).backgroundColor+' '+getComputedStyle(e).color);await a.hover();await p.waitForTimeout(300);console.log('role hover',bf,'->',await a.evaluate(e=>getComputedStyle(e).backgroundColor+' '+getComputedStyle(e).color+' '+[...e.querySelectorAll('*')].map(x=>getComputedStyle(x).color+'/'+getComputedStyle(x).transform).join(',')))}
await p.screenshot({path:'careers-roles-open.png',fullPage:false,clip:undefined});
await p.evaluate(()=>document.querySelector('[data-framer-name="Open roles"]').scrollIntoView());await p.screenshot({path:'careers-roles-open.png'});
await b.close()})()
