// usage: node tprobe.cjs route W "y1,y2,.." fnfile durationMs  -> scrolls progressively to each y, samples fn via rAF for duration
const {chromium}=require('playwright');const fs=require('fs');
const [route,W,ys,fnfile,dur]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:+W,height:+W>800?900:844}})).newPage();
 await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:90000});await p.waitForTimeout(3500);
 const fn=fs.readFileSync(fnfile,'utf8');let cur=0;
 for(const y of ys.split(',').map(Number)){
  while(cur<y-200){cur+=200;await p.evaluate(v=>scrollTo(0,v),cur);await p.waitForTimeout(30);}
  const res=await p.evaluate(async([y,fn,dur])=>{const f=new Function('return '+fn);scrollTo(0,y);const t0=performance.now();const out=[];let prev='';
    await new Promise(r=>{const tick=()=>{const t=performance.now()-t0;const v=f();if(v!==prev){out.push(Math.round(t)+'ms '+v);prev=v;}if(t<dur)requestAnimationFrame(tick);else r();};tick();});return out;},[y,fn,+dur]);
  cur=y;console.log('=== y='+y+' ('+res.length+' changes)');const step=Math.max(1,Math.floor(res.length/(+process.env.MAXL||40)));res.forEach((l,i)=>{if(i%step===0||i===res.length-1)console.log(l)});
 }
 await b.close();})();
