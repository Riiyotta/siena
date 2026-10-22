const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
await p.goto('https://www.siena.cx/about-us',{waitUntil:'networkidle'});
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-framer-name]')].filter(e=>e.getBoundingClientRect().height>300).slice(0,15).map(e=>e.getAttribute('data-framer-name')+' '+e.tagName+' '+Math.round(e.getBoundingClientRect().height)+' '+e.parentElement.className).join('\n')));
await b.close()})()
