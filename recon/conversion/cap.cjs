const {chromium}=require('playwright');
const fs=require('fs');
const [,,url,slug,onlyW]=process.argv;
const OUT='/Users/riyaghosh/V3/siena/recon/conversion/';
(async()=>{
 const browser=await chromium.launch();
 for(const w of (onlyW?[+onlyW]:[1440,390])){
  const h=w>800?900:844;
  const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,userAgent:w<800?'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1':undefined});
  const page=await ctx.newPage();
  const reqs=[];
  page.on('response',r=>{const t=r.request().resourceType();reqs.push({url:r.url(),type:t,status:r.status(),ct:r.headers()['content-type']})});
  await page.goto(url,{waitUntil:'networkidle',timeout:90000});
  await page.waitForTimeout(1500);
  // initial state snapshot of transforms/opacity (pre-scroll)
  const pre=await page.evaluate(()=>{const o=[];document.querySelectorAll('body *').forEach(e=>{const s=getComputedStyle(e);const r=e.getBoundingClientRect();if(r.height<2)return;if((+s.opacity<0.99||s.transform!=='none')&&o.length<300)o.push({n:e.getAttribute('data-framer-name')||e.tagName,op:s.opacity,tf:s.transform,y:Math.round(r.top+scrollY),h:Math.round(r.height),txt:(e.innerText||'').slice(0,40)})});return o});
  const H=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<H;y+=400){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(120);}
  await page.waitForTimeout(1500);
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(1200);
  const data=await page.evaluate(()=>{
   const px=v=>v;
   const anc=e=>{const a=[];let p=e.parentElement;while(p&&a.length<4){const n=p.getAttribute&&p.getAttribute('data-framer-name');if(n)a.push(n);p=p.parentElement;}return a.join(' < ')};
   const R=e=>{const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top+scrollY),Math.round(r.width),Math.round(r.height)]};
   const texts=[];
   document.querySelectorAll('body *').forEach(e=>{
     if(['SCRIPT','STYLE','NOSCRIPT','svg','path'].includes(e.tagName))return;
     let own='';e.childNodes.forEach(c=>{if(c.nodeType===3)own+=c.textContent});own=own.trim();
     if(!own)return;const r=e.getBoundingClientRect();if(r.width===0)return;
     const s=getComputedStyle(e);if(s.visibility==='hidden'||s.display==='none')return;
     texts.push({t:own.slice(0,300),tag:e.tagName,ff:s.fontFamily.split(',')[0],fs:s.fontSize,lh:s.lineHeight,ls:s.letterSpacing,fw:s.fontWeight,fst:s.fontStyle==='italic'?'i':'',c:s.color,tt:s.textTransform==='none'?'':s.textTransform,ta:s.textAlign,op:s.opacity,td:s.textDecorationLine==='none'?'':s.textDecorationLine,r:R(e),a:anc(e)});
   });
   const boxes=[];
   document.querySelectorAll('body *').forEach(e=>{
     if(['SCRIPT','STYLE','path','g','defs','stop','linearGradient','clipPath','rect','circle'].includes(e.tagName))return;
     const r=e.getBoundingClientRect();if(r.width<4||r.height<4)return;
     const s=getComputedStyle(e);if(s.display==='none')return;
     const bg=s.backgroundColor!=='rgba(0, 0, 0, 0)'?s.backgroundColor:'';
     const bgi=s.backgroundImage!=='none'?s.backgroundImage.slice(0,300):'';
     const br=s.borderTopWidth!=='0px'||s.borderBottomWidth!=='0px'?`${s.borderTopWidth} ${s.borderRightWidth} ${s.borderBottomWidth} ${s.borderLeftWidth} ${s.borderTopStyle} ${s.borderTopColor} ${s.borderBottomColor}`:'';
     const rad=s.borderRadius!=='0px'?s.borderRadius:'';
     const sh=s.boxShadow!=='none'?s.boxShadow:'';
     const name=e.getAttribute('data-framer-name')||'';
     const isFlex=s.display.includes('flex')||s.display.includes('grid');
     if(!(bg||bgi||br||rad||sh||name||e.tagName==='IMG'||e.tagName==='IFRAME'||e.tagName==='INPUT'||e.tagName==='SECTION'||e.tagName==='FORM'||e.tagName==='VIDEO'||e.tagName==='BUTTON'||e.tagName==='A'))return;
     boxes.push({tag:e.tagName,n:name,r:R(e),d:s.display+(isFlex?` ${s.flexDirection} jc:${s.justifyContent} ai:${s.alignItems} gap:${s.gap}`:''),gtc:s.display.includes('grid')?s.gridTemplateColumns:'',p:s.padding,mw:s.maxWidth!=='none'?s.maxWidth:'',bg,bgi,br,rad,sh,ov:s.overflow!=='visible'?s.overflow:'',pos:s.position!=='static'?s.position+` t:${s.top} l:${s.left}`:'',op:s.opacity!=='1'?s.opacity:'',tf:s.transform!=='none'?s.transform:'',src:e.currentSrc||e.src||'',of:e.tagName==='IMG'?s.objectFit:'',nat:e.tagName==='IMG'?[e.naturalWidth,e.naturalHeight]:'',href:e.tagName==='A'?e.getAttribute('href'):'',trans:s.transition!=='all 0s ease 0s'&&s.transition!=='all'?s.transition:'',anim:s.animationName!=='none'?s.animationName+' '+s.animationDuration:'',filt:s.filter!=='none'?s.filter:'',mask:s.maskImage&&s.maskImage!=='none'?s.maskImage:'',z:s.zIndex!=='auto'?s.zIndex:'',a:anc(e)});
   });
   const svgs=[];document.querySelectorAll('svg').forEach(e=>{const r=e.getBoundingClientRect();if(r.width<2)return;svgs.push({r:R(e),a:anc(e),html:e.outerHTML.length<20000?e.outerHTML:e.outerHTML.slice(0,200)+'...TRUNC',len:e.outerHTML.length})});
   const appear=document.getElementById('__framer__appearAnimationsContent');
   const bps=document.getElementById('__framer__breakpoints');
   const iframes=[...document.querySelectorAll('iframe')].map(f=>({src:f.src,r:R(f)}));
   const scripts=[...document.querySelectorAll('script[src]')].map(s=>s.src);
   const fonts=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight+' '+f.style);
   const forms=[...document.querySelectorAll('form,input,select,textarea,label')].map(e=>({tag:e.tagName,type:e.type,name:e.name,ph:e.placeholder,r:R(e)}));
   return {H:document.documentElement.scrollHeight,title:document.title,texts,boxes,svgs,appear:appear?appear.textContent:'',bps:bps?bps.textContent:'',iframes,scripts,fonts,forms,res:performance.getEntriesByType('resource').map(e=>e.name)};
  });
  data.pre=pre;data.reqs=reqs;
  fs.writeFileSync(OUT+`${slug}-${w}.json`,JSON.stringify(data,null,1));
  await page.screenshot({path:OUT+`${slug}-${w}.png`,fullPage:true});
  console.log(slug,w,'H',data.H,'texts',data.texts.length,'boxes',data.boxes.length,'svgs',data.svgs.length,'iframes',JSON.stringify(data.iframes));
  await ctx.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
