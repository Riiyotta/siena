const {chromium}=require('playwright');const fs=require('fs');
const [,,url,slug]=process.argv;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();
await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
await p.evaluate(()=>{document.querySelectorAll('[class*="cky"]').forEach(e=>e.remove())});
const out={pages:[]};
const panelInfo=()=>p.evaluate(()=>{const cbs=[...document.querySelectorAll('input[type=checkbox],input[type=radio]')].filter(c=>c.getBoundingClientRect().width>0);if(!cbs.length)return null;
 const S=(e)=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,r:[r.x,r.y,r.width,r.height].map(Math.round),bg:s.backgroundColor,sh:s.boxShadow,rad:s.borderRadius,p:s.padding,gap:s.gap,d:s.display,ff:s.fontFamily.split(',')[0],fs:s.fontSize,lh:s.lineHeight,c:s.color,ov:s.overflowY,mh:s.maxHeight,op:s.opacity,tf:s.transform,tr:s.transition,anim:s.animationName+' '+s.animationDuration,z:s.zIndex,pos:s.position}};
 const c=cbs[0];const chain=[];let e=c;for(let k=0;k<6;k++){e=e.parentElement;if(!e||e===document.body)break;chain.push(S(e))}
 return {n:cbs.length,type:c.type,cb:S(c),cbStyle:c.getAttribute('style'),chain,options:cbs.map(x=>x.parentElement.innerText.trim())}});
const doDropdowns=async(tag)=>{const dds=await p.$$('form button[type=button]');const res=[];
 for(const d of dds){if(!(await d.isVisible()))continue;const txt=(await d.innerText()).trim();if(/^(Next step|Previous|Back|Next)/.test(txt))continue;
  await d.click();
  const t=[];for(const ms of [0,40,80,120,200,350]){await p.waitForTimeout(ms-(t.length?[0,40,80,120,200,350][t.length-1]:0));t.push(await p.evaluate(()=>{const c=[...document.querySelectorAll('input[type=checkbox],input[type=radio]')].find(c=>c.getBoundingClientRect().width>0);if(!c)return 'none';let e=c;for(let k=0;k<4;k++)e=e.parentElement;const s=getComputedStyle(e);return s.opacity+' '+s.transform+' h'+Math.round(e.getBoundingClientRect().height)}))}
  await p.waitForTimeout(400);const info=await panelInfo();
  let hov=null;const lab=await p.$('label:has(input[type=checkbox]:visible), label:has(input[type=radio]:visible)');
  if(lab){await lab.hover();await p.waitForTimeout(300);hov=await lab.evaluate(e=>({bg:getComputedStyle(e).backgroundColor,c:getComputedStyle(e).color,p:getComputedStyle(e).padding,rad:getComputedStyle(e).borderRadius,h:e.getBoundingClientRect().height}));
   await lab.click();await p.waitForTimeout(300);}
  const afterSel=await d.evaluate(e=>e.innerText);
  await p.screenshot({path:`${slug}-${tag}-dd${res.length+1}.png`,clip:{x:500,y:0,width:940,height:900}});
  res.push({txt,openTiming:t,info,labelHover:hov,afterSelectBtnText:afterSel});
  await p.keyboard.press('Escape');await p.waitForTimeout(200);await p.mouse.click(10,700);await p.waitForTimeout(400);}
 return res};
out.pages.push(await doDropdowns('p1'));
// fill page 1 with dummy data (NO final submit) and go next
const fill=async(n,v)=>{const e=await p.$(`[name="${n}"]`);if(e&&await e.isVisible())await e.fill(v)};
for(const [n,v] of [['fullName','Test Test'],['firstName','Test'],['lastName','Test'],['workEmail','test@example.com'],['email','test@example.com'],['companyWebsite','example.com']])await fill(n,v);
const before=await p.evaluate(()=>document.querySelector('form').innerText);
const nx=await p.$('form a:has-text("Next step"), form [data-framer-name="Next"]');
if(nx){await nx.click();await p.waitForTimeout(1200);
 out.page2Text=await p.evaluate(()=>document.querySelector('form').innerText);
 out.page2Btns=await p.evaluate(()=>[...document.querySelectorAll('form button, form a')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {t:e.innerText,r:[r.x,r.y,r.width,r.height].map(Math.round),bg:s.backgroundColor,bgi:s.backgroundImage.slice(0,80),sh:s.boxShadow,rad:s.borderRadius,p:s.padding}}));
 out.page2Fields=await p.evaluate(()=>[...document.querySelectorAll('form label')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText,r:[r.x,r.y,r.width,r.height].map(Math.round)}}));
 await p.screenshot({path:`${slug}-form-page2.png`,clip:{x:500,y:0,width:940,height:900}});
 out.pages.push(await doDropdowns('p2'));
 // textarea info
 out.textarea=await p.evaluate(()=>{const t=document.querySelector('textarea');if(!t)return null;const s=getComputedStyle(t),w=getComputedStyle(t.parentElement);const r=t.getBoundingClientRect();return {r:[r.x,r.y,r.width,r.height].map(Math.round),p:s.padding,resize:s.resize,wbg:w.backgroundColor,wsh:w.boxShadow,wrad:w.borderRadius}});
}
out.page1Text=before;
// error state on page 1: reload, click next without filling
await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1000);await p.evaluate(()=>{document.querySelectorAll('[class*="cky"]').forEach(e=>e.remove())});
const nx2=await p.$('form a:has-text("Next step"), form [data-framer-name="Next"]');if(nx2){await nx2.click();await p.waitForTimeout(800);
 out.emptyNext=await p.evaluate(()=>({txt:document.querySelector('form').innerText,valid:[...document.querySelectorAll('form input:not([type=hidden])')].filter(i=>i.getBoundingClientRect().width>0).map(i=>i.name+':'+i.validationMessage+'|'+getComputedStyle(i.parentElement).boxShadow),active:document.activeElement.name}));
 await p.screenshot({path:`${slug}-form-empty-next.png`,clip:{x:500,y:0,width:940,height:900}});}
fs.writeFileSync(`probe-dd-${slug}.json`,JSON.stringify(out,null,1));
await b.close();})();
