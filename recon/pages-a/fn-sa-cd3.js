(()=>{const s=[...document.querySelectorAll('[data-framer-name="Content display (Timer)"]')].find(e=>e.offsetHeight>0);
const st=s.querySelector('[data-framer-name="Initial"],[data-framer-name="Final"]');const sr=s.getBoundingClientRect();
return 'secTop:'+Math.round(sr.top)+' '+[...s.querySelectorAll('[data-framer-name="Rectangle"]')].map(e=>{const r=e.getBoundingClientRect();return `${Math.round(r.top)}/${Math.round(r.height)}@${(+getComputedStyle(e).opacity).toFixed(2)}`}).join(',')})()
