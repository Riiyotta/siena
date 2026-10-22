import json
for f in ['terms-of-service','privacy-policy']:
  d=json.load(open(f'out/{f}-1440-detail.json'))
  a=json.load(open(f'out/{f}-1440.json'))
  r=d['rich'][0]; it=r['items']
  print(f"\n### /{f}\n")
  print(f"- Document height 1440 = {a['H']}px; content rich-text block {r['r'][2]}x{r['r'][3]} at y={r['r'][1]}")
  secs=[['(intro)','',0,0,[],0]]
  i=0
  while i<len(it):
    x=it[i]
    if x['tag'] in('h2','h3','h4') and x['depth']==0 or (x['tag']=='ol' and i+1<len(it) and it[i+1]['tag']=='li' and x['n']==1 and it[i+1]['words']<=12 and (i+2>=len(it) or it[i+2]['depth']==0) and x['mt']=='40px'):
      if x['tag']=='ol':
        secs.append([it[i+1]['text'],'ol>li>h2 (auto-numbered)',0,0,[],0]); i+=2; continue
      secs.append([x['text'],x['tag'],0,0,[],0])
    elif x['tag']=='p' and x['depth']==0:
      secs[-1][2]+=1; secs[-1][3]+=x['words']
    elif x['tag'] in('ul','ol') and x['depth']==0:
      secs[-1][4].append(f"{x['tag']}({x['n']})")
    elif x['tag']=='li':
      secs[-1][5]+=x['words']
    elif x['tag']=='p': secs[-1][3]+=x['words']
    i+=1
  for s in secs:
    print(f"  - [{s[1] or 'intro'}] \"{s[0]}\" — {s[2]} p, {s[3]} w" + (f"; lists {' '.join(s[4])} ({s[5]} w in items)" if s[4] else ''))
