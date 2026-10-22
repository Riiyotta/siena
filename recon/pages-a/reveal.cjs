// node reveal.cjs route W y0 y1 [durMs]  : scroll to y0 (progressively), mark elements in/near viewport-after-jump with hidden state, jump to y1, rAF sample
const {chromium}=require('playwright');
const [route,W,y0,y1,dur]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:+W,height:+W>800?900:844}})).newPage();
 await p.goto('https://www.siena.cx/'+route,{waitUntil:'load',timeout:90000});await p.waitForTimeout(3000);
 for(let y=0;y<=+y0;y+=300){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(350);}await p.evaluate(v=>scrollTo(0,v),+y0);await p.waitForTimeout(1200);
 const out=await p.evaluate(async([y1,dur])=>{
   const all=[...document.querySelectorAll('#main *')].filter(e=>!e.closest('nav')&&!e.closest('[data-framer-name="Ticker"]'));
   const st=e=>{const cs=getComputedStyle(e);const m=new DOMMatrix(cs.transform);return [ +(+cs.opacity).toFixed(3), Math.round(m.m41*10)/10, Math.round(m.m42*10)/10, +m.a.toFixed(3), +m.d.toFixed(3), cs.filter==='none'?0:parseFloat((cs.filter.match(/blur\(([\d.]+)/)||[0,0])[1]) ]};
   const cand=all.filter(e=>{const s=st(e);return (s[0]<0.98||s[1]||s[2]||s[3]!==1||s[4]!==1||s[5])&&e.getBoundingClientRect().width>0});
   const init=cand.map(st);scrollTo(0,y1);const t0=performance.now();const series=cand.map(()=>[]);
   await new Promise(r=>{const f=()=>{const t=performance.now()-t0;cand.forEach((e,i)=>series[i].push([t,st(e)]));if(t<dur)requestAnimationFrame(f);else r()};requestAnimationFrame(f)});
   const res=[];cand.forEach((e,i)=>{const s=series[i];const last=s[s.length-1][1];const first=init[i];if(JSON.stringify(first)===JSON.stringify(last))return;
     // find start time (first change) and end time (last change)
     let ts=null,te=null;for(let k=1;k<s.length;k++){if(JSON.stringify(s[k][1])!==JSON.stringify(s[k-1][1])){if(ts===null)ts=s[k-1][0];te=s[k][0];}}
     // time to 50% of y or opacity
     const idx=(first[2]!==last[2])?2:(first[1]!==last[1]?1:0);let t50=null;for(const [t,v] of s){if(Math.abs(v[idx]-last[idx])<=Math.abs(first[idx]-last[idx])*0.5){t50=t;break;}}
     // overshoot
     let ov=0;for(const [t,v] of s){const d=(v[idx]-last[idx])*Math.sign(first[idx]-last[idx]);if(d<ov)ov=d;}
     const r=e.getBoundingClientRect();const name=e.getAttribute('data-framer-name')||e.tagName;const txt=(e.textContent||'').trim().slice(0,30);
     res.push(`${name} "${txt}" @${Math.round(r.x)},${Math.round(r.y+scrollY)} ${Math.round(r.width)}x${Math.round(r.height)} [op,x,y,sx,sy,blur] ${JSON.stringify(first)} -> ${JSON.stringify(last)} start ${Math.round(ts)}ms t50 ${Math.round(t50)}ms end ${Math.round(te)}ms overshoot ${ov.toFixed(1)}`)});
   return res},[+y1,+(dur||2500)]);
 console.log(out.join('\n'));await b.close();})();
