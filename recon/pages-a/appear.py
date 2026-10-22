import json,sys,re
r=sys.argv[1]
m=json.load(open(r+'-1440.meta.json'))
tree=open(r+'-1440.tree.txt').read().split('\n')
tree390=open(r+'-390.tree.txt').read().split('\n')
D={'opacity':1,'rotate':0,'rotateX':0,'rotateY':0,'scale':1,'skewX':0,'skewY':0,'x':0,'y':0}
def c(o): return {k:v for k,v in o.items() if k!='transition' and D.get(k)!=v}
for k,v in (m['appear'] or {}).items():
    el=[l.strip()[:150] for l in tree if 'APPEAR:'+k in l]
    el2=[l.strip()[:60] for l in tree390 if 'APPEAR:'+k in l]
    out=[]
    for bp,a in v.items():
        if not a: out.append(f'{bp}:null');continue
        t=a['animate'].get('transition',{})
        out.append(f"{bp}: {c(a['initial'])} -> {c(a['animate'])} {t}")
    print(k,'|',' || '.join(out),'\n   EL1440:',el[:1],'\n   EL390:',el2[:1])
print(m['bps'])
