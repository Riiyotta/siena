import sys,re
for l in open(sys.argv[1]):
    ind=len(l)-len(l.lstrip())
    if ind<=4 or ('T"' in l and 'LETTER' not in l) or '<img>' in l or 'STICKY' in l:
        s=l.rstrip()
        s=re.sub(r'pos:absolute t:\S+ l:\S+ r:\S+ b:\S+ ;?','abs;',s)
        print(s[:260])
