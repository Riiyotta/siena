const {chromium}=require('playwright');
const fs=require('fs');
const OUT='/Users/riyaghosh/V3/siena/recon/pages-b/';
const routes=(process.argv[2]||'memory,video,order-tracking,products/docs,ai-lab,roi-calculator').split(',');
const vps=(process.argv[3]||'1440,390').split(',').map(Number);
(async()=>{
const browser=await chromium.launch();
for(const r of routes){ for(const w of vps){
  const ctx=await browser.newContext({viewport:{width:w,height:w>800?900:844},deviceScaleFactor:1});
  const page=await ctx.newPage();
  const net=[];
  page.on('response',resp=>{const u=resp.url();const t=resp.request().resourceType();net.push({u,t,ct:resp.headers()['content-type']||''});});
  const url='https://www.siena.cx/'+r;
  await page.goto(url,{waitUntil:'load',timeout:90000}).catch(e=>console.log('goto',e.message));await page.waitForTimeout(4000);
  const appear=await page.evaluate(()=>{const s=document.getElementById('__framer__appearAnimationsContent');return s?s.textContent:null});
  // dismiss cookie
  await page.evaluate(()=>{document.querySelectorAll('.cky-consent-container,.cky-overlay').forEach(e=>e.remove())});
  // scroll through
  console.log(r,w,'loaded');const H=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<H+1000;y+=300){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(120);}
  await page.waitForTimeout(1500);
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(800);
  console.log(r,w,'scrolled');const slug=r.replace(/\//g,'_');
  await page.screenshot({path:OUT+`${slug}-${w}.png`,fullPage:true,timeout:120000}).catch(e=>console.log('shot',e.message));
  const data=await page.evaluate(()=>{
    const hex=c=>c;
    const cs=e=>getComputedStyle(e);
    const box=e=>{const b=e.getBoundingClientRect();return [Math.round(b.x),Math.round(b.y+scrollY),Math.round(b.width),Math.round(b.height)]};
    const main=document.querySelector('main')||document.querySelector('#main');
    const root=document.querySelector('#main > div')||document.body;
    // top-level sections: find the page root flex column children
    let secRoot=document.querySelector('#main');
    const secs=[secRoot].filter(e=>e.getBoundingClientRect().height>0);
    const fonts=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight+' '+f.style);
    const visible=e=>{const s=cs(e);const b=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&b.width>0&&b.height>0};
    const out=secs.map((s,i)=>{
      const st=cs(s);
      const texts=[],imgs=[],deco=[],svgs=[],vids=[];
      s.querySelectorAll('*').forEach(e=>{
        if(e.closest('nav')||!visible(e))return;
        const c=cs(e);
        if(e.tagName==='IMG'){imgs.push({src:e.currentSrc||e.src,alt:e.alt,b:box(e),fit:c.objectFit,pos:c.objectPosition,nat:[e.naturalWidth,e.naturalHeight],r:c.borderRadius});return;}
        if(e.tagName==='VIDEO'){vids.push({src:e.currentSrc||e.src,poster:e.poster,b:box(e),fit:c.objectFit,loop:e.loop,muted:e.muted,autoplay:e.autoplay,r:c.borderRadius});return;}
        if(e.tagName==='svg'&&!e.closest('svg svg')){svgs.push({b:box(e),fill:c.fill,color:c.color,html:e.outerHTML.length});}
        const own=[...e.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
        if(own){texts.push({t:own.slice(0,200),tag:e.tagName,b:box(e),ff:c.fontFamily.split(',')[0],fs:c.fontSize,lh:c.lineHeight,ls:c.letterSpacing,fw:c.fontWeight,fst:c.fontStyle==='italic'?'i':undefined,col:c.color,tt:c.textTransform!=='none'?c.textTransform:undefined,ta:c.textAlign,href:e.closest('a')?.getAttribute('href')||undefined,grad:c.backgroundImage!=='none'&&c.webkitBackgroundClip==='text'?c.backgroundImage:undefined});}
        const hasBg=c.backgroundColor!=='rgba(0, 0, 0, 0)'||c.backgroundImage!=='none';
        const hasB=c.borderTopWidth!=='0px'&&c.borderTopStyle!=='none';
        const hasSh=c.boxShadow!=='none';
        const bb=e.getBoundingClientRect();
        if((hasBg||hasB||hasSh||c.backdropFilter!=='none')&&bb.width>20&&bb.height>20&&e.tagName!=='svg'&&!(e.closest('svg'))){
          deco.push({n:e.getAttribute('data-framer-name')||undefined,tag:e.tagName,b:box(e),bg:c.backgroundColor!=='rgba(0, 0, 0, 0)'?c.backgroundColor:undefined,bi:c.backgroundImage!=='none'?c.backgroundImage.slice(0,300):undefined,bd:hasB?`${c.borderTopWidth} ${c.borderTopStyle} ${c.borderTopColor}`:undefined,r:c.borderRadius!=='0px'?c.borderRadius:undefined,sh:hasSh?c.boxShadow:undefined,bf:c.backdropFilter!=='none'?c.backdropFilter:undefined,p:c.padding!=='0px'?c.padding:undefined,d:c.display==='flex'?(c.flexDirection+' gap'+c.gap+' jc:'+c.justifyContent+' ai:'+c.alignItems):(c.display==='grid'?('grid '+c.gridTemplateColumns+' gap'+c.gap):undefined),op:c.opacity!=='1'?c.opacity:undefined,tf:c.transform!=='none'?c.transform:undefined});
        }
      });
      return {i,n:s.getAttribute('data-framer-name'),tag:s.tagName,b:box(s),bg:st.backgroundColor,bi:st.backgroundImage!=='none'?st.backgroundImage.slice(0,300):undefined,p:st.padding,d:st.display+' '+st.flexDirection+' gap'+st.gap+' jc:'+st.justifyContent+' ai:'+st.alignItems,ov:st.overflow,texts,imgs,vids,svgs,deco};
    });
    // framer names tree (depth 4) for structure
    const tree=(e,d)=>{if(d>5||!visible(e))return null;const c=cs(e);const kids=[...e.children].map(k=>tree(k,d+1)).filter(Boolean);const n=e.getAttribute('data-framer-name');return {n:n||undefined,tag:e.tagName.toLowerCase(),b:box(e),lay:c.display==='flex'?`${c.flexDirection} g${c.gap} p${c.padding}`:(c.display==='grid'?`grid ${c.gridTemplateColumns} g${c.gap}`:undefined),pos:c.position!=='static'&&c.position!=='relative'?c.position+(c.position==='sticky'?' top'+c.top:''):undefined,k:kids.length?kids:undefined}};
    return {H:document.documentElement.scrollHeight,title:document.title,fonts:[...new Set(fonts)],secRootName:secRoot.getAttribute('data-framer-name'),secs:out,tree:secs.map(s=>tree(s,0))};
  });
  data.appear=appear;
  data.net=[...new Map(net.filter(n=>/framerusercontent|\.mp4|\.webm|\.json|lottie|fonts\.gstatic|vimeo|youtube|mux/.test(n.u)).map(n=>[n.u,n])).values()];
  fs.writeFileSync(OUT+`${slug}-${w}.json`,JSON.stringify(data,null,0));
  console.log(r,w,'H',data.H,'secs',data.secs.length);
  await ctx.close();
}}
await browser.close();
})();
