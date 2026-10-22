const fs=require('fs');const j=JSON.parse(fs.readFileSync(process.argv[2]));
const [y0,y1]=[+(process.argv[3]||0),+(process.argv[4]||1e9)];
let skipD=-1;for(const r of j.data.out){if(skipD>=0){if(r.d>skipD)continue;skipD=-1}if(r.tag==='nav'){skipD=r.d;continue}if(r.y<y0||r.y>y1)continue;if(r.tag==='video')continue;
 let l=`${' '.repeat(Math.min(r.d,20))}${r.tag}${r.n?'['+r.n+']':''} ${r.x},${r.y} ${r.w}x${r.h}`;
 if(r.text)l+=` "${r.text.replace(/\s+/g," ").slice(0,600).replace(/[\uE000-\uF8FF]/g,c=>"U+"+c.charCodeAt(0).toString(16).toUpperCase())}"`;
 if(r.href)l+=` href=${r.href}`;if(r.src)l+=` src=${r.src.replace('https://framerusercontent.com/images/','fc:').split('?')[0]} nat=${r.nat}`;
 if(r.form)l+=' form='+JSON.stringify(r.form);if(r.vid)l+=' vid='+JSON.stringify(r.vid);
 if(r.s)l+=' | '+Object.entries(r.s).map(([k,v])=>k+'='+v).join(' ; ');
 console.log(l)}
