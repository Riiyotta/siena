const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();await p.goto('https://www.siena.cx/qa-agent',{waitUntil:'load'});await p.waitForTimeout(2500);
await p.addStyleTag({content:'.cky-consent-container,.cky-overlay{display:none!important}'});
for(let v=0;v<=3400;v+=300){await p.evaluate(v=>scrollTo(0,v),v);await p.waitForTimeout(250)}await p.waitForTimeout(1500);
for(const t of ['Slack notifications','Help desk tasks','Internal notes']){
 await p.locator(`text=${t}`).first().evaluate(e=>{let n=e;for(let i=0;i<6;i++){n=n.parentElement;if(n.offsetWidth===325)break}n.setAttribute('data-probe','1')});
 const c=p.locator('[data-probe="1"]');const box=await c.boundingBox();
 const pr=p.evaluate(async()=>{const e=document.querySelector('[data-probe="1"]');const t0=performance.now();const out=[];let prev='';
   await new Promise(r=>{const f=()=>{const v=[...e.querySelectorAll('div')].filter(x=>x.offsetWidth>40&&(x.querySelector('video')||/Visual|Union|Rotating container/.test(x.getAttribute('data-framer-name')||''))).slice(0,3).map(x=>{const cs=getComputedStyle(x);const m=new DOMMatrix(cs.transform);return (x.getAttribute('data-framer-name')||'vid')+':'+(+cs.opacity).toFixed(2)+':'+Math.round(Math.atan2(m.b,m.a)*180/Math.PI)}).join(' ');if(v!==prev){out.push(Math.round(performance.now()-t0)+' '+v);prev=v}if(performance.now()-t0<2500)requestAnimationFrame(f);else r()};f()});return out});
 await p.mouse.move(box.x+box.width/2,box.y+box.height/2);const o=await pr;console.log(t,o.length,o.filter((x,i)=>i<8||i%15==0||i==o.length-1).join(' | '));
 await p.mouse.move(5,5);await p.waitForTimeout(800);await c.evaluate(e=>e.removeAttribute('data-probe'));}
await b.close()})();
