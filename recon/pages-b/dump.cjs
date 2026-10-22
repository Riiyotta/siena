const {chromium}=require('playwright');
const [r,w,...sels]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+w>800?900:844}});
await p.goto('https://www.siena.cx/'+r,{waitUntil:'load',timeout:120000});await p.waitForTimeout(3000);
const H=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<H;y+=500){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(120);}await p.waitForTimeout(2500);await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(300);
for(const sel of sels){const out=await p.evaluate(([sel])=>{const [q,idx,maxd]=sel.split('@');const roots=[...document.querySelectorAll(q.startsWith('[')||q.startsWith('#')||q.startsWith('.')?q:`[data-framer-name="${q}"]`)].filter(e=>!e.closest('nav'));const root=roots[+(idx||0)];if(!root)return 'NOTFOUND '+sel;
 const rgb=c=>{const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return c;const p=m[1].split(',').map(x=>+x);const h='#'+p.slice(0,3).map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();return p.length>3&&p[3]!==1?`${h}/${p[3]}`:h};
 const L=[];const walk=(e,d)=>{if(d>(+maxd||12))return;const c=getComputedStyle(e);if(c.display==='none')return;const bb=e.getBoundingClientRect();if(bb.width===0&&bb.height===0){[...e.children].forEach(k=>walk(k,d));return}
  const own=[...e.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
  let s=`${'  '.repeat(d)}${e.tagName.toLowerCase()}${e.getAttribute('data-framer-name')?' "'+e.getAttribute('data-framer-name')+'"':''} [${Math.round(bb.x)},${Math.round(bb.y+scrollY)},${Math.round(bb.width)}x${Math.round(bb.height)}]`;
  if(c.display==='flex')s+=` flex-${c.flexDirection} gap:${c.gap} jc:${c.justifyContent} ai:${c.alignItems}${c.flexWrap!=='nowrap'?' wrap':''}`;if(c.display==='grid')s+=` grid cols:${c.gridTemplateColumns} gap:${c.gap}`;
  if(c.padding!=='0px')s+=` p:${c.padding}`;if(c.backgroundColor!=='rgba(0, 0, 0, 0)')s+=` bg:${rgb(c.backgroundColor)}`;if(c.backgroundImage!=='none')s+=` bgi:${c.backgroundImage.slice(0,220)}`;
  if(c.borderTopWidth!=='0px'&&c.borderTopStyle!=='none')s+=` border:${c.borderTopWidth} ${c.borderTopStyle} ${rgb(c.borderTopColor)}`;if(c.borderBottomWidth!=='0px'&&c.borderBottomStyle!=='none'&&c.borderTopWidth==='0px')s+=` border-b:${c.borderBottomWidth} ${rgb(c.borderBottomColor)}`;
  if(c.borderRadius!=='0px')s+=` r:${c.borderRadius}`;if(c.boxShadow!=='none')s+=` sh:${c.boxShadow}`;if(c.opacity!=='1')s+=` op:${c.opacity}`;if(c.position==='absolute'||c.position==='fixed'||c.position==='sticky')s+=` ${c.position}(t:${c.top} r:${c.right} b:${c.bottom} l:${c.left})`;
  if(c.overflow!=='visible')s+=` ov:${c.overflow}`;if(c.maxWidth!=='none')s+=` maxw:${c.maxWidth}`;if(c.backdropFilter!=='none')s+=` bf:${c.backdropFilter}`;if(c.filter!=='none')s+=` filter:${c.filter}`;if(c.transform!=='none')s+=` tf:${c.transform}`;if(c.mixBlendMode!=='normal')s+=` blend:${c.mixBlendMode}`;if(c.zIndex!=='auto')s+=` z:${c.zIndex}`;
  if(e.tagName==='IMG')s+=` src:${(e.currentSrc||e.src).split('/').pop().split('?')[0]} fit:${c.objectFit} pos:${c.objectPosition}`;
  if(e.tagName==='VIDEO')s+=` video:${e.currentSrc||e.src} fit:${c.objectFit} loop:${e.loop} muted:${e.muted} autoplay:${e.autoplay}`;
  if(own)s+=` TEXT"${own.slice(0,300)}" {${c.fontFamily.split(',')[0].replace(/"/g,'')} ${c.fontWeight}${c.fontStyle==='italic'?'i':''} ${c.fontSize}/${c.lineHeight} ls:${c.letterSpacing} ${rgb(c.color)}${c.textTransform!=='none'?' '+c.textTransform:''} ${c.textAlign}}`;
  if(e.tagName==='svg'){s+=` svg col:${rgb(c.color)}`;L.push(s);return}
  L.push(s);[...e.children].forEach(k=>walk(k,d+1))};walk(root,0);return L.join('\n')},[sel]);console.log('##### '+sel+'\n'+out)}
await b.close();})();
