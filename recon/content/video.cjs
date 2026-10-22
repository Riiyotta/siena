const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1440,height:900}});
 const p=await ctx.newPage();
 try{await p.goto('https://www.siena.cx/conversations/thrive-causemetics-ai-customer-service-automation',{waitUntil:'networkidle',timeout:60000});}catch(e){}
 await p.waitForTimeout(2000);
 const btns=await p.evaluate(()=>[...document.querySelectorAll('button')].map(b=>b.className+'|'+b.textContent.trim()).filter(s=>/accept|Accept/.test(s)));
 console.log(btns);
 try{await p.getByRole('button',{name:/Accept All/i}).first().click({timeout:4000});console.log('accepted')}catch(e){console.log('fail accept',e.message.slice(0,100))}
 await p.waitForTimeout(3000);
 const v=await p.evaluate(()=>{const v=document.querySelector('main [data-framer-name="Video"], [data-framer-name="Video"]');const all=[...document.querySelectorAll('[data-framer-name="Video"]')].filter(e=>e.getBoundingClientRect().width>500);const e=all[0];
  const li=document.querySelector('[data-framer-name="Takeaways"] li');const bf=li?getComputedStyle(li,'::before'):null;
  const chap=[...document.querySelectorAll('[data-framer-name="Chapter List"] li')].map(l=>({t:l.textContent.trim(),h:(l.querySelector('a')||{}).href}));
  const tk=[...document.querySelectorAll('[data-framer-name="Takeaways"] li')].map(l=>l.textContent.trim().split(/\s+/).length);
  const ulcs=li?getComputedStyle(li.parentElement):null;
  return {html:e?e.outerHTML.slice(0,3000):null,r:e?e.getBoundingClientRect().toJSON():null,before:bf?{content:bf.content,pos:bf.position,left:bf.left,top:bf.top,w:bf.width,ff:bf.fontFamily,fs:bf.fontSize,c:bf.color}:null,liPad:li?getComputedStyle(li).paddingLeft:'',liMt:li?getComputedStyle(li).marginTop:'',ul:ulcs?{pl:ulcs.paddingLeft,ml:ulcs.marginLeft,lst:ulcs.listStyleType}:null,chap,tk,li2mt:document.querySelectorAll('[data-framer-name="Takeaways"] li')[1]?getComputedStyle(document.querySelectorAll('[data-framer-name="Takeaways"] li')[1]).marginTop:'',chapLiP:document.querySelector('[data-framer-name="Chapter List"] li p')?getComputedStyle(document.querySelector('[data-framer-name="Chapter List"] li p')).margin:''};});
 console.log(JSON.stringify(v,null,1));
 const el=await p.$('[data-framer-name="Video"] >> nth=-1');
 const all=await p.$$('[data-framer-name="Video"]');
 for(const e of all){const bb=await e.boundingBox();if(bb&&bb.width>500){await e.scrollIntoViewIfNeeded();await p.waitForTimeout(1500);await e.screenshot({path:'/Users/riyaghosh/V3/siena/recon/content/detail-video-1440.png'});break;}}
 await b.close();
})();
