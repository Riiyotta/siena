const {chromium}=require('playwright');
const [route,W,y,sec]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:+W,height:+W>800?900:844}})).newPage();
 await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:90000});await p.waitForTimeout(3500);
 for(let v=0;v<+y;v+=150){await p.evaluate(v=>scrollTo(0,v),v);await p.waitForTimeout(30);} await p.evaluate(v=>scrollTo(0,v),+y); await p.waitForTimeout(+(process.env.WAIT||2000));
  const data=await p.evaluate(([SEC,IDX])=>{
    const hex=c=>c;
    const root=[...document.querySelectorAll('[data-framer-name]')].filter(e=>e.getAttribute('data-framer-name')===SEC&&e.offsetHeight>0)[IDX||0]||document.getElementById('main');
    let n=root; while(n.children.length===1) n=n.children[0];
    // find container with most big children
    const lines=[];
    const all=[...document.querySelectorAll('#main *')];
    const idx=new Map(all.map((e,i)=>[e,i]));
    const sy=window.scrollY;
    function desc(e,d){
      const cs=getComputedStyle(e); const r=e.getBoundingClientRect();
      if(cs.display==='none') return;
      if((r.width===0&&r.height===0)||cs.display==='contents'){ if(e.tagName.toLowerCase()!=='svg') for(const c of e.children) desc(c,d); return; }
      const name=e.getAttribute('data-framer-name');
      const tag=e.tagName.toLowerCase();
      const direct=[...e.childNodes].filter(c=>c.nodeType===3&&c.textContent.trim()).map(c=>c.textContent.trim()).join(' ');
      const p=[];
      if(cs.display.includes('flex')) p.push(`flex ${cs.flexDirection} jc:${cs.justifyContent} ai:${cs.alignItems} gap:${cs.gap}`);
      if(cs.display.includes('grid')) p.push(`grid cols:${cs.gridTemplateColumns} rows:${cs.gridTemplateRows} gap:${cs.gap}`);
      if(cs.padding!=='0px') p.push('pad:'+cs.padding);
      if(cs.maxWidth!=='none') p.push('maxW:'+cs.maxWidth);
      if(cs.backgroundColor!=='rgba(0, 0, 0, 0)') p.push('bg:'+cs.backgroundColor);
      if(cs.backgroundImage!=='none') p.push('bgImg:'+cs.backgroundImage.slice(0,300));
      if(cs.borderRadius!=='0px') p.push('rad:'+cs.borderRadius);
      if(cs.borderTopWidth!=='0px'||cs.borderBottomWidth!=='0px'||cs.borderLeftWidth!=='0px') p.push(`border:${cs.borderTopWidth} ${cs.borderRightWidth} ${cs.borderBottomWidth} ${cs.borderLeftWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`);
      if(cs.boxShadow!=='none') p.push('shadow:'+cs.boxShadow);
      if(cs.position!=='static'&&cs.position!=='relative') p.push('pos:'+cs.position+` t:${cs.top} l:${cs.left} r:${cs.right} b:${cs.bottom}`);
      if(cs.opacity!=='1') p.push('op:'+cs.opacity);
      if(cs.overflow!=='visible') p.push('ovf:'+cs.overflow);
      if(cs.transform!=='none') p.push('tf:'+cs.transform);
      if(cs.mixBlendMode!=='normal') p.push('blend:'+cs.mixBlendMode);
      if(cs.filter!=='none') p.push('filter:'+cs.filter);
      if(cs.backdropFilter&&cs.backdropFilter!=='none') p.push('bdf:'+cs.backdropFilter);
      if(cs.maskImage&&cs.maskImage!=='none') p.push('mask:'+cs.maskImage.slice(0,200));
      if(cs.zIndex!=='auto') p.push('z:'+cs.zIndex);
      if(cs.transition&&cs.transition!=='all'&&!cs.transition.startsWith('all 0s')) p.push('trans:'+cs.transition);
      if(cs.animationName!=='none') p.push(`anim:${cs.animationName} ${cs.animationDuration} ${cs.animationTimingFunction} ${cs.animationIterationCount}`);
      if(cs.position==='sticky') p.push('STICKY top:'+cs.top);
      if(e.hasAttribute('data-framer-appear-id')) p.push('APPEAR:'+e.getAttribute('data-framer-appear-id'));
      if(tag==='a') p.push('href:'+e.getAttribute('href'));
      if(tag==='img') p.push(`img:${e.currentSrc||e.src} nat:${e.naturalWidth}x${e.naturalHeight} fit:${cs.objectFit} objpos:${cs.objectPosition} alt:${e.alt}`);
      if(tag==='video') p.push(`video:${e.currentSrc||e.src||(e.querySelector('source')||{}).src} auto:${e.autoplay} loop:${e.loop} muted:${e.muted} poster:${e.poster} fit:${cs.objectFit}`);
      if(tag==='iframe') p.push('iframe:'+e.src);
      if(tag==='canvas') p.push('CANVAS');
      if(tag==='svg'){ const u=e.querySelector('use'); p.push('SVG'+(u?' use:'+u.getAttribute('href'):'')+' vb:'+e.getAttribute('viewBox')); }
      let txt='';
      if(direct || ['h1','h2','h3','h4','h5','h6','p'].includes(tag)&&e.textContent.trim()&&!e.children.length){
        txt=` T"${(direct||e.textContent.trim()).slice(0,400)}" [${cs.fontFamily.split(',')[0]} ${cs.fontWeight} ${cs.fontStyle!=='normal'?cs.fontStyle:''} ${cs.fontSize}/${cs.lineHeight} ls:${cs.letterSpacing} c:${cs.color} ta:${cs.textAlign} tt:${cs.textTransform}${cs.textDecorationLine!=='none'?' td:'+cs.textDecorationLine:''}]`;
      }
      const interesting = name||txt||p.length||['img','svg','video','a','button','h1','h2','h3','p','canvas','iframe'].includes(tag);
      if(interesting && tag!=='path' && tag!=='g'){
        lines.push(`${' '.repeat(d)}#${idx.get(e)} <${tag}>${name?' ['+name+']':''} ${Math.round(r.x)},${Math.round(r.y+sy)} ${Math.round(r.width)}x${Math.round(r.height)} ${p.join(' ; ')}${txt}`);
      }
      if(tag==='svg') return;
      for(const c of e.children) desc(c, interesting?d+1:d);
    }
    desc(root,0);
    const fonts=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight+' '+f.style);
    return {lines};
  },[sec,+(process.env.IDX||0)]);
  console.log(data.lines.join('\n'));await b.close();})();
