const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/about-us',{waitUntil:'networkidle'});
const r=await p.evaluate(()=>{
 const main=document.querySelector('#main');
 function d(el,depth){ if(depth>4)return null; return {tag:el.tagName,cls:(el.className&&el.className.baseVal===undefined?el.className:'').slice(0,60),name:el.getAttribute('data-framer-name'),h:Math.round(el.getBoundingClientRect().height),y:Math.round(el.getBoundingClientRect().top+scrollY),kids:[...el.children].slice(0,12).map(c=>d(c,depth+1)).filter(Boolean)}}
 return d(main,0);
});
console.log(JSON.stringify(r,null,1).slice(0,6000));
await b.close();})();
