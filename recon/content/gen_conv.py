import json,sys
routes=['conversations/thrive-causemetics-ai-customer-service-automation','conversations/prose-ai-customer-service-automation','conversations/spanx-kylah-field-real-work-ai-customer-experience']
for r in routes:
  n=r.replace('/','__')
  a=json.load(open(f'out/{n}-1440.json')); d=json.load(open(f'out/{n}-1440-detail.json'))
  T=[t for t in a['texts'] if t['r'][0]>=300 and 150<t['r'][1]<a['H']-1000]
  kick=[t['t'] for t in T if t['tag'] in('a','time') and t['r'][1]<200]
  gb=[b for b in a['boxes'] if b['fn']=='Guest'][0]
  guest=' '.join(t['t'] for t in a['texts'] if abs(t['r'][1]-gb['r'][1])<4 and t['r'][0]>=300)
  h1=[h for h in d['headings'] if h['tag']=='H1'][0]
  print(f"\n### /{r}\n")
  print(f"- Document height: 1440 = {a['H']}px" )
  print(f"- Kicker: link \"{kick[0]}\" (→ /conversations) + `<time>` \"{kick[1]}\"")
  print(f"- H1 ({h1['r'][3]//64} lines @1440): \"{h1['t']}\"")
  print(f"- Guest line: \"{guest}\" (first span = name, 500 weight, 80% ink; rest 400)")
  ifr=[i for i in d['iframes'] if 'youtube' in i['src']] or [{'src':'https://www.youtube.com/embed/8SEXP6zopwo?','r':[320,584,800,450]}]
  print(f"- Video: YouTube `{ifr[0]['src'].split('?')[0]}` (embed params `?autoplay=0&mute=1&controls=1&rel=0`), 800x450 at y={ifr[0]['r'][1]}")
  rich={x['fn']:x for x in d['rich']}
  s=rich['Summary']; ps=[i for i in s['items'] if i['tag']=='p']
  links=[l for i in ps for l in i['links']]
  print(f"- Summary: {len(ps)} paragraphs, words {[i['words'] for i in ps]}; links: "+', '.join(f"\"{l['t']}\" → {l['h']}" for l in links))
  # takeaways from texts
  tk=[t for t in a['texts'] if t['tag']=='p' and t['p']=='li' and t['r'][0]>=320]
  # chapters from texts
  ch=[t for t in a['texts'] if t['tag']=='a' and t['p']=='p' and t['r'][0]==341]
  tk=[t for t in tk if not any(abs(t['r'][1]-c['r'][1])<3 for c in ch)]
  print(f"- Key takeaways: {len(tk)} bullets, words {[t['len'] for t in tk]}")
  print(f"- Chapters ({len(ch)} links, each `<a>` to `#chapter-N-<slug>` of the transcript h2):")
  for c in ch: print(f"  - {c['t']}")
  tr=rich['Transcript']['items']
  print(f"- Full transcript: {sum(1 for i in tr if i['tag']=='h2')} chapter h2s, {sum(1 for i in tr if i['tag']=='p')} paragraphs, {sum(i['words'] for i in tr if i['tag']=='p')} words total. Per chapter (paragraphs / speaker turns / words):")
  cur=None
  secs=[]
  for i in tr:
    if i['tag']=='h2': secs.append([i['text'],0,0,0])
    elif i['tag']=='p' and secs:
      secs[-1][1]+=1; secs[-1][3]+=i['words']
      if i['strong']: secs[-1][2]+=1
  for s_ in secs: print(f"  - \"{s_[0]}\" — {s_[1]} p / {s_[2]} turns / {s_[3]} w")
  speakers=sorted(set(i['strong'].split(' | ')[0] for i in tr if i['strong']))
  print(f"  - Speakers (bold label + timestamp link): {', '.join(speakers)}")
  fq=rich['FAQ']['items']
  print(f"- FAQ: {sum(1 for i in fq if i['tag']=='h3')} Q&As:")
  qs=[i for i in fq]
  for k,i in enumerate(qs):
    if i['tag']=='h3':
      ans=qs[k+1]['words'] if k+1<len(qs) else 0
      print(f"  - \"{i['text']}\" — answer {ans} words")
