const {chromium}=require('playwright');const fs=require('fs');
const route=process.argv[2]||'partner-with-siena',W=+process.argv[3]||1440;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:900}});
await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:60000});await p.waitForTimeout(2500);
await p.evaluate(()=>document.querySelectorAll('[class*=cky]').forEach(e=>e.remove()));
const before=await p.evaluate(()=>document.querySelectorAll('form').length);
const btn=p.getByText('Become a partner',{exact:true}).first();
console.log('btn tag',await btn.evaluate(e=>{const a=e.closest('a,button');return a.outerHTML.slice(0,300)}));
await btn.click();
const t=[];for(let i=0;i<10;i++){t.push(await p.evaluate(()=>{const o=[...document.querySelectorAll('body *')].filter(e=>{const c=getComputedStyle(e);return (c.position==='fixed')&&e.getBoundingClientRect().width>300&&e.getBoundingClientRect().height>300});return o.map(e=>e.className.toString().slice(0,30)+' op'+getComputedStyle(e).opacity+' tf'+getComputedStyle(e).transform+' bg'+getComputedStyle(e).backgroundColor).join(' || ')}));await p.waitForTimeout(60)}
console.log('overlay over time:\n'+t.join('\n'));
await p.waitForTimeout(800);
console.log('url',p.url(),'forms',before,'->',await p.evaluate(()=>document.querySelectorAll('form').length));
await p.screenshot({path:`${route}-modal-${W}.png`});
const dump=await p.evaluate(()=>{const fx=[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position==='fixed'&&e.getBoundingClientRect().width>300&&e.getBoundingClientRect().height>300);
 const out=[];const walk=(el,d)=>{const c=getComputedStyle(el);if(c.display==='none')return;const r=el.getBoundingClientRect();if(r.width===0)return;const t=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join('');
  const a=el.dataset&&el.dataset.border==='true'?getComputedStyle(el,'::after'):null;
  const s=[];if(t)s.push('"'+t.slice(0,200)+'" '+c.fontFamily.split(',')[0]+' '+c.fontWeight+' '+c.fontSize+'/'+c.lineHeight+' ls'+c.letterSpacing+' '+c.color+' '+c.textAlign);
  if(c.backgroundColor!=='rgba(0, 0, 0, 0)')s.push('bg '+c.backgroundColor);if(c.backgroundImage!=='none')s.push('bgi '+c.backgroundImage.slice(0,150));if(c.padding!=='0px')s.push('pad '+c.padding);if(c.display.includes('flex'))s.push(c.flexDirection+' gap'+c.gap+' jc'+c.justifyContent+' ai'+c.alignItems);if(c.borderRadius!=='0px')s.push('rad '+c.borderRadius);if(a)s.push('border '+a.borderWidth+' '+a.borderStyle+' '+a.borderColor);if(c.boxShadow!=='none')s.push('sh '+c.boxShadow.slice(0,200));if(c.backdropFilter&&c.backdropFilter!=='none')s.push('bdf '+c.backdropFilter);if(c.opacity!=='1')s.push('op '+c.opacity);
  if(['INPUT','TEXTAREA','SELECT'].includes(el.tagName))s.push(`FIELD type=${el.type} name=${el.name} ph="${el.placeholder}" req=${el.required}`+(el.tagName==='SELECT'?' opts='+[...el.options].map(o=>o.text).join('|'):'')+(el.type==='checkbox'?' checked='+el.checked:''));
  if(el.tagName==='IMG')s.push('img '+el.currentSrc.split('/').pop().split('?')[0]+' '+el.naturalWidth+'x'+el.naturalHeight+' fit '+c.objectFit);
  if(s.length||el.getAttribute('data-framer-name'))out.push(' '.repeat(d)+el.tagName+'['+(el.getAttribute('data-framer-name')||'')+'] '+Math.round(r.left)+','+Math.round(r.top)+' '+Math.round(r.width)+'x'+Math.round(r.height)+' '+s.join(' ; '));
  if(el.tagName!=='svg')[...el.children].forEach(ch=>walk(ch,d+1))};fx.forEach(f=>walk(f,0));return out});
fs.writeFileSync(`${route}-modal-${W}.txt`,dump.join('\n'));console.log(dump.filter(l=>!/name=(website|company|message|subject|title|description|feedback|notes|details|remarks|comments) ph=""/.test(l)).join('\n').slice(0,9000));
await b.close()})()
