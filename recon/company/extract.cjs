const {chromium}=require('playwright');const fs=require('fs');
const route=process.argv[2], W=+process.argv[3]||1440;
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:W>800?900:844},deviceScaleFactor:1});
const p=await ctx.newPage();
const net=[];
p.on('response',r=>{const t=r.request().resourceType();if(['image','media','font','fetch','xhr','script','document','other'].includes(t))net.push({t,u:r.url(),s:r.status(),ct:r.headers()['content-type']||''})});
await p.goto('https://www.siena.cx/'+route,{waitUntil:'networkidle',timeout:60000});
// initial inline-style snapshot of hidden/transformed elements (pre-scroll)
const pre=await p.evaluate(()=>{const o=[];document.querySelectorAll('#main [style]').forEach(el=>{const s=el.style;if((s.opacity&&+s.opacity<1)||(s.transform&&s.transform!=='none'&&!/translateX\(-50%\)|translate\(-50%/.test(s.transform))){const r=el.getBoundingClientRect();o.push({n:el.getAttribute('data-framer-name'),cls:(typeof el.className==='string'?el.className:'').slice(0,50),y:Math.round(r.top+scrollY),h:Math.round(r.height),op:s.opacity,tf:s.transform,txt:(el.innerText||'').slice(0,60).replace(/\n/g,' ')})}});
const ap=document.getElementById('__framer__appearAnimationsContent');
return {hidden:o,appear:ap?ap.textContent:null,bps:document.getElementById('__framer__breakpoints')?.textContent}});
// scroll through
const H=await p.evaluate(()=>document.documentElement.scrollHeight);
for(let y=0;y<H;y+=400){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(120);}
await p.waitForTimeout(1500);
await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(800);
const data=await p.evaluate(()=>{
 const out=[];const def=new Set(['rgba(0, 0, 0, 0)','none','0px','normal','auto']);
 const main=[...document.querySelectorAll("div[data-framer-name=Main]")].find(e=>e.getBoundingClientRect().height>0)||document.querySelector("#main");
 function txt(el){let t='';el.childNodes.forEach(n=>{if(n.nodeType===3)t+=n.textContent});return t.trim()}
 function walk(el,depth,sec){
  const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return;
  const r=el.getBoundingClientRect();if(r.width===0&&r.height===0&&el.children.length===0)return;
  const tag=el.tagName.toLowerCase();
  const t=txt(el);
  const rec={d:depth,tag,n:el.getAttribute('data-framer-name')||undefined,x:Math.round(r.left),y:Math.round(r.top+scrollY),w:Math.round(r.width),h:Math.round(r.height)};
  if(t)rec.text=t.slice(0,400);
  const st={};
  if(t||['h1','h2','h3','h4','p','a','button','label','input','textarea','select'].includes(tag)){st.font=`${cs.fontFamily.split(',')[0].replace(/"/g,'')} ${cs.fontWeight} ${cs.fontStyle!=='normal'?cs.fontStyle+' ':''}${cs.fontSize}/${cs.lineHeight} ls:${cs.letterSpacing}`;st.color=cs.color;if(cs.textAlign!=='start')st.ta=cs.textAlign;if(cs.textTransform!=='none')st.tt=cs.textTransform;if(cs.textDecorationLine!=='none')st.td=cs.textDecorationLine;}
  if(!def.has(cs.backgroundColor))st.bg=cs.backgroundColor;
  if(cs.backgroundImage!=='none')st.bgi=cs.backgroundImage.slice(0,300);
  if(cs.padding!=='0px')st.pad=cs.padding;
  if(cs.display.includes('flex')){st.flex=`${cs.flexDirection} jc:${cs.justifyContent} ai:${cs.alignItems}${cs.flexWrap!=='nowrap'?' wrap':''}`;if(cs.gap!=='normal')st.gap=cs.gap}
  if(cs.display.includes('grid')){st.grid=`cols:${cs.gridTemplateColumns} rows:${cs.gridTemplateRows} gap:${cs.gap}`}
  if(cs.borderRadius!=='0px')st.rad=cs.borderRadius;
  if(cs.borderTopWidth!=='0px'||cs.borderBottomWidth!=='0px'||cs.borderLeftWidth!=='0px')st.bord=`${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor} / b:${cs.borderBottomWidth} ${cs.borderBottomColor}`;
  if(cs.boxShadow!=='none')st.sh=cs.boxShadow;
  if(el.dataset&&el.dataset.border==='true'){const a=getComputedStyle(el,'::after');st.abord=`w:${a.borderWidth} ${a.borderStyle} ${a.borderColor} rad:${a.borderRadius}`}
  if(cs.opacity!=='1')st.op=cs.opacity;
  if(cs.maxWidth!=='none')st.maxw=cs.maxWidth;
  if(cs.position==='sticky'||cs.position==='fixed')st.pos=cs.position+' top:'+cs.top;
  if(cs.overflow!=='visible')st.ov=cs.overflow;
  if(cs.transform!=='none')st.tf=cs.transform;
  if(cs.mixBlendMode!=='normal')st.blend=cs.mixBlendMode;
  if(cs.maskImage&&cs.maskImage!=='none')st.mask=cs.maskImage.slice(0,200);
  if(cs.filter!=='none')st.filter=cs.filter;
  if(cs.backdropFilter&&cs.backdropFilter!=='none')st.bdf=cs.backdropFilter;
  if(tag==='img'){rec.src=el.currentSrc||el.src;rec.nat=el.naturalWidth+'x'+el.naturalHeight;st.fit=cs.objectFit;st.objpos=cs.objectPosition;rec.alt=el.alt}
  if(tag==='a')rec.href=el.getAttribute('href');
  if(tag==='iframe'){rec.src=el.src}
  if(tag==='video'){rec.src=el.currentSrc||el.querySelector('source')?.src;rec.vid={autoplay:el.autoplay,loop:el.loop,muted:el.muted,poster:el.poster}}
  if(['input','textarea','select','button'].includes(tag)){rec.form={type:el.type,name:el.name,ph:el.placeholder,req:el.required,val:el.value}}
  if(tag==='svg'){rec.svg=el.outerHTML.length; st.svgcolor=cs.color;rec.svgid=out.length}
  if(Object.keys(st).length)rec.s=st;
  const interesting = t||tag==='img'||tag==='svg'||tag==='iframe'||tag==='video'||tag==='a'||tag==='canvas'||tag==='input'||tag==='textarea'||tag==='button'||tag==='form'||rec.n||st.abord||st.bg||st.bgi||st.bord||st.sh||st.rad||st.flex||st.grid;
  if(interesting)out.push(rec);
  if(tag==='svg')return;
  [...el.children].forEach(c=>walk(c,depth+1));
 }
 walk(main,0);
 const svgs=[...main.querySelectorAll('svg')].filter(s=>!s.closest('svg')||s.parentElement.closest('svg')===null).map(s=>{const r=s.getBoundingClientRect();return {y:Math.round(r.top+scrollY),x:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height),n:s.closest('[data-framer-name]')?.getAttribute('data-framer-name'),html:s.outerHTML}});
 const iframes=[...document.querySelectorAll('iframe')].map(f=>({src:f.src,id:f.id,cls:f.className}));
 const scripts=[...document.scripts].map(s=>s.src).filter(Boolean);
 const fonts=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight+' '+f.style);
 const navEl=document.querySelector('nav');
 return {H:document.documentElement.scrollHeight,out,svgs,iframes,scripts,fonts:[...new Set(fonts)],nav:navEl?{name:navEl.getAttribute('data-framer-name'),cls:navEl.className,bg:getComputedStyle(navEl.querySelector('[class*=container]')?.firstElementChild||navEl).backgroundColor}:null};
});
await p.screenshot({path:`${route}-${W}.png`,fullPage:true});
fs.writeFileSync(`${route}-${W}.json`,JSON.stringify({pre,data,net},null,0));
console.log(route,W,'H',data.H,'els',data.out.length,'svgs',data.svgs.length,'net',net.length);
await b.close();})();
