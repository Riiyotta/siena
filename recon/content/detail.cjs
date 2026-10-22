const {chromium}=require('playwright');
const fs=require('fs');
const [route,wArg,mode]=process.argv.slice(2);
const w=+wArg;
const OUT='/Users/riyaghosh/V3/siena/recon/content/out';
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:w,height:w>800?900:844}});
 const p=await ctx.newPage();
 const name=route.replace(/^\//,'').replace(/\//g,'__')+'-'+w;
 try{await p.goto('https://www.siena.cx'+route,{waitUntil:'networkidle',timeout:60000});}catch(e){}
 await p.waitForTimeout(1500);
 try{await p.click('button.cky-btn-accept',{timeout:3000});}catch(e){console.log('no cky')}
 await p.waitForTimeout(1500);
 const H=await p.evaluate(()=>document.documentElement.scrollHeight);
 for(let y=0;y<H;y+=700){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(80);}
 await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(800);
 const d=await p.evaluate(()=>{
  const R=e=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y+scrollY),Math.round(r.width),Math.round(r.height)]};
  const st=e=>{const c=getComputedStyle(e);return `${c.fontFamily.split(',')[0].replace(/"/g,'')} ${c.fontWeight} ${c.fontSize}/${c.lineHeight} ls${c.letterSpacing} ${c.color}${c.textDecorationLine!=='none'?' '+c.textDecorationLine:''}`};
  const wc=s=>s.trim()?s.trim().split(/\s+/).length:0;
  const foot=[...document.querySelectorAll('[data-framer-name="Desktop"],[data-framer-name="Phone"]')].find(e=>getComputedStyle(e).backgroundColor==='rgb(18, 32, 35)');
  const fy=foot?R(foot)[1]:1e9;
  const rts=[...document.querySelectorAll('[data-framer-component-type="RichTextContainer"]')].filter(e=>{const r=R(e);return r[2]>=280&&r[1]>100&&r[1]<fy&&!e.closest('nav')&&e.children.length>1});
  const out={rich:[]};
  for(const rt of rts){
   const items=[];
   const walk=(el,depth)=>{for(const c of el.children){const t=c.tagName.toLowerCase();const cs=getComputedStyle(c);
     if(['ul','ol'].includes(t)){items.push({tag:t,depth,mt:cs.marginTop,mb:cs.marginBottom,pl:cs.paddingLeft,ls:cs.listStyleType,n:c.children.length,r:R(c)});walk(c,depth+1);continue;}
     const txt=c.textContent||'';const isH=/^h[1-6]$/.test(t)||t==='li'&&c.closest('[data-framer-name="Chapter List"]');
     const links=[...c.querySelectorAll('a')].map(a=>({h:a.getAttribute('href'),t:a.textContent.trim().slice(0,40)}));
     const fc=c.firstElementChild&&c.firstElementChild.tagName==='STRONG'?st(c.firstElementChild):'';
     items.push({tag:t,depth,r:R(c),mt:cs.marginTop,mb:cs.marginBottom,pl:cs.paddingLeft,st:st(c.querySelector('p')||c),words:wc(txt),text:isH?txt.trim():txt.trim().split(/\s+/).slice(0,8).join(' '),strong:fc?(c.firstElementChild.textContent.trim()+' | '+fc):'',links:links.slice(0,4),nl:links.length,img:c.querySelector('img')?c.querySelector('img').src:''});
     if(t==='li'&&c.querySelector('ul,ol'))walk(c,depth+1);
   }};
   walk(rt,0);
   let par=rt.parentElement;while(par&&!par.getAttribute('data-framer-name'))par=par.parentElement;
   out.rich.push({fn:par?par.getAttribute('data-framer-name'):'',r:R(rt),cnt:items.length,items});
  }
  // marker styles for li
  const li=document.querySelector('[data-framer-component-type="RichTextContainer"] li');
  if(li){const m=getComputedStyle(li,'::marker');out.marker={color:m.color,fs:m.fontSize,ff:m.fontFamily,content:m.content,lst:getComputedStyle(li).listStyleType,pl:getComputedStyle(li).paddingLeft,ml:getComputedStyle(li.parentElement).paddingLeft,mlm:getComputedStyle(li.parentElement).marginLeft};}
  // video / iframes
  out.iframes=[...document.querySelectorAll('iframe')].map(f=>({src:f.src,r:R(f),br:getComputedStyle(f).borderRadius,parBr:getComputedStyle(f.parentElement).borderRadius}));
  const vid=document.querySelector('[data-framer-name="Video"]:not(nav *)');
  if(vid){out.video={r:R(vid),html:vid.outerHTML.slice(0,2500)};}
  out.headings=[...document.querySelectorAll('h1,h2,h3,h4')].filter(h=>!h.closest('nav')&&R(h)[1]<fy&&R(h)[2]>0).map(h=>({tag:h.tagName,t:h.textContent.trim(),r:R(h)}));
  out.cards=[...document.querySelectorAll('a[data-framer-name="Card"]')].map(a=>({h:a.getAttribute('href'),r:R(a),t:a.innerText,img:(a.querySelector('img')||{}).src,alt:(a.querySelector('img')||{}).alt}));
  return out;
 });
 // hover probes
 const probes=[];
 const tryHover=async(sel,label)=>{try{const el=await p.$(sel);if(!el)return;await el.scrollIntoViewIfNeeded();const before=await el.evaluate(e=>{const c=getComputedStyle(e);return {c:c.color,bg:c.backgroundColor,sh:c.boxShadow,tf:c.transform,op:c.opacity,td:c.textDecorationLine,bc:c.borderColor}});await el.hover();await p.waitForTimeout(600);const after=await el.evaluate(e=>{const c=getComputedStyle(e);const i=e.querySelector('img');return {c:c.color,bg:c.backgroundColor,sh:c.boxShadow,tf:c.transform,op:c.opacity,td:c.textDecorationLine,bc:c.borderColor,imgTf:i?getComputedStyle(i).transform:'',imgP:i?getComputedStyle(i.parentElement).transform:''}});probes.push({label,before,after});await p.mouse.move(0,0);await p.waitForTimeout(300);}catch(e){probes.push({label,err:e.message.slice(0,80)})}};
 await tryHover('a[data-framer-name="Card"]','card');
 await tryHover('[data-framer-name="Kicker"] a','kicker link');
 await tryHover('[data-framer-name="Chapter List"] a','chapter link');
 await tryHover('[data-framer-component-type="RichTextContainer"] p a','body link');
 d.probes=probes;
 fs.writeFileSync(`${OUT}/${name}-detail.json`,JSON.stringify(d,null,1));
 if(mode==='shot'){
  // stitched-free: full page screenshot after cookie accept
  await p.screenshot({path:`/Users/riyaghosh/V3/siena/recon/content/${name}.png`,fullPage:true});
 }
 console.log(name,'rich',d.rich.length,'iframes',d.iframes.length);
 await b.close();
})();
