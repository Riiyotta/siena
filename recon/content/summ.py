import json,sys,collections
d=json.load(open(sys.argv[1]))
mode=sys.argv[2] if len(sys.argv)>2 else 'all'
print('H',d['H'],d['title'])
if mode in('all','t'):
  g=collections.OrderedDict()
  for t in d['texts']:
    k=(t['tag'],t['ff'],t['fs'],t['lh'],t['ls'],t['fw'],t['fst'],t['c'],t['td'],t['tt'])
    g.setdefault(k,[]).append(t)
  for k,v in g.items():
    print('STYLE',k,'n=%d'%len(v))
    for t in v[:int(sys.argv[3]) if len(sys.argv)>3 else 4]: print('   ',t['r'],repr(t['t'][:90]),'w=%d'%t['len'],t['mt'],t['mb'])
if mode in('all','b'):
  for b in d['boxes']:
    if b['r'][2]<int(sys.argv[3] if len(sys.argv)>3 else 0): continue
    print('BOX',b['tag'],b['fn'][:30],b['r'],'bg=',b['bg'],b['bgi'][:80],'bd=',b['bd'],'br=',b['br'],b['d'],b['fd'],b['jc'],b['ai'],'gap=',b['gap'],b['gtc'],'pad=',b['pad'],'mw=',b['mw'],b['pos'],b['ov'],'sh=' if b['sh'] else '',b['sh'][:60],'|',b['txt'][:30])
if mode in('all','i'):
  for i in d['imgs']: print('IMG',i)
  for s in d['svgs']: print('SVG',s['k'],s['r'],s['vb'],s['par'],s['len'])
  for s in d['videos']+d['iframes']: print('MEDIA',s)
if mode in('all','s'):
  for s in d['sticky']: print('STICKY',s)
  for s in d['anim']: print('ANIM',s)
  for s in d['styleAttrs']: print('SA',s)
  print('APPEAR',d['appear'])
  print('FONTS',sorted(set(d['fonts'])))
