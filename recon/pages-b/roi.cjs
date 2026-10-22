const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
// Block real submissions: fulfill locally, nothing leaves the machine.
await p.route(/n8n-siena|hsforms|hubspot/,r=>r.fulfill({status:200,contentType:'application/json',body:'{"inlineMessage":"ok"}'}));
await p.goto('https://www.siena.cx/roi-calculator',{waitUntil:'load',timeout:120000});await p.waitForTimeout(3000);
await p.evaluate(()=>document.querySelectorAll('.cky-consent-container,.cky-overlay').forEach(e=>e.remove()));
const card=async()=>p.evaluate(()=>{const rgb=c=>c;const root=[...document.querySelectorAll('div')].find(d=>getComputedStyle(d).backgroundImage.includes('209deg'));const L=[];
 const walk=(e,d)=>{const c=getComputedStyle(e);if(c.display==='none')return;const bb=e.getBoundingClientRect();const own=[...e.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
  let s=`${'  '.repeat(d)}${e.tagName.toLowerCase()} [${Math.round(bb.x)},${Math.round(bb.y+scrollY)},${Math.round(bb.width)}x${Math.round(bb.height)}]`;if(c.display==='flex')s+=` flex-${c.flexDirection} gap:${c.gap} jc:${c.justifyContent} ai:${c.alignItems}`;if(c.padding!=='0px')s+=` p:${c.padding}`;if(c.margin!=='0px')s+=` m:${c.margin}`;if(c.backgroundColor!=='rgba(0, 0, 0, 0)')s+=` bg:${c.backgroundColor}`;if(c.backgroundImage!=='none')s+=` bgi:${c.backgroundImage.slice(0,160)}`;if(c.borderTopWidth!=='0px'&&c.borderTopStyle!=='none')s+=` border:${c.borderTopWidth} ${c.borderTopStyle} ${c.borderTopColor}`;if(c.borderBottomWidth!=='0px'&&c.borderTopWidth==='0px')s+=` border-b:${c.borderBottomWidth} ${c.borderBottomColor}`;if(c.borderRadius!=='0px')s+=` r:${c.borderRadius}`;if(c.opacity!=='1')s+=` op:${c.opacity}`;
  if(own)s+=` TEXT"${own}" {${c.fontFamily} ${c.fontWeight} ${c.fontSize}/${c.lineHeight} ${c.color} ls:${c.letterSpacing}}`;if(e.tagName==='INPUT')s+=` input type=${e.type} value="${e.value}" ph="${e.placeholder}" font:${c.fontFamily} ${c.fontSize} ${c.color} ta:${c.textAlign}`;
  L.push(s);if(e.tagName!=='svg')[...e.children].forEach(k=>walk(k,d+1))};walk(root,0);return L.join('\n')});
const out=[];out.push('##### STEP1\n'+await card());
const card1=await p.$('div[style*="209deg"]');await card1.screenshot({path:'roi-step1.png'});
// click Next empty -> error
await p.click('button:has-text("Next")');await p.waitForTimeout(500);out.push('##### STEP1-ERROR\n'+await card());await card1.screenshot({path:'roi-step1-error.png'});
// fill
const inputs=await p.$$('div[style*="209deg"] input');const vals=['50000','10','600000','0','80','30000'];
for(let i=0;i<inputs.length;i++){await inputs[i].fill(vals[i]);}
// focus style
await inputs[0].focus();out.push('focus: '+await inputs[0].evaluate(e=>{const c=getComputedStyle(e);return c.borderColor+' '+c.boxShadow+' '+c.outline}));
await p.click('button:has-text("Next")');await p.waitForTimeout(800);out.push('##### STEP2\n'+await card());await (await p.$('div[style*="209deg"]')).screenshot({path:'roi-step2.png'});
await p.click('button:has-text("View results")');await p.waitForTimeout(500);out.push('##### STEP2-ERROR\n'+await card());
const in2=await p.$$('div[style*="209deg"] input');const v2=['Test','User','test@example.com','recon'];for(let i=0;i<in2.length;i++)await in2[i].fill(v2[i]);
await p.click('button:has-text("View results")');await p.waitForTimeout(1500);out.push('##### STEP3\n'+await card());await (await p.$('div[style*="209deg"]')).screenshot({path:'roi-step3.png'});
// slider interaction
const rng=await p.$('div[style*="209deg"] input[type=range]');if(rng){await rng.fill('50');await p.waitForTimeout(300);out.push('##### STEP3-slider50\n'+(await card()).split('\n').filter(l=>/TEXT|input/.test(l)).join('\n'));}
const num=await p.$$('div[style*="209deg"] input[type=number]');if(num[1]){await num[1].fill('120000');await p.waitForTimeout(300);out.push('##### STEP3-tickets120k\n'+(await card()).split('\n').filter(l=>/TEXT|input/.test(l)).join('\n'));}
out.push('thumb: '+await p.evaluate(()=>{const r=document.querySelector('input[type=range]');const c=getComputedStyle(r,'::-webkit-slider-thumb');return c.width+' '+c.height+' '+c.backgroundImage.slice(0,80)+' '+c.borderTopWidth+' '+c.borderTopColor+' track:'+getComputedStyle(r).backgroundImage}));
fs.writeFileSync('roi-steps.txt',out.join('\n'));console.log('ok');await b.close()})();
