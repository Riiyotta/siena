import sys,re
f=sys.argv[1];a=int(sys.argv[2]);b=int(sys.argv[3]);D=int(sys.argv[4]) if len(sys.argv)>4 else 7
for i,l in enumerate(open(f)):
    if i<a or i>b: continue
    ind=len(l)-len(l.lstrip())
    if '<svg>' in l: continue
    if ind<=D or 'T"' in l or '<img>' in l or 'STICKY' in l or 'APPEAR' in l or '<video>' in l:
        l=re.sub(r'pos:absolute t:(\S+) l:(\S+) r:(\S+) b:(\S+)',r'abs(\1,\2,\3,\4)',l)
        l=re.sub(r'\[Get your AI superhuman[^\]]*\]','[GYAS]',l)
        print(l.rstrip()[:230])
