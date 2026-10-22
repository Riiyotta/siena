const {chromium}=require('playwright');const fs=require('fs');
const [r,w,stickyName,blockSel,...extra]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+w>800?900:844}});
await p.goto('https://www.siena.cx/'+r,{waitUntil:'load',timeout:120000});await p.waitForTimeout(3000);
await p.evaluate(()=>document.querySelectorAll('.cky-consent-container,.cky-overlay').forEach(e=>e.remove()));
const slug=r.replace(/\//g,'_');
const dumpEl=(name)=>p.evaluate((name)=>{const rgb=c=>{const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return c;const p=m[1].split(',').map(x=>+x);const h='#'+p.slice(0,3).map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();return p.length>3&&p[3]!==1?`${h}/${p[3]}`:h};
 const root=[...document.querySelectorAll(`[data-framer-name="${name}"]`)].find(e=>e.getBoundingClientRect().height>0);if(!root)return 'NF';const L=[];
 const walk=(e,d)=>{const c=getComputedStyle(e);if(c.display==='none')return;const bb=e.getBoundingClientRect();if(+c.opacity<0.02&&e!==root){L.push(`${'  '.repeat(d)}(hidden op${c.opacity}) ${e.getAttribute('data-framer-name')||e.tagName}`);return}
  const own=[...e.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
  let s=`${'  '.repeat(d)}${e.tagName.toLowerCase()}${e.getAttribute('data-framer-name')?' "'+e.getAttribute('data-framer-name').slice(0,40)+'"':''} [${Math.round(bb.x)},${Math.round(bb.y)},${Math.round(bb.width)}x${Math.round(bb.height)}]`;
  if(c.display==='flex')s+=` flex-${c.flexDirection} gap:${c.gap}`;if(c.padding!=='0px')s+=` p:${c.padding}`;if(c.backgroundColor!=='rgba(0, 0, 0, 0)')s+=` bg:${rgb(c.backgroundColor)}`;if(c.backgroundImage!=='none')s+=` bgi:${c.backgroundImage.slice(0,120)}`;if(c.borderRadius!=='0px')s+=` r:${c.borderRadius}`;if(c.boxShadow!=='none')s+=` sh:${c.boxShadow}`;if(c.opacity!=='1')s+=` op:${c.opacity}`;if(c.transform!=='none')s+=` tf:${c.transform}`;if(c.filter!=='none')s+=` filter:${c.filter}`;if(c.backdropFilter!=='none')s+=` bf:${c.backdropFilter}`;
  if(e.tagName==='IMG')s+=` src:${(e.currentSrc||e.src).split('/').pop().split('?')[0]} fit:${c.objectFit}`;if(e.tagName==='VIDEO')s+=` video:${(e.currentSrc||e.src).split('/').pop()} paused:${e.paused} t:${e.currentTime.toFixed(1)}`;
  if(own&&e.tagName!=='SPAN')s+=` TEXT"${own.slice(0,200)}" {${c.fontFamily.split(',')[0].replace(/"/g,'')} ${c.fontWeight} ${c.fontSize}/${c.lineHeight} ${rgb(c.color)}}`;
  if(e.tagName==='svg'||e.tagName==='DOTLOTTIE-PLAYER'){L.push(s);return}L.push(s);[...e.children].forEach(k=>walk(k,d+1))};walk(root,0);return L.join('\n')},name);
const out=[];
if(blockSel){const blocks=blockSel.split('|');
 for(const bn of blocks){const y=await p.evaluate((bn)=>{const e=[...document.querySelectorAll(`[data-framer-name="${bn}"]`)].find(e=>e.getBoundingClientRect().height>300);const bb=e.getBoundingClientRect();return bb.y+scrollY+bb.height/2-450},bn);
  await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(4500);
  out.push(`######## block ${bn} scrollY=${Math.round(y)}\n`+await dumpEl(stickyName));
  const el=await p.$(`[data-framer-name="${stickyName}"]`);if(el)await el.screenshot({path:`${slug}-${w}-${stickyName.replace(/\W+/g,'_')}-${bn.replace(/\W+/g,'_')}.png`}).catch(e=>out.push('shotfail '+e.message));}}
for(const ex of extra){const [name,wait]=ex.split('@');const y=await p.evaluate((n)=>{const e=[...document.querySelectorAll(`[data-framer-name="${n}"]`)].find(e=>e.getBoundingClientRect().height>0);const bb=e.getBoundingClientRect();return bb.y+scrollY-100},name);
 await p.evaluate(y=>window.scrollTo(0,y),y);const t=+(wait||6000);
 for(const ts of [800,1600,2600,4000,t]){await p.waitForTimeout(ts-(out._last||0));out._last=ts;out.push(`######## ${name} t=${ts}ms\n`+await dumpEl(name));}out._last=0;
 const el=await p.$(`[data-framer-name="${name}"]`);if(el)await el.screenshot({path:`${slug}-${w}-${name.replace(/\W+/g,'_')}.png`}).catch(()=>{});}
fs.writeFileSync(`${slug}-${w}-stages.txt`,out.join('\n'));console.log('ok');await b.close()})();
