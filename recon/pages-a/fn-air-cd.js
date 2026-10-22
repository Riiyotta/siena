(()=>{const s=[...document.querySelectorAll('[data-framer-name="Content display (Timer)"]')].find(e=>e.offsetHeight>0);
const items=[...s.querySelectorAll('[data-framer-name="Active"],[data-framer-name="Inactive"]')].map(e=>e.getAttribute('data-framer-name')[0]+':'+(+getComputedStyle(e).opacity).toFixed(2)).join(',');
const rv=[...s.querySelectorAll('[data-framer-name="Content"]')].map(e=>(+getComputedStyle(e).opacity).toFixed(1)).join('');
const nm=[...s.querySelectorAll('p')].find(p=>/Simpson|Richmond|[A-Z][a-z]+ [A-Z][a-z]+/.test(p.textContent)&&getComputedStyle(p).fontSize==='24px');
return items+' rv:'+rv+' name:'+(nm?nm.textContent:'')})()
