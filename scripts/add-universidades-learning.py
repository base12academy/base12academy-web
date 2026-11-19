"""Add learning objectives and an expanded LRJSP lesson without certifying pending banks."""
from pathlib import Path
import copy,json
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT.parent/'university-import'
records=json.loads((DATA/'records-corrected-lrjsp.json').read_text())
objectives=json.loads((ROOT/'scripts/universidades-learning-objectives.json').read_text())
example=json.loads((ROOT/'scripts/universidades-lrjsp-learning.json').read_text())
updates=[]
for r in records:
 if not r['course_slug'].endswith('universidades') or not r['resource_id'].startswith('T'):continue
 t=r['payload'];code=r['resource_id'];assert code in objectives
 learning={'objectives':objectives[code],
   'method':['Localiza los conceptos del tema y distingue la norma aplicable de su explicación.',
             'Explica sin mirar una distinción del tema y comprueba después si tu respuesta es precisa.',
             'Resuelve una situación indicando hechos relevantes, regla aplicable y decisión.',
             'Después del test, identifica la causa de cada error y vuelve al apartado que la resuelve.'],
   'reviewStatus':'lesson_scaffold_added_question_bank_review_still_pending'}
 if code=='T09':
  learning.update(copy.deepcopy(example));learning['reviewStatus']='lesson_expanded_and_60_questions_source_checked'
 t['learning']=learning
 updates.append({'course_slug':r['course_slug'],'resource_id':code,'learning':learning})
assert len(updates)==96
body=json.dumps(updates,ensure_ascii=False,separators=(',',':')).replace("'","''")
query="update public.opposition_materials m set payload=jsonb_set(m.payload,'{learning}',v.learning,true),updated_at=now() from jsonb_to_recordset('"+body+"'::jsonb) v(course_slug text,resource_id text,learning jsonb) where m.course_slug=v.course_slug and m.resource_id=v.resource_id returning m.course_slug,m.resource_id;"
(DATA/'add-learning.sql').write_text(query)
(DATA/'records-learning.json').write_text(json.dumps(records,ensure_ascii=False))
print('Prepared',len(updates),'learning guides; no pending question bank marked approved.')
