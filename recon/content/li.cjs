const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [r,w] of [['/terms-of-service',1440],['/privacy-policy',1440],['/terms-of-service',390]]){
const p=await (await b.newContext({viewport:{width:w,height:900}})).newPage();
try{await p.goto('https://www.siena.cx'+r,{waitUntil:'load',timeout:60000});}catch(e){}
await p.waitForTimeout(3000);
console.log(r,w,JSON.stringify(await p.evaluate(()=>{const f=(sel)=>{const li=document.querySelector(sel);if(!li)return null;const b=getComputedStyle(li,'::before'),m=getComputedStyle(li,'::marker'),c=getComputedStyle(li);return {sel,txt:li.textContent.slice(0,30),before:b.content,bpos:b.position,bleft:b.left,bff:b.fontFamily.slice(0,30),bfs:b.fontSize,bcolor:b.color,marker:m.content,mcolor:m.color,mfs:m.fontSize,lst:c.listStyleType,pl:c.paddingLeft,ulpl:getComputedStyle(li.parentElement).paddingLeft,ulml:getComputedStyle(li.parentElement).marginLeft,ulmt:getComputedStyle(li.parentElement).marginTop,counter:getComputedStyle(li.parentElement).counterReset,start:li.parentElement.getAttribute('start'),liMt:c.marginTop}};
const rt=document.querySelector('[data-framer-name="Content"]');
return [f('[data-framer-name="Content"] ul > li'),f('[data-framer-name="Content"] ol > li'),f('[data-framer-name="Content"] ol ol > li'),f('[data-framer-name="Content"] ul ul > li'),[...document.querySelectorAll('[data-framer-name="Content"] ol')].slice(0,4).map(o=>o.getAttribute('start')+'|'+getComputedStyle(o).listStyleType),
[...document.querySelectorAll('[data-framer-name="Content"] li')].slice(0,40).map(l=>getComputedStyle(l).marginTop).filter((v,i,a)=>a.indexOf(v)===i), (()=>{const lis=[...document.querySelectorAll('[data-framer-name="Content"] ul > li')];return lis.length>1?[lis[0].getBoundingClientRect().bottom,lis[1].getBoundingClientRect().top]:null})()]})));
}
await b.close();})();
