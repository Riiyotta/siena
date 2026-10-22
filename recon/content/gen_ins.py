import json
for r in ['insights','insights/sentiment-analysis-online','insights/voice-of-customer-software','insights/customer-feedback-analytics-software']:
  n=r.replace('/','__'); a=json.load(open(f'out/{n}-1440.json')); m=json.load(open(f'out/{n}-390.json'))
  print(f"\n### /{r}\n\n- Title tag: \"{a['title']}\"; document height 1440 = {a['H']}px, 390 = {m['H']}px")
  secs=[b for b in a['boxes'] if b['r'][0]==0 and b['r'][2]==1440 and b['fn'] and b['fn'] not in('Main','Desktop')]
  secs.sort(key=lambda b:b['r'][1])
  msecs=sorted([b for b in m['boxes'] if b['r'][0]==0 and b['r'][2]==390 and b['fn'] and b['fn'] not in('Main','Phone')],key=lambda b:b['r'][1])
  mh={}
  for b in msecs: mh.setdefault(b['fn'],[]).append(b['r'][3])
  cnt={}
  for s in secs:
    y0,y1=s['r'][1],s['r'][1]+s['r'][3]
    k=cnt.get(s['fn'],0); cnt[s['fn']]=k+1
    mhh=mh.get(s['fn'],[None]*(k+1)); mhh=mhh[k] if k<len(mhh) else None
    T=[t for t in a['texts'] if y0<=t['r'][1]<y1 and t['r'][0]>=0 and t['tag']!='option' and not (t['ff'].startswith('Tiempos') and t['fs']=='12px') and 'Awesome' not in t['ff'] and t['tag']!='strong' or (y0<=t['r'][1]<y1 and t['tag']=='strong' and 'many' in t['t'])]
    I=[i for i in a['imgs'] if y0<=i['r'][1]<y1 and 'framerusercontent' in i['src']]
    side=''
    if s['fn']=='Feature 1' and I:
      side='image LEFT / text right' if I[0]['r'][0]<600 else 'text LEFT / image right'
    print(f"- **{s['fn']}** (y {y0}, h {s['r'][3]} @1440; h {mhh} @390) {side}")
    for t in T:
      if s['fn']=='CTA' and t['tag']=='strong': continue
      if s['fn']=='Hero' and not (t['r'][0]==64 or (t['fs']=='18px' and t['r'][1]>500)): continue
      body = t['tag']=='p' and t['fs'] in('20px',) and t['len']>8
      if body: print(f"  - p (body, {t['len']} words): starts \"{' '.join(t['t'].split()[:6])}…\"")
      else: print(f"  - {t['tag']}: \"{t['t']}\"")
    for i in I:
      if s['fn'] in ('CTA','Feature 1') and '5VTp1' in i['src'] or 'D3TQ' in i['src']: continue
      if s['fn']=='Hero' and i['r'][2]<300: continue
      print(f"  - img `{i['src'].split('/')[-1].split('?')[0]}` box {i['r'][2]}x{i['r'][3]} at x{i['r'][0]}, natural-ish {i['nat']}, object-fit {i['of']}")
  btn=[b for b in a['boxes'] if b['fn']=='xlg']
  print("  - Buttons (xlg): "+'; '.join(f"\"{b['txt']}\" @y{b['r'][1]} bg {b['bg']}" for b in btn))
  L=[l for l in a['links'] if l['t'] in('Book a demo','Login','Learn more') and l['r'][1]>140]
  print("  - Button hrefs: "+'; '.join(f"\"{l['t']}\" → {l['h']}" for l in L))
