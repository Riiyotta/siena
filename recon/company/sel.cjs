const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/partner-with-siena',{waitUntil:'load',timeout:60000});await p.waitForTimeout(2000);
await p.evaluate(()=>document.querySelectorAll('[class*=cky]').forEach(e=>e.remove()));
await p.getByText('Become a partner',{exact:true}).first().click();await p.waitForTimeout(1200);
console.log(await p.evaluate(()=>{const s=document.querySelector('select[name=Team]');const w=s.parentElement;const r=[];for(const [el,ps] of [[w,'::before'],[w,'::after'],[s,''],[w,'']]){const c=getComputedStyle(el,ps||null);r.push((ps||el.tagName)+' bgi:'+c.backgroundImage.slice(0,700)+' mask:'+(c.maskImage||'').slice(0,700)+' content:'+c.content+' w:'+c.width+' h:'+c.height+' right:'+c.right)}return r.join('\n')}));
await b.close()})()
