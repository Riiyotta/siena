const {chromium}=require('playwright');const fs=require('fs');const crypto=require('crypto');
const SV='/Users/riyaghosh/V3/siena/public/svg/';
const existing=new Set(fs.readdirSync(SV).filter(f=>!/^(shopping-agent|social-agent|ai-review-management|qa-agent|topics-explorer|ask-siena)-/.test(f)).map(f=>crypto.createHash('md5').update(fs.readFileSync(SV+f,'utf8').replace(/\s+/g,'')).digest('hex')));
(async()=>{
 const b=await chromium.launch();const seen=new Map();const log=[];
 for(const route of ['shopping-agent','social-agent','ai-review-management','qa-agent','topics-explorer','ask-siena']){
  for(const W of [1440,390]){
  const p=await (await b.newContext({viewport:{width:W,height:900}})).newPage();
  await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:90000});await p.waitForTimeout(3000);
  const svgs=await p.evaluate(()=>{
    const main=[...document.querySelectorAll('[data-framer-name="Main"]')].find(e=>e.getBoundingClientRect().height>2000)||document.getElementById('main');
    const all=[...document.querySelectorAll('#main *')];
    return [...main.querySelectorAll('svg')].map(s=>{
      if(s.closest('[data-framer-name="Ticker"]')) return null; // tickers already extracted
      const r=s.getBoundingClientRect(); if(r.width<2) return null;
      let c=s.cloneNode(true);
      c.querySelectorAll('use').forEach(u=>{const id=(u.getAttribute('href')||u.getAttribute('xlink:href')||'').slice(1);const sym=document.getElementById(id);
        if(sym){const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.innerHTML=sym.innerHTML;if(!c.getAttribute('viewBox')&&sym.getAttribute('viewBox'))c.setAttribute('viewBox',sym.getAttribute('viewBox'));u.replaceWith(g);}});
      c.setAttribute('xmlns','http://www.w3.org/2000/svg');c.removeAttribute('style');c.removeAttribute('class');
      if(!c.getAttribute('viewBox')) c.setAttribute('viewBox',`0 0 ${Math.round(r.width)} ${Math.round(r.height)}`);
      c.setAttribute('width',Math.round(r.width));c.setAttribute('height',Math.round(r.height));
      let n=s; let name='';while(n&&!name){n=n.parentElement;name=n&&n.getAttribute('data-framer-name')||''}
      return {html:c.outerHTML,name,idx:all.indexOf(s),w:Math.round(r.width),h:Math.round(r.height),color:getComputedStyle(s).color};
    }).filter(Boolean).concat([...main.querySelectorAll('*')].filter(e=>!e.closest('[data-framer-name="Ticker"]')&&getComputedStyle(e).backgroundImage.startsWith('url("data:image/svg+xml')).map(e=>{const r=e.getBoundingClientRect();let u=getComputedStyle(e).backgroundImage.slice(5,-2);let txt=decodeURIComponent(u.replace(/^data:image\/svg\+xml(;charset=utf-8)?,/,''));let name=e.getAttribute('data-framer-name')||'';let n=e;while(n&&!name){n=n.parentElement;name=n&&n.getAttribute('data-framer-name')||''}return {html:txt,name:name+'-bg',idx:all.indexOf(e),w:Math.round(r.width),h:Math.round(r.height)}}))});
  for(const s of svgs){const h=crypto.createHash('md5').update(s.html.replace(/\s+/g,'').replace(/width="\d+"|height="\d+"/g,'')).digest('hex');
    if(existing.has(crypto.createHash('md5').update(s.html.replace(/\s+/g,'')).digest('hex'))) continue;
    if(seen.has(h)){seen.get(h).uses.push(route+'@'+W+'#'+s.idx);continue;}
    const fname=(route+'-'+(s.name||'icon')).replace(/[^A-Za-z0-9-]+/g,'-').replace(/-+/g,'-').slice(0,60)+'-'+h.slice(0,5)+'.svg';
    fs.writeFileSync(SV+fname,s.html);fs.writeFileSync('/Users/riyaghosh/V3/siena/recon/pages-a/svg-backup/'+fname,s.html);seen.set(h,{fname,w:s.w,h:s.h,name:s.name,uses:[route+'@'+W+'#'+s.idx]});}
  await p.close();}
 }
 const out=[...seen.values()].map(v=>`${v.fname} ${v.w}x${v.h} [${v.name}] uses:${v.uses.slice(0,8).join(',')}${v.uses.length>8?'+'+(v.uses.length-8):''}`);
 fs.writeFileSync('/Users/riyaghosh/V3/siena/recon/pages-a/svgs.txt',out.join('\n'));console.log(out.length);await b.close();
})();
