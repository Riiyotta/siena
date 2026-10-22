// usage: node probe.cjs route W "y0:y1:step" fnfile   (fn returns a string; prints when it changes)
const {chromium}=require('playwright');const fs=require('fs');
const [route,W,range,fnfile]=process.argv.slice(2);const [y0,y1,st]=range.split(':').map(Number);
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:+W,height:+W>800?900:844}})).newPage();
 await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:90000});await p.waitForTimeout(3500);
 const fn=fs.readFileSync(fnfile,'utf8');let prev='';
 for(let y=0;y<y0;y+=200){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(30);}
 for(let y=y0;y<=y1;y+=st){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(+process.env.WAIT||400);
   const v=await p.evaluate(fn);if(v!==prev){console.log(y,v);prev=v;}}
 await b.close();})();
