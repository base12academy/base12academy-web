from pathlib import Path
import json,re,hashlib,unicodedata,itertools
ROOT=Path(__file__).resolve().parents[1];P=ROOT.parent/'university-import'
rows=json.loads((P/'records-current.json').read_text());extra=json.loads((P/'additional-editorial-banks.json').read_text());manual=json.loads((ROOT/'scripts/universidades-lpac-execution-reviewed.json').read_text())
patterns={5:r'registro|plazo|silencio|resolver|días|meses|cómputo|presenta.*escrito|inhábil|sábad|derechos',7:r'inicia|instru|termin|audiencia|alegaci|prueba|informe|desist|renuncia|caduc|document|subsan|tramit|expediente|ordena|simplific',8:r'recurso|revisi|nulidad|rectific|ejecu|alzada|reposici|revisa|lesividad|suspensi',17:'.',10:'.'}
sourceids={5:['T11','T13'],7:['T13','T14'],8:['T14'],17:['T27'],10:['T16']}
def key(s):return re.sub(r'\W+',' ',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip()
updates=[];report=[]
for n,pattern in patterns.items():
 original=next(r for r in rows if r['course_slug']=='administrativos-universidades' and r['resource_id']==f'T{n:02}')
 keep=[dict(q,editorialSource='Banco propio Base12') for group in ['tests','checkTests'] for q in original['payload'][group] if not q.get('revisionMethod') and not q.get('qualityReview',{}).get('flags')]
 lists=[keep]
 if n==8:
  lists.insert(0,[{'id':f'LPAC-EXEC-REV-{i+1:03}','question':q[0],'options':q[1],'answer':q[2],'explanation':q[3]+' Referencia: '+q[4]+'.','source':'https://www.boe.es/eli/es/l/2015/10/01/39/con','editorialSource':'Elaboración propia contrastada con LPAC arts. 97–126'} for i,q in enumerate(manual)])
 for item in extra:
  if item['resource_id'] not in sourceids[n]:continue
  candidates=[]
  for q in item['tests']:
   text=q['question']+' '+q['options'][q['answer']]
   if not re.search(pattern,text,re.I):continue
   if re.search(r'(?i)Comunidad de Madrid|SAS|estatutario|sanitario|Consejería|Junta de Andalucía|contencios|procurador|Juzgado|Tribunal Superior|económico.administrativ|Tribunal Económico',text):continue
   candidates.append(dict(q,editorialSource=item['course_slug']))
  lists.append(candidates)
 pool=[];seen=set()
 for group in itertools.zip_longest(*lists):
  for q in group:
   if not q or key(q['question']) in seen:continue
   seen.add(key(q['question']));pool.append(q)
 assert len(pool)>=60,(n,len(pool))
 chosen=pool[:60]
 for row in rows:
  if row['resource_id']!=f'T{n:02}':continue
  c=row['course_slug'];p=row['payload'];qs=[]
  for i,q in enumerate(chosen):
   shift=int(hashlib.sha256((c+q['id']).encode()).hexdigest()[:4],16)%4;opts=q['options'][shift:]+q['options'][:shift]
   qs.append({'id':f'UNI-{c.split("-")[0]}-T{n:02}-ED2-{i+1:03}','question':q['question'],'options':opts,'answer':(q['answer']-shift)%4,'explanation':q['explanation'],'source':q.get('source','Banco editorial propio Base12 / EC Libros'),'sourceQuestionId':q['id'],'editorialSource':q['editorialSource']})
  essential=qs[::6][:10];essentialids={q['id'] for q in essential};p['checkTests']=essential;p['tests']=[q for q in qs if q['id'] not in essentialids]
  p['qualityGate']={'bank_count':50,'essential_count':10,'status':'REVISION_PEDAGOGICA_POR_REUTILIZACION_EDITORIAL_Y_CORRECCION_ESPECIFICA','no_publicar':False,'date':'2026-11-19','scope':'Preguntas completas, correspondencia de materia y correcciones específicas. No certificación jurídica externa.'}
  updates.append({'course_slug':c,'resource_id':row['resource_id'],'patch':{k:p[k] for k in ['tests','checkTests','qualityGate']}})
 report.append({'theme':f'T{n:02}','completeCandidates':len(pool),'selected':60,'sources':list(dict.fromkeys(q['editorialSource'] for q in chosen))})
data=json.dumps(updates,ensure_ascii=False,separators=(',',':')).replace("'","''")
(P/'editorial-phase2.sql').write_text("update public.opposition_materials m set payload=m.payload || e.patch,updated_at=now() from jsonb_to_recordset('"+data+"'::jsonb) e(course_slug text,resource_id text,patch jsonb) where m.course_slug=e.course_slug and m.resource_id=e.resource_id;")
(P/'records-current.json').write_text(json.dumps(rows,ensure_ascii=False));(P/'editorial-phase2-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(report)
