(()=>{const s=[...document.querySelectorAll('[data-framer-name="Content display (Timer)"]')].find(e=>e.offsetHeight>0);
const q=n=>[...s.querySelectorAll(`[data-framer-name="${n}"]`)].map(e=>{const r=e.getBoundingClientRect();return `${Math.round(r.width)}x${Math.round(r.height)}@${(+getComputedStyle(e).opacity).toFixed(2)}`}).join(',');
const t=[...s.querySelectorAll('p')].slice(-2).map(e=>{const r=e.getBoundingClientRect();return Math.round(r.top)+'@'+(+getComputedStyle(e.parentElement).opacity).toFixed(2)}).join(',');
return 'Rect:'+q('Rectangle')+' Line:'+q('Line')+' P:'+t})()
