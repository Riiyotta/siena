const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
 const b=await chromium.launch();
 const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
 try{await p.goto('https://www.siena.cx/insights',{waitUntil:'networkidle',timeout:60000});}catch(e){}
 await p.waitForTimeout(1500);
 const res=await p.evaluate(()=>{
  const resolve=svg=>{const c=svg.cloneNode(true);c.querySelectorAll('use').forEach(u=>{const id=(u.getAttribute('href')||u.getAttribute('xlink:href')||'').replace('#','');const ref=document.getElementById(id);if(ref){const g=document.createElementNS('http://www.w3.org/2000/svg','g');let inner=ref.cloneNode(true);if(inner.tagName.toLowerCase()==='svg'||inner.tagName.toLowerCase()==='symbol'){if(!c.getAttribute('viewBox')&&inner.getAttribute('viewBox'))c.setAttribute('viewBox',inner.getAttribute('viewBox'));[...inner.childNodes].forEach(n=>g.appendChild(n.cloneNode(true)));}else g.appendChild(inner);u.replaceWith(g);}});c.setAttribute('xmlns','http://www.w3.org/2000/svg');const r=svg.getBoundingClientRect();if(!c.getAttribute('width'))c.setAttribute('width',Math.round(r.width));if(!c.getAttribute('height'))c.setAttribute('height',Math.round(r.height));return c.outerHTML;};
  const tiles=[...document.querySelectorAll('[data-framer-name="integrations"]')].filter(e=>getComputedStyle(e).display==='flex');
  const out={tiles:tiles.map((t,i)=>{const s=t.querySelector('svg');const img=t.querySelector('img');const r=(s||t).getBoundingClientRect();return {i,svg:s?resolve(s):null,img:img?img.src:null,text:t.innerText.trim(),w:Math.round(r.width),h:Math.round(r.height),color:s?getComputedStyle(s).color:''}})};
  return out;
 });
 const names=['salesforce','zendesk','qualtrics','looker','discord','tableau','typeform','more'];
 res.tiles.forEach((t,i)=>{if(t.svg){fs.writeFileSync(`/Users/riyaghosh/V3/siena/public/svg/insights-integration-${names[i]}.svg`,t.svg);}console.log(i,names[i],t.w,t.h,t.text,t.img,t.svg?t.svg.length:0,t.color)});
 await b.close();
})();
