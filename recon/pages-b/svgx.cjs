const {chromium}=require('playwright');const fs=require('fs');const crypto=require('crypto');
const SVGDIR='/Users/riyaghosh/V3/siena/public/svg/';const routes=process.argv[2].split(',');const w=+(process.argv[3]||1440);
const manifest={};const existing={};for(const f of fs.readdirSync(SVGDIR)){existing[crypto.createHash('md5').update(fs.readFileSync(SVGDIR+f,'utf8').replace(/\s+/g,' ')).digest('hex')]=f}
(async()=>{const b=await chromium.launch();for(const r of routes){const slug=r.replace(/\//g,'-');const p=await b.newPage({viewport:{width:w,height:w>800?900:844}});
await p.goto('https://www.siena.cx/'+r,{waitUntil:'load',timeout:120000});await p.waitForTimeout(3000);
const H=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<H;y+=500){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(100);}await p.waitForTimeout(1500);await p.evaluate(()=>window.scrollTo(0,0));
const svgs=await p.evaluate(()=>{const o=[];document.querySelectorAll('#main svg').forEach(s=>{if(s.closest('nav')||s.parentElement.closest('svg'))return;const bb=s.getBoundingClientRect();if(bb.width<8||bb.height<8)return;
 const c=s.cloneNode(true);c.querySelectorAll('use').forEach(u=>{const id=(u.getAttribute('href')||u.getAttribute('xlink:href')||'').replace('#','');const ref=document.getElementById(id);if(ref){const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.innerHTML=ref.innerHTML;if(ref.getAttribute('viewBox')&&!c.getAttribute('viewBox'))c.setAttribute('viewBox',ref.getAttribute('viewBox'));u.replaceWith(g)}});
 c.removeAttribute('style');c.setAttribute('xmlns','http://www.w3.org/2000/svg');if(!c.getAttribute('width')||c.getAttribute('width')==='100%'){c.setAttribute('width',Math.round(bb.width));c.setAttribute('height',Math.round(bb.height))}
 const col=getComputedStyle(s).color;let html=c.outerHTML.replace(/currentColor/g,col);
 let n=null,e=s;const names=[];while(e&&names.length<3){const nn=e.getAttribute&&e.getAttribute('data-framer-name');if(nn)names.push(nn);e=e.parentElement}
 o.push({names,y:Math.round(bb.y+scrollY),x:Math.round(bb.x),w:Math.round(bb.width),h:Math.round(bb.height),html,hasUse:/<use/.test(html)})});return o});
for(const s of svgs){const h=crypto.createHash('md5').update(s.html.replace(/ width="\d+" height="\d+"/,'')).digest('hex').slice(0,6);
 if(!manifest[h]){const ex=existing[crypto.createHash('md5').update(s.html.replace(/\s+/g,' ')).digest('hex')];const nm=(s.names[0]||'svg').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase()||'svg';const file=ex||`${slug}-${nm}-${h}.svg`;if(!ex)fs.writeFileSync(SVGDIR+file,s.html);manifest[h]={file,names:s.names,size:`${s.w}x${s.h}`,uses:[],hasUse:s.hasUse}}
 manifest[h].uses.push(`${r}@y${s.y}x${s.x}`)}
console.log(r,svgs.length);await p.close()}
fs.writeFileSync('/Users/riyaghosh/V3/siena/recon/pages-b/svg-manifest.json',JSON.stringify(manifest,null,1));await b.close()})();
