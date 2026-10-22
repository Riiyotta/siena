const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://www.siena.cx/partner-with-siena',{waitUntil:'load',timeout:60000});await p.waitForTimeout(2500);
await p.evaluate(()=>document.querySelectorAll('[class*=cky]').forEach(e=>e.remove()));
await p.getByText('Become a partner',{exact:true}).first().click();await p.waitForTimeout(1200);
console.log(await p.evaluate(()=>{const f=document.querySelector('form');const chain=[];let e=f;while(e&&e!==document.body){const c=getComputedStyle(e);chain.push(e.tagName+' '+Math.round(e.getBoundingClientRect().height)+' ov:'+c.overflow+'/'+c.overflowY+' pos:'+c.position+' z:'+c.zIndex+' pe:'+c.pointerEvents);e=e.parentElement}return chain.slice(0,8).join('\n')}));
const sel=await p.$('select[name=Team]');console.log('select',await sel.evaluate(s=>{const c=getComputedStyle(s);const w=s.parentElement;const a=getComputedStyle(w,'::after');return c.fontFamily+' '+c.fontWeight+' '+c.fontSize+'/'+c.lineHeight+' color:'+c.color+' appearance:'+c.appearance+' bg:'+c.backgroundImage.slice(0,300)+' | wrap after:'+a.borderWidth+' '+a.borderStyle+' '+a.borderColor+' wrapper children:'+w.innerHTML.replace(/<option.*<\/option>/g,'').slice(0,600)}));
const ta=await p.$('textarea');console.log('textarea',await ta.evaluate(t=>{const c=getComputedStyle(t);const a=getComputedStyle(t.parentElement,'::after');return c.fontFamily+' '+c.fontSize+'/'+c.lineHeight+' resize:'+c.resize+' '+a.borderWidth+' '+a.borderStyle+' '+a.borderColor+' ph:'+getComputedStyle(t,'::placeholder').color}));
const pill=p.locator('form button',{hasText:'Shopify'}).first();
const ps=e=>{const c=getComputedStyle(e);const d=e.querySelector('div');const a=d?getComputedStyle(d):null;return 'bg '+c.backgroundColor+' color '+getComputedStyle(e.querySelector('span')).color+' innerDiv border:'+(a?a.border+' sh:'+a.boxShadow:'')+' after:'+getComputedStyle(e,'::after').border+' tr:'+c.transition.slice(0,80)};
console.log('pill rest',await pill.evaluate(ps));await pill.hover();await p.waitForTimeout(300);console.log('pill hover',await pill.evaluate(ps));
await pill.click();await p.waitForTimeout(400);await p.mouse.move(10,10);await p.waitForTimeout(300);console.log('pill selected',await pill.evaluate(ps),'hidden input val:',await p.evaluate(()=>document.querySelector('input[name=Buttons]').value));
await p.locator('form button',{hasText:'Gorgias'}).first().click();await p.waitForTimeout(300);console.log('2 selected val:',await p.evaluate(()=>document.querySelector('input[name=Buttons]').value));
// close button?
console.log('close candidates',await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position==='fixed').flatMap(f=>[...f.querySelectorAll('svg,[aria-label],button')].filter(b=>!b.closest('form')).map(b=>b.tagName+' '+(b.getAttribute('aria-label')||'')+' '+Math.round(b.getBoundingClientRect().left)+','+Math.round(b.getBoundingClientRect().top))).join(' | ')));
await p.mouse.click(100,450);await p.waitForTimeout(800);console.log('after backdrop click forms:',await p.evaluate(()=>document.querySelectorAll('form').length));
await p.keyboard.press('Escape');await p.waitForTimeout(500);
// close anim
await p.getByText('Become a partner',{exact:true}).first().click();await p.waitForTimeout(1000);await p.mouse.click(100,450);const s=[];for(let i=0;i<8;i++){s.push(await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position==='fixed'&&e.getBoundingClientRect().width>500&&e.getBoundingClientRect().height>500).map(e=>getComputedStyle(e).opacity+'/'+getComputedStyle(e).backgroundColor).join(',')));await p.waitForTimeout(50)}console.log('close samples',s.join(' '));
await b.close()})()
