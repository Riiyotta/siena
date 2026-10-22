const {chromium}=require('playwright');
const fs=require('fs');
const routes=process.argv[2].split(',');
const widths=(process.argv[3]||'1440,390').split(',').map(Number);
const OUT='/Users/riyaghosh/V3/siena/recon/content/out';
const fn=()=>{
 const R=e=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y+scrollY),Math.round(r.width),Math.round(r.height)]};
 const rgb=c=>c;
 const out={H:document.documentElement.scrollHeight,title:document.title,texts:[],boxes:[],imgs:[],svgs:[],sticky:[],links:[],anim:[],videos:[],iframes:[]};
 const main=document.querySelector('#main')||document.body;
 const all=[...document.body.querySelectorAll('*')];
 for(const e of all){
  const cs=getComputedStyle(e);
  if(cs.display==='none'||cs.visibility==='hidden')continue;
  const r=e.getBoundingClientRect(); if(r.width===0&&r.height===0)continue;
  const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
  if(own){out.texts.push({tag:e.tagName.toLowerCase(),p:e.parentElement.tagName.toLowerCase(),t:own.slice(0,120),len:(e.textContent||'').trim().split(/\s+/).length,r:R(e),ff:cs.fontFamily.split(',')[0].replace(/"/g,''),fs:cs.fontSize,lh:cs.lineHeight,ls:cs.letterSpacing,fw:cs.fontWeight,fst:cs.fontStyle,c:cs.color,td:cs.textDecorationLine,tt:cs.textTransform,ta:cs.textAlign,mt:cs.marginTop,mb:cs.marginBottom,pl:cs.paddingLeft});}
  const bg=cs.backgroundColor!=='rgba(0, 0, 0, 0)'?cs.backgroundColor:'';
  const bgi=cs.backgroundImage!=='none'?cs.backgroundImage.slice(0,200):'';
  const bd=cs.borderTopWidth!=='0px'||cs.borderBottomWidth!=='0px'||cs.borderLeftWidth!=='0px'?`${cs.borderTopWidth} ${cs.borderBottomWidth} ${cs.borderLeftWidth} ${cs.borderTopStyle} ${cs.borderTopColor} ${cs.borderBottomColor} ${cs.borderLeftColor}`:'';
  const lay=(cs.display.includes('flex')||cs.display.includes('grid'));
  if(bg||bgi||bd||cs.borderRadius!=='0px'||cs.boxShadow!=='none'||(lay&&r.width>200)||['ul','ol','li','table','blockquote','section','header','footer','nav','article','hr','pre','code'].includes(e.tagName.toLowerCase())){
   out.boxes.push({tag:e.tagName.toLowerCase(),fn:e.getAttribute('data-framer-name')||'',cls:(e.className&&e.className.baseVal===undefined?e.className:'').slice(0,60),r:R(e),bg,bgi,bd,br:cs.borderRadius,sh:cs.boxShadow==='none'?'':cs.boxShadow.slice(0,200),d:cs.display,fd:cs.flexDirection,jc:cs.justifyContent,ai:cs.alignItems,gap:cs.gap,gtc:cs.gridTemplateColumns==='none'?'':cs.gridTemplateColumns,pad:cs.padding,mar:cs.margin,mw:cs.maxWidth,pos:cs.position,ov:cs.overflow,op:cs.opacity,tf:cs.transform==='none'?'':cs.transform,ls:cs.listStyleType,txt:(e.textContent||'').trim().slice(0,40)});
  }
  if(cs.position==='sticky'||cs.position==='fixed')out.sticky.push({tag:e.tagName,fn:e.getAttribute('data-framer-name')||'',r:R(e),pos:cs.position,top:cs.top,z:cs.zIndex,txt:(e.textContent||'').trim().slice(0,60)});
  if(cs.transitionDuration!=='0s'&&cs.transitionProperty!=='all'||cs.animationName!=='none')out.anim.push({tag:e.tagName,fn:e.getAttribute('data-framer-name')||'',r:R(e),tr:`${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction} ${cs.transitionDelay}`,an:`${cs.animationName} ${cs.animationDuration} ${cs.animationTimingFunction} ${cs.animationIterationCount}`});
 }
 document.querySelectorAll('img').forEach(i=>{const cs=getComputedStyle(i);out.imgs.push({src:i.currentSrc||i.src,alt:i.alt,r:R(i),nat:[i.naturalWidth,i.naturalHeight],of:cs.objectFit,op:cs.objectPosition,br:getComputedStyle(i.parentElement).borderRadius+'|'+cs.borderRadius})});
 document.querySelectorAll('svg').forEach((s,k)=>{const r=s.getBoundingClientRect();if(r.width>0&&!s.closest('svg:not(:scope)'))out.svgs.push({k,r:R(s),vb:s.getAttribute('viewBox'),len:s.outerHTML.length,par:s.parentElement.getAttribute('data-framer-name')||s.parentElement.tagName,html:s.outerHTML.length<6000?s.outerHTML:s.outerHTML.slice(0,300)})});
 document.querySelectorAll('a').forEach(a=>{const r=a.getBoundingClientRect();if(r.width>0)out.links.push({h:a.getAttribute('href'),t:(a.textContent||'').trim().slice(0,80),r:R(a)})});
 document.querySelectorAll('video').forEach(v=>out.videos.push({src:v.currentSrc||v.src,poster:v.poster,r:R(v),auto:v.autoplay,loop:v.loop,muted:v.muted}));
 document.querySelectorAll('iframe').forEach(v=>out.iframes.push({src:v.src,r:R(v)}));
 out.appear=window.__framer__appearAnimationsContent?String(window.__framer__appearAnimationsContent.textContent||'').slice(0,3000):null;
 const ap=document.querySelector('#__framer__appearAnimationsContent');if(ap)out.appear=ap.textContent.slice(0,4000);
 out.rootFont=getComputedStyle(document.body).fontFamily;
 out.fonts=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight+' '+f.style);
 out.styleAttrs=[...document.querySelectorAll('[style*="will-change"],[data-framer-appear-id]')].slice(0,40).map(e=>({fn:e.getAttribute('data-framer-name')||'',r:R(e),st:(e.getAttribute('style')||'').slice(0,200),ap:e.getAttribute('data-framer-appear-id')}));
 return out;
};
(async()=>{
 const b=await chromium.launch();
 for(const r of routes){
  for(const w of widths){
   const ctx=await b.newContext({viewport:{width:w,height:w>800?900:844}});
   const p=await ctx.newPage();
   const name=(r.replace(/^\//,'').replace(/\//g,'__')||'home')+'-'+w;
   try{await p.goto('https://www.siena.cx'+r,{waitUntil:'networkidle',timeout:60000});}catch(e){console.log('nav',e.message)}
   await p.waitForTimeout(1500);
   await p.evaluate(()=>{document.querySelectorAll('.cky-consent-container,.cky-overlay,.cky-btn-revisit-wrapper').forEach(e=>e.remove())});
   const H=await p.evaluate(()=>document.documentElement.scrollHeight);
   for(let y=0;y<H;y+=500){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(100);}
   await p.waitForTimeout(1000);
   await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(800);
   const d=await p.evaluate(fn);
   fs.writeFileSync(`${OUT}/${name}.json`,JSON.stringify(d));
   console.log(name,d.H,d.texts.length,d.boxes.length,d.imgs.length);
   await ctx.close();
  }
 }
 await b.close();
})();
