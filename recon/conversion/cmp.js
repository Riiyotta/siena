(async()=>{const out={};
const t=document.querySelector('table');
if(t){let c=t.parentElement;for(let k=0;k<4&&c;k++){if(c.querySelector('style'))break;c=c.parentElement}
 out.tableStyles=[...(c||t.parentElement).querySelectorAll('style')].map(s=>s.textContent).join('\n');
 out.tableHTML=t.outerHTML.replace(/\s+/g,' ');
 const S=e=>{const s=getComputedStyle(e);return `${s.fontFamily.split(',')[0]} ${s.fontWeight} ${s.fontSize}/${s.lineHeight} ls:${s.letterSpacing} c:${s.color} p:${s.padding} bg:${s.backgroundColor} bb:${s.borderBottom} br:${s.borderRight} va:${s.verticalAlign} w:${e.getBoundingClientRect().width}`};
 out.cellStyles={th0:S(t.querySelector('th')),th1:S(t.querySelectorAll('th')[1]),td0:S(t.querySelector('td')),td1:S(t.querySelectorAll('td')[1]),td2:S(t.querySelectorAll('td')[2]),table:S(t)+' bc:'+getComputedStyle(t).borderCollapse+' bs:'+getComputedStyle(t).borderSpacing+' rad:'+getComputedStyle(t).borderRadius+' border:'+getComputedStyle(t).border,wrap:(()=>{const p=t.parentElement;const s=getComputedStyle(p);return p.tagName+' ov:'+s.overflowX+' w:'+p.getBoundingClientRect().width})()};
 const sp=t.querySelector('td span');if(sp){const d=sp.parentElement;out.cellInner=d.outerHTML.slice(0,600);out.cellInnerStyle=getComputedStyle(d).display+' gap:'+getComputedStyle(d).gap+' ai:'+getComputedStyle(d).alignItems}
}
// ticker
const sec=[...document.querySelectorAll('section')].find(s=>getComputedStyle(s).maskImage!=='none'||s.getBoundingClientRect().width>1000);
if(sec){const ul=sec.querySelector('ul')||sec.firstElementChild;const items=[...ul.children];
 const x0=items[0].getBoundingClientRect().x;const t0=performance.now();await new Promise(r=>setTimeout(r,1000));const x1=items[0].getBoundingClientRect().x;const dt=performance.now()-t0;
 out.ticker={secRect:sec.getBoundingClientRect().toJSON(),mask:getComputedStyle(sec).maskImage,ulTag:ul.tagName,gap:getComputedStyle(ul).gap,n:items.length,speedPxPerS:(x1-x0)/(dt/1000),
  items:items.slice(0,40).map(li=>{const r=li.getBoundingClientRect();const img=li.querySelector('img');const svg=li.querySelector('svg');const bgEl=[...li.querySelectorAll('*')].find(e=>getComputedStyle(e).backgroundImage.startsWith('url'));
   return {w:Math.round(r.width),h:Math.round(r.height),name:(li.querySelector('[data-framer-name]')||li).getAttribute('data-framer-name'),img:img?(img.currentSrc||img.src).split('/').pop().split('?')[0]:null,svg:svg?svg.outerHTML.length:0,bg:bgEl?getComputedStyle(bgEl).backgroundImage.slice(0,60):null,aria:li.getAttribute('aria-hidden')}})};}
// FAQ
const qs=[...document.querySelectorAll('[data-framer-name]')].filter(e=>/FAQ|Accordion|Question/i.test(e.getAttribute('data-framer-name')));
out.faqNames=[...new Set(qs.map(e=>e.getAttribute('data-framer-name')))];
return out})()
