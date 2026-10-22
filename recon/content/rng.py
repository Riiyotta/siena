import json,sys
d=json.load(open('out/%s.json'%sys.argv[1]))
lo,hi=int(sys.argv[2]),int(sys.argv[3]); mw=int(sys.argv[4]) if len(sys.argv)>4 else 0
for b in d['boxes']:
  x,y,w,h=b['r']
  if lo<=y<hi and w>=mw and x>-50:
    print('B',b['tag'],b['fn'][:18],b['r'],b['bg'],b['bgi'][:60],b['bd'][:60],'br',b['br'],b['d'],b['fd'],b['jc'],b['ai'],'g',b['gap'],b['gtc'][:40],'p',b['pad'],'mw',b['mw'],b['pos'],b['ov'],b['op'],b['tf'][:40],b['sh'][:50],'|',b['txt'][:25])
for i in d['imgs']:
  x,y,w,h=i['r']
  if lo<=y<hi: print('I',i['r'],i['nat'],i['of'],i['br'],i['src'][:110],i['alt'][:30])
for s in d['svgs']:
  x,y,w,h=s['r']
  if lo<=y<hi: print('S',s['k'],s['r'],s['vb'],s['par'],s['len'])
for t in d['texts']:
  x,y,w,h=t['r']
  if lo<=y<hi and x>-50: print('T',t['tag'],t['r'],t['ff'][:22],t['fs'],t['lh'],t['ls'],t['fw'],t['c'],t['tt'],t['ta'],'|',t['t'][:50])
