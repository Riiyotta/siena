const {chromium}=require('playwright');const fs=require('fs');
const [,,url,slug,w]=process.argv;const W=+(w||1440);
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:W>800?900:844}});const p=await ctx.newPage();
await p.goto(url,{waitUntil:'networkidle',timeout:90000});await p.waitForTimeout(1200);
await p.evaluate(()=>{document.querySelectorAll('[class*="cky"]').forEach(e=>e.remove())});
const blocks=await p.evaluate(()=>{const c=document.querySelector('[data-framer-name="Scroll Area"] [data-framer-name="Content"]');if(!c)return [];return [...c.children].map(k=>{const r=k.getBoundingClientRect();return {y:r.top+scrollY,h:r.height,name:k.getAttribute('data-framer-name')}})});
const res=[];
for(let i=0;i<blocks.length;i++){const bl=blocks[i];
 // record timeline while scrolling into block
 await p.evaluate(y=>scrollTo(0,y),Math.round(bl.y+bl.h/2-450));
 await p.waitForTimeout(3500);
 const snap=await p.evaluate(()=>{const st=document.querySelector('[data-framer-name="Sticky"]');if(!st)return null;const R=st.getBoundingClientRect();
  const card=[...st.querySelectorAll('[data-framer-name]')].find(e=>e.getBoundingClientRect().width>300);
  const items=[];st.querySelectorAll('*').forEach(e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return;const s=getComputedStyle(e);if(s.visibility==='hidden'||+s.opacity===0)return;
   let own='';e.childNodes.forEach(c=>{if(c.nodeType===3)own+=c.textContent});own=own.trim();
   const n=e.getAttribute('data-framer-name');const bg=s.backgroundColor!=='rgba(0, 0, 0, 0)'?s.backgroundColor:'';const bgi=s.backgroundImage!=='none'?s.backgroundImage.slice(0,200):'';
   if(!(own||e.tagName==='IMG'||bg||bgi||e.tagName==='svg'||(n&&s.display.includes('flex'))))return;
   items.push({tag:e.tagName,n:n&&n.length<60?n:(n?'(long)':''),x:Math.round(r.x-R.x),y:Math.round(r.y-R.y),w:Math.round(r.width),h:Math.round(r.height),t:own.slice(0,200),src:e.tagName==='IMG'?(e.currentSrc||e.src).split('/').pop().split('?')[0]:'',of:e.tagName==='IMG'?s.objectFit:'',font:own?`${s.fontFamily.split(',')[0]} ${s.fontWeight}${s.fontStyle==='italic'?'i':''} ${s.fontSize}/${s.lineHeight} ls:${s.letterSpacing} ${s.color} ${s.textTransform==='none'?'':s.textTransform}`:'',bg,bgi,rad:s.borderRadius!=='0px'?s.borderRadius:'',p:s.padding!=='0px'?s.padding:'',d:s.display.includes('flex')?`${s.flexDirection} jc:${s.justifyContent} ai:${s.alignItems} gap:${s.gap}`:'',sh:s.boxShadow!=='none'?s.boxShadow:'',op:s.opacity!=='1'?s.opacity:'',bd:s.border!=='0px none rgb(0, 0, 0)'&&s.borderWidth!=='0px'?s.border:'',svg:e.tagName==='svg'?e.outerHTML.slice(0,300):''})});
  return {stickyRect:[R.x,R.y,R.width,R.height].map(Math.round),cardName:card&&card.getAttribute('data-framer-name'),items}});
 await p.screenshot({path:`${slug}-sticky-${W}-${i+1}.png`});
 res.push({block:bl,snap});}
// timing of entrance for block 2 (scroll from block1 to block2 & sample)
fs.writeFileSync(`sticky-${slug}-${W}.json`,JSON.stringify({blocks,res},null,1));
await b.close();})();
