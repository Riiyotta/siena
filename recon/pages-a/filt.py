import sys,re
L=open(sys.argv[1]).read().split('\n')
out=[];start=False;skip=None
for l in L:
    if '[Main]' in l and not start: start=True
    if not start: continue
    if 'pad:64px 96px ; bg:rgb(18, 32, 35)' in l: out.append('FOOTER: '+l.strip()[:120]);break
    ind=len(l)-len(l.lstrip())
    if skip is not None:
        if ind>skip: continue
        skip=None
    if '<ul>' in l or '[Ticker]' in l:
        # collect imgs alts in subtree later; just collapse
        out.append(l+'  ...COLLAPSED'); skip=ind; continue
    s=l
    s=s.replace(' ; flex column jc:flex-start ai:normal gap:normal','').replace('flex column jc:flex-start ai:normal gap:normal ; ','').replace('flex column jc:flex-start ai:normal gap:normal','')
    if re.search(r'<div> [-\d]+,[-\d]+ \d+x\d+ +pos:absolute t:0px l:0px r:0px b:0px *$',s): continue
    if re.search(r'<div> [-\d]+,[-\d]+ \d+x\d+ *$',s): continue
    s=re.sub(r' ta:start tt:none\]',']',s).replace(' tt:none]',']').replace('ls:normal ','')
    s=s.replace('https://framerusercontent.com/images/','FI/')
    out.append(s)
print('\n'.join(out))
