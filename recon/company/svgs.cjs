const {chromium}=require('playwright');const fs=require('fs');const crypto=require('crypto');
const skip=new Set(['Variant 1','Closed','siena','“','content','Open roles']);
(async()=>{const b=await chromium.launch();const manifest=[];
for(const r of ['about-us','community','partner-with-siena','refer-a-friend']){
const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto('https://www.siena.cx/'+r,{waitUntil:'load',timeout:60000});await p.waitForTimeout(2000);
const list=await p.evaluate(()=>{
 function resolve(svg){const c=svg.cloneNode(true);let guard=0;
  while(c.querySelector('use')&&guard++<20){c.querySelectorAll('use').forEach(u=>{const id=(u.getAttribute('href')||u.getAttribute('xlink:href')||'').slice(1);const ref=document.getElementById(id);if(!ref){u.remove();return}
   let g;if(ref.tagName.toLowerCase()==='symbol'){g=document.createElementNS('http://www.w3.org/2000/svg','g');[...ref.childNodes].forEach(n=>g.appendChild(n.cloneNode(true)));const vb=ref.getAttribute('viewBox');if(vb&&!c.getAttribute('viewBox'))c.setAttribute('viewBox',vb)}else g=ref.cloneNode(true);
   g.removeAttribute&&g.removeAttribute('id');u.replaceWith(g)})}
  // copy defs referenced (gradients/clipPaths) by url(#id)
  const ids=new Set();(c.outerHTML.match(/url\(#([^)]+)\)/g)||[]).forEach(m=>ids.add(m.slice(5,-1)));
  if(ids.size){const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');ids.forEach(id=>{const e=document.getElementById(id);if(e&&!c.querySelector('#'+CSS.escape(id)))defs.appendChild(e.cloneNode(true))});c.insertBefore(defs,c.firstChild)}
  c.setAttribute('xmlns','http://www.w3.org/2000/svg');c.removeAttribute('style');const r=svg.getBoundingClientRect();c.setAttribute('width',Math.round(r.width));c.setAttribute('height',Math.round(r.height));
  return c.outerHTML.replace(/currentColor/g,getComputedStyle(svg).color)}
 return [...document.querySelectorAll('svg')].filter(s=>!s.parentElement.closest('svg')&&!s.closest('nav')&&s.getBoundingClientRect().width>0).map(s=>({n:s.closest('[data-framer-name]')?.getAttribute('data-framer-name')||'svg',w:Math.round(s.getBoundingClientRect().width),h:Math.round(s.getBoundingClientRect().height),y:Math.round(s.getBoundingClientRect().top+scrollY),html:resolve(s)}))});
const seen=new Set();let i=0;
const NAMES={'partner-with-siena':['partner-horatio','partner-arcticgrey','partner-gorgias','partner-zendesk','partner-kustomer','partner-gladly','partner-klaviyo','partner-recharge','partner-shopify','partner-stayai','partner-skio','partner-ordergroove','partner-intercom'],'about-us':['about-us-flow'],'refer-a-friend':['refer-a-friend-step-line'],'community':Array.from({length:29},(_,k)=>'community-logo-'+String(k).padStart(2,'0'))};let k=0;
for(const s of list){if(skip.has(s.n)||s.n==='svg')continue;const h=crypto.createHash('md5').update(s.html).digest('hex');if(seen.has(h))continue;seen.add(h);
 if(s.y>document_footer(list))continue;
 const name=(NAMES[r]&&NAMES[r][k++]||r+'-'+k)+'.svg';
 fs.writeFileSync('/Users/riyaghosh/V3/siena/public/svg/'+name,s.html);fs.mkdirSync('svg-backup',{recursive:true});fs.writeFileSync('svg-backup/'+name,s.html);manifest.push(`${r}\t${s.n}\t${s.w}x${s.h}\ty=${s.y}\tpublic/svg/${name}\t${s.html.length}b`)}
await p.close()}
function document_footer(){return 1e9}
fs.writeFileSync('svg-manifest.tsv',manifest.join('\n'));console.log(manifest.join('\n'));await b.close()})()
