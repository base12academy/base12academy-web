"""Build topic exercises from source-checked facts plus usable existing questions.

A fact is practiced through recall, application, and recognition of a misconception.
Question count is not a claim about the number of independent legal concepts.
"""
from pathlib import Path
import json,re,hashlib,random
ROOT=Path(__file__).resolve().parents[1];DATA=ROOT.parent/'university-import'
rows=json.loads((DATA/'records-current.json').read_text())
def norm(s):return re.sub(r'\W+',' ',s.casefold()).strip()
def usable(q):
 return not q.get('exerciseType') and q.get('revisionMethod')!='aplicacion_contextual' and not any('|' in s or re.search(r'\bart\.$',s.strip(),re.I) for s in q['options']) and not re.search(r'(?i)apartado del tema|regla.*«|se estudia directamente|enunciado pertenece',q['question']) and 'CONTRASTE_RD855_2026' not in q.get('qualityReview',{}).get('flags',[])
updates=[];report=[]
for path in sorted((DATA/'reviewed-facts').glob('T*.json')):
 topic=path.stem;facts=json.loads(path.read_text());assert len(facts)>=20,(topic,len(facts))
 base=next(row for row in rows if row['course_slug']=='administrativos-universidades' and row['resource_id']==topic)
 old=[];seen=set()
 for q in base['payload']['tests']+base['payload']['checkTests']:
  if usable(q) and norm(q['question']) not in seen:old.append(q);seen.add(norm(q['question']))
 old=[]
 fresh=[[],[],[]]
 for i,f in enumerate(facts):
  assert len(f)==8 and all(isinstance(s,str) and s.strip() for s in f)
  direct,case,correct,w1,w2,w3,explanation,reference=f
  opts=[correct,w1,w2,w3];assert len({norm(s) for s in opts})==4,(topic,i)
  stems=[direct,case+' ¿Qué respuesta es adecuada?' if '?' not in case else case,f'Una persona responde a «{direct}» con «{w1}». ¿Qué alternativa corrige su respuesta?']
  for kind,stem in enumerate(stems):fresh[kind].append({'id':f'UNI-{topic}-SOURCE-FACT-{i+1:02}-{kind+1}','question':stem,'options':opts,'answer':0,'explanation':explanation+' Referencia: '+reference+'.','source':'Normativa oficial y elaboración pedagógica propia Base12 / EC Libros','reviewedFact':i+1,'exerciseType':['recuerdo','aplicacion','analisis_error'][kind],'reference':reference})
 needed=60-len(old);generated=[];used={norm(q['question']) for q in old}
 for candidate in fresh[0]+fresh[1]+fresh[2]:
  if norm(candidate['question']) in used:continue
  generated.append(candidate);used.add(norm(candidate['question']))
  if len(generated)==needed:break
 questions=old+generated;assert len(questions)==60,(topic,len(questions))
 assert len({norm(q['question']) for q in questions})==60,(topic,'duplicate stems')
 for row in rows:
  if row['resource_id']!=topic:continue
  c=row['course_slug'];out=[]
  for i,q in enumerate(questions):
   shift=int(hashlib.sha256((topic+str(i)).encode()).hexdigest()[:4],16)%4;options=q['options'][shift:]+q['options'][:shift]
   value={k:v for k,v in q.items() if k not in ['id','options','answer','qualityReview','revisionMethod','originalQuestion']}
   out.append(dict(value,id=f'UNI-{c.split("-")[0]}-{topic}-PED3-{i+1:03}',options=options,answer=(q['answer']-shift)%4))
  essential=out[::6][:10];ids={q['id'] for q in essential};bank=[q for q in out if q['id'] not in ids];random.Random(topic).shuffle(bank)
  patch={'tests':bank,'checkTests':essential,'qualityGate':{'bank_count':50,'essential_count':10,'status':'RECONSTRUIDO_PEDAGOGICAMENTE_CON_FUENTE_Y_APLICACION','no_publicar':False,'sourceCheckedFacts':len(facts),'retainedCompleteQuestions':len(old),'newExerciseQuestions':len(generated),'date':'2026-11-19','scope':'Revisión de formulación, alternativas, claves, referencias y correspondencia de contenidos. No certificación jurídica externa.'}}
  row['payload'].update(patch);updates.append({'course_slug':c,'resource_id':topic,'patch':patch})
 report.append({'topic':topic,'checkedFacts':len(facts),'retained':len(old),'newExercises':needed})
for i in range(0,len(updates),4):
 data=json.dumps(updates[i:i+4],ensure_ascii=False,separators=(',',':')).replace("'","''")
 (DATA/f'pedagogy-banks-{i:03}.sql').write_text("update public.opposition_materials m set payload=m.payload || e.patch,updated_at=now() from jsonb_to_recordset('"+data+"'::jsonb) e(course_slug text,resource_id text,patch jsonb) where m.course_slug=e.course_slug and m.resource_id=e.resource_id;")
(DATA/'records-current.json').write_text(json.dumps(rows,ensure_ascii=False));(DATA/'pedagogy-reconstruction-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(report);print('Banks rebuilt:',len(updates))
