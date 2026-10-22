const {chromium}=require('playwright');const fs=require('fs');
const route=process.argv[2];const W=+process.argv[3]||1440;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:900}});
await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:60000});await p.waitForTimeout(2500);
await p.evaluate(()=>document.querySelectorAll('[class*=cky]').forEach(e=>e.remove()));
const forms=await p.$$('form');const out=[];
for(let fi=0;fi<forms.length;fi++){const f=forms[fi];if(!(await f.isVisible()))continue;
 await f.scrollIntoViewIfNeeded();
 const info=await f.evaluate(f=>{const sty=(e,pseudo)=>{if(!e)return null;const c=getComputedStyle(e,pseudo);return {bg:c.backgroundColor,border:c.borderTopWidth+' '+c.borderTopStyle+' '+c.borderTopColor,bw:c.borderWidth,sh:c.boxShadow,out:c.outline,rad:c.borderRadius,pad:c.padding,h:e.getBoundingClientRect?Math.round(e.getBoundingClientRect().height):null,content:pseudo?c.content:undefined,tr:c.transition.slice(0,120)}};
  const fields=[...f.querySelectorAll('input,textarea,select')].filter(i=>i.type!=='hidden').map(i=>{const lab=i.closest('label');const w=i.closest('.framer-form-input-wrapper')||i.parentElement;const pc=getComputedStyle(i,'::placeholder');
   return {tag:i.tagName,type:i.type,name:i.name,ph:i.placeholder,req:i.required,ac:i.autocomplete,pattern:i.pattern,min:i.minLength,label:lab?[...lab.querySelectorAll('strong,p,span')].map(s=>s.textContent.trim()).filter(Boolean)[0]:null,options:i.tagName==='SELECT'?[...i.options].map(o=>o.text+(o.disabled?'(disabled)':'')+(o.selected?'(selected)':'')):undefined,checked:i.checked,
    wrap:{w:Math.round(w.getBoundingClientRect().width),...sty(w)},wrapAfter:sty(w,'::after'),wrapBefore:sty(w,'::before'),input:{...sty(i),font:getComputedStyle(i).fontFamily.split(',')[0]+' '+getComputedStyle(i).fontWeight+' '+getComputedStyle(i).fontSize+'/'+getComputedStyle(i).lineHeight,color:getComputedStyle(i).color},phColor:pc.color,validation:i.validationMessage}});
  const btn=f.querySelector('button,[type=submit]');return {name:f.getAttribute('data-framer-name'),action:f.action,method:f.method,novalidate:f.noValidate,fields,btn:btn&&{text:btn.innerText,...sty(btn),bgi:getComputedStyle(btn).backgroundImage.slice(0,200),w:Math.round(btn.getBoundingClientRect().width)}}});
 // focus state of first text input
 const inp=await f.$('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),textarea');
 if(inp){await inp.click();await p.waitForTimeout(400);info.focus=await inp.evaluate(i=>{const w=i.closest('.framer-form-input-wrapper')||i.parentElement;const a=getComputedStyle(w,'::after');const c=getComputedStyle(w);return {bg:c.backgroundColor,sh:c.boxShadow,after:a.borderWidth+' '+a.borderStyle+' '+a.borderColor,outline:getComputedStyle(i).outline,caret:getComputedStyle(i).caretColor}});
  // hover state of another wrapper
 }
 const inp2=(await f.$$('input:not([type=hidden])'))[1];if(inp2){const bb=await inp2.boundingBox();await p.mouse.move(bb.x+5,bb.y+5);await p.waitForTimeout(400);info.hover=await inp2.evaluate(i=>{const w=i.closest('.framer-form-input-wrapper')||i.parentElement;const a=getComputedStyle(w,'::after');return {bg:getComputedStyle(w).backgroundColor,sh:getComputedStyle(w).boxShadow,after:a.borderWidth+' '+a.borderStyle+' '+a.borderColor}})}
 // button hover
 const btn=await f.$('button,[type=submit]');if(btn){const bb=await btn.boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(400);info.btnHover=await btn.evaluate(b=>getComputedStyle(b).backgroundImage.slice(0,220));
  // submit empty
  await p.mouse.move(2,2);await btn.click();await p.waitForTimeout(800);info.afterEmptySubmit=await f.evaluate(f=>({invalid:[...f.querySelectorAll(':invalid')].map(i=>i.name+': '+i.validationMessage),wrapAfter:[...f.querySelectorAll('input:not([type=hidden])')].slice(0,2).map(i=>{const w=i.closest('.framer-form-input-wrapper')||i.parentElement;const a=getComputedStyle(w,'::after');return a.borderWidth+' '+a.borderStyle+' '+a.borderColor+' sh:'+getComputedStyle(w).boxShadow}),btnText:f.querySelector('button')?.innerText}));
  // bad email
  const em=await f.$('input[type=email]');if(em){await em.fill('notanemail');info.badEmail=await em.evaluate(i=>i.validationMessage)}
 }
 await f.screenshot({path:`${route}-form${fi}-${W}.png`}).catch(()=>{});
 out.push(info)}
fs.writeFileSync(`${route}-forms-${W}.json`,JSON.stringify(out,null,1));
for(const o of out){console.log('FORM',o.name,'action',o.action,o.method,'novalidate',o.novalidate);o.fields.forEach(x=>console.log('  F',JSON.stringify({l:x.label,tag:x.tag,type:x.type,name:x.name,ph:x.ph,req:x.req,opts:x.options,ph_c:x.phColor,w:x.wrap.w,h:x.wrap.h,wrapBg:x.wrap.bg,wrapRad:x.wrap.rad,wrapPad:x.wrap.pad,wrapSh:x.wrap.sh,after:x.wrapAfter&&x.wrapAfter.border+' '+x.wrapAfter.rad+' '+x.wrapAfter.content,input:x.input.font+' '+x.input.color,tr:x.wrap.tr})));
 console.log('  BTN',JSON.stringify(o.btn));console.log('  focus',JSON.stringify(o.focus),'\n  hover',JSON.stringify(o.hover),'\n  btnHover',o.btnHover,'\n  empty',JSON.stringify(o.afterEmptySubmit),'\n  badEmail',o.badEmail)}
// logo ticker speed (horizontal masked sections)
const sp=await p.evaluate(async()=>{const secs=[...document.querySelectorAll('section')].filter(s=>getComputedStyle(s).maskImage!=='none'&&s.getBoundingClientRect().height>0);const rd=()=>secs.map(s=>{const m=new DOMMatrix(getComputedStyle(s.querySelector('ul')).transform);return [m.m41,m.m42]});const a=rd();await new Promise(r=>setTimeout(r,1000));const c=rd();return secs.map((s,i)=>({y:s.getBoundingClientRect().top+scrollY,w:s.getBoundingClientRect().width,mask:getComputedStyle(s).maskImage,gap:getComputedStyle(s.querySelector('ul')).gap,dx:c[i][0]-a[i][0],dy:c[i][1]-a[i][1]}))});
console.log('TICKERS',JSON.stringify(sp));
await b.close()})()
