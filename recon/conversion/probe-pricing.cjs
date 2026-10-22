const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();
await p.goto('https://www.siena.cx/pricing',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
await p.evaluate(()=>{document.querySelectorAll('[class*="cky"]').forEach(e=>e.remove())});
const out={};
out.chain=await p.evaluate(()=>{const S=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return `${e.tagName}[${e.getAttribute('data-framer-name')||''}] ${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)}x${Math.round(r.height)} ${s.display} ${s.flexDirection} gap:${s.gap} p:${s.padding} mw:${s.maxWidth} w:${s.width} jc:${s.justifyContent} ai:${s.alignItems} pos:${s.position} t:${s.top} r:${s.right} b:${s.bottom} l:${s.left}`};
 const ch=e=>{const a=[];while(e&&e!==document.body){a.push(S(e));e=e.parentElement}return a.slice(0,7)};
 const h1=document.querySelector('h1');const form=document.querySelector('form');const logo=document.querySelector('img[src*="I79jHrog"]');const bg=document.querySelector('img[src*="LhQ0"]');const nav=document.querySelector('a[href="./"]');
 return {h1:ch(h1),form:ch(form),logo:ch(logo),bg:ch(bg),nav:[...nav.querySelectorAll('*')].slice(0,4).map(S),formHTML:form.outerHTML.length, sel:[...form.querySelectorAll('select,option,input,button,[role]')].map(e=>e.tagName+' '+(e.getAttribute('role')||'')+' '+(e.name||'')+' '+(e.type||'')+' '+(e.getAttribute('aria-label')||'')+' '+(e.required?'req':'')+' '+e.textContent.slice(0,60)), labels:[...form.querySelectorAll('label')].map(l=>l.innerText), stepsTxt:form.innerText}});
// input styles default
const st=async(sel)=>p.evaluate(sel=>{const e=document.querySelector(sel);const s=getComputedStyle(e);const w=e.parentElement;const ws=getComputedStyle(w);const lab=w.querySelector('span');const ls=lab?getComputedStyle(lab):{};return {inp:{c:s.color,ff:s.fontFamily,fs:s.fontSize,lh:s.lineHeight,p:s.padding,bg:s.backgroundColor,sh:s.boxShadow,outline:s.outline,tr:s.transition,caret:s.caretColor},wrap:{bg:ws.backgroundColor,sh:ws.boxShadow,tr:ws.transition},label:lab?{tf:ls.transform,fs:ls.fontSize,c:ls.color,tr:ls.transition,top:lab.getBoundingClientRect().top}:null}},sel);
out.inputDefault=await st('form input[type="text"], form input');
const inputs=await p.$$('form input');out.inputs=[];for(const i of inputs){out.inputs.push(await i.evaluate(e=>({name:e.name,type:e.type,ph:e.placeholder,req:e.required,auto:e.autocomplete})))}
await inputs[0].focus();await p.waitForTimeout(600);out.inputFocus=await st('form input');
await inputs[0].type('Jane');await p.waitForTimeout(400);out.inputTyped=await st('form input');
await p.screenshot({path:'pricing-form-focus.png',clip:{x:740,y:140,width:520,height:540}});
// hover next
const next=await p.$('form a, form [data-framer-name="md"]');const nb=await next.boundingBox();await p.mouse.move(nb.x+10,nb.y+10);await p.waitForTimeout(400);
out.nextHover=await next.evaluate(e=>{const s=getComputedStyle(e);return {bg:s.backgroundColor,bgi:s.backgroundImage,tr:s.transition}});
// open select
const btn=await p.$('form button');await btn.click();await p.waitForTimeout(800);
out.afterSelectClick=await p.evaluate(()=>{const L=[];document.querySelectorAll('[role="listbox"],[role="option"],[role="menu"],[role="menuitemcheckbox"],[role="checkbox"]').forEach(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();L.push({role:e.getAttribute('role'),t:e.innerText.slice(0,80),r:[r.x,r.y,r.width,r.height].map(Math.round),bg:s.backgroundColor,sh:s.boxShadow,rad:s.borderRadius,p:s.padding,ff:s.fontFamily,fs:s.fontSize,lh:s.lineHeight,c:s.color})});return L});
await p.screenshot({path:'pricing-select-open.png',clip:{x:740,y:140,width:520,height:760}});
fs.writeFileSync('probe-pricing.json',JSON.stringify(out,null,1));
// dropdown html
const dd=await p.evaluate(()=>{const f=document.querySelector('form');return f.outerHTML.replace(/class="[^"]*"/g,'').replace(/style="[^"]*"/g,'').slice(0,15000)});fs.writeFileSync('pricing-form.html',dd);
await p.keyboard.press('Escape');
// empty submit (clear first input) -> error state
await inputs[0].fill('');await next.click();await p.waitForTimeout(800);
out.afterEmptySubmit=await p.evaluate(()=>{const f=document.querySelector('form');return {txt:f.innerText, wraps:[...f.querySelectorAll('input')].map(i=>{const w=i.parentElement;return getComputedStyle(w).boxShadow+' | '+getComputedStyle(i).boxShadow+' | valid:'+i.validity.valid})}});
await p.screenshot({path:'pricing-form-error.png',clip:{x:740,y:140,width:520,height:540}});
fs.writeFileSync('probe-pricing.json',JSON.stringify(out,null,1));
await b.close();})();
