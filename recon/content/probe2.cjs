const {chromium}=require('playwright');
const fs=require('fs');
const pages=[['/terms-of-service',1440],['/conversations',1440],['/insights/sentiment-analysis-online',1440],['/insights',390]];
(async()=>{
 const b=await chromium.launch();const res={};
 for(const [route,w] of pages){
  const ctx=await b.newContext({viewport:{width:w,height:900}});const p=await ctx.newPage();
  try{await p.goto('https://www.siena.cx'+route,{waitUntil:'networkidle',timeout:60000});}catch(e){}
  await p.waitForTimeout(1500);
  try{await p.getByRole('button',{name:/Accept All/i}).first().click({timeout:3000});}catch(e){}
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<H;y+=700){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(80);}
  await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(500);
  res[route+'@'+w]=await p.evaluate(()=>{
   const R=e=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y+scrollY),Math.round(r.width),Math.round(r.height)]};
   const pse=(e,ps)=>{const c=getComputedStyle(e,ps);return c.content==='none'?null:{content:c.content,pos:c.position,inset:`${c.top} ${c.right} ${c.bottom} ${c.left}`,bd:`${c.borderTopWidth} ${c.borderRightWidth} ${c.borderBottomWidth} ${c.borderLeftWidth} ${c.borderTopStyle} ${c.borderTopColor}`,br:c.borderRadius,bg:c.backgroundColor}};
   const o={};
   // any element whose ::after has a border (framer borders)
   o.borders=[...document.querySelectorAll('*')].filter(e=>{const c=getComputedStyle(e,'::after');return c.content!=='none'&&c.borderTopStyle!=='none'&&e.getBoundingClientRect().width>100&&!e.closest('nav')}).slice(0,30).map(e=>({fn:e.getAttribute('data-framer-name'),tag:e.tagName,r:R(e),after:pse(e,'::after'),vars:['--border-color','--border-top-width','--border-bottom-width','--border-style'].map(v=>getComputedStyle(e).getPropertyValue(v)).join('|')}));
   o.inputs=[...document.querySelectorAll('input,select,textarea')].filter(e=>e.getBoundingClientRect().width>50).map(e=>{const c=getComputedStyle(e);const ph=getComputedStyle(e,'::placeholder');const par=e.parentElement;const pc=getComputedStyle(par);return {tag:e.tagName,type:e.type,name:e.name,ph:e.placeholder,r:R(e),font:`${c.fontFamily.split(',')[0]} ${c.fontWeight} ${c.fontSize}/${c.lineHeight} ls${c.letterSpacing}`,color:c.color,phColor:ph.color,pad:c.padding,bg:c.backgroundColor,bd:`${c.borderTopWidth} ${c.borderTopStyle} ${c.borderTopColor}`,br:c.borderRadius,parBg:pc.backgroundColor,parBr:pc.borderRadius,parSh:pc.boxShadow,parAfter:pse(par,'::after'),opts:e.tagName==='SELECT'?[...e.options].map(o=>o.text):undefined,req:e.required}});
   o.buttons=[...document.querySelectorAll('a[data-framer-name="xlg"],button,a[data-framer-name="md"]')].filter(e=>e.getBoundingClientRect().width>50&&!e.closest('nav')&&!e.className.includes('cky')).map(e=>{const c=getComputedStyle(e);return {t:e.textContent.trim().slice(0,30),h:e.getAttribute('href'),r:R(e),bg:c.backgroundColor,bgi:c.backgroundImage.slice(0,300),br:c.borderRadius,pad:c.padding,sh:c.boxShadow,after:pse(e,'::after')}});
   return o;});
  // hover the first xlg / submit
  const hv=[];
  for(const sel of ['a[data-framer-name="xlg"]','form button','a[data-framer-name="Card"]']){
   const el=await p.$(sel);if(!el)continue;await el.scrollIntoViewIfNeeded();
   const g=()=>el.evaluate(e=>{const c=getComputedStyle(e);const kids=[...e.querySelectorAll('*')].slice(0,6).map(k=>{const s=getComputedStyle(k);return s.backgroundImage!=='none'||s.backgroundColor!=='rgba(0, 0, 0, 0)'?`${k.getAttribute('data-framer-name')||k.tagName}:${s.backgroundColor} ${s.backgroundImage.slice(0,120)} op${s.opacity}`:''}).filter(Boolean);const a=getComputedStyle(e,'::after');return {bg:c.backgroundColor,bgi:c.backgroundImage.slice(0,250),sh:c.boxShadow.slice(0,200),tf:c.transform,kids,after:a.content!=='none'?a.borderTopColor+' '+a.borderTopWidth:null,tr:c.transition.slice(0,200),color:c.color}});
   const before=await g();await el.hover();await p.waitForTimeout(700);const after=await g();
   hv.push({sel,before,after});await p.mouse.move(1,1);await p.waitForTimeout(300);
  }
  res[route+'@'+w].hover=hv;
  await ctx.close();
 }
 fs.writeFileSync('/Users/riyaghosh/V3/siena/recon/content/out/probe2.json',JSON.stringify(res,null,1));
 await b.close();
})();
