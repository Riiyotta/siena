(async()=>{const sec=[...document.querySelectorAll('[data-framer-name="Testimonials"],[data-framer-name="content"]')].filter(e=>e.querySelector('[data-framer-name="Testimonial"]')).pop();const btns=[...sec.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width===40);
const total=+((sec.innerText.match(/\/\s*(\d+)/)||[])[1]||1);const out=[];
for(let i=0;i<total;i++){await new Promise(r=>setTimeout(r,900));const t=[...sec.querySelectorAll('[data-framer-name="Testimonial"]')].find(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.left<window.innerWidth/2+50&&r.width>200});
 if(t){const imgs=[...t.querySelectorAll('img')].map(i=>(i.currentSrc||i.src).split('/').pop().split('?')[0]);const ps=[...t.querySelectorAll('p')].map(p=>p.innerText.trim()).filter(Boolean);const a=t.querySelector('a');const play=t.querySelectorAll('svg').length;out.push({i:i+1,imgs,ps,link:a?a.getAttribute('href'):null,svgs:play})}
 btns[btns.length-1].click();}
return out})()
