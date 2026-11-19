"""Replace the defective LRJSP set with sixty individually authored, source-checked items.

Preserves the original masters. Applies the identical reviewed set to the equivalent
C1/C2 topic; no other topic is marked reviewed by this operation.
"""
import copy, hashlib, json, random
from pathlib import Path

root=Path(__file__).resolve().parents[1]
data=root.parent/'university-import'
rows=json.loads((root/'scripts/universidades-lrjsp-reviewed.json').read_text())
assert len(rows)==60 and len({r[0] for r in rows})==60
assert all(len(r)==7 and len(set(r[1:5]))==4 for r in rows)
checks={0,5,9,17,23,30,35,41,50,57}
source='https://www.boe.es/buscar/act.php?id=BOE-A-2015-10566'
records=json.loads((data/'records.json').read_text())
changed=[]
for record in records:
    if record['course_slug'] not in ['administrativos-universidades','auxiliares-universidades'] or record['resource_id']!='T09':continue
    old=copy.deepcopy(record['payload']);theme=record['payload'];level='C1' if record['course_slug'].startswith('administrativos-') else 'C2'
    bank=[];essential=[]
    for n,row in enumerate(rows):
        stem,correct,b,c,d,article,reason=row
        options=[correct,b,c,d]
        seed=int(hashlib.sha256(stem.encode()).hexdigest(),16)
        random.Random(seed).shuffle(options)
        group=essential if n in checks else bank
        item={'id':f'UNI-{level}-T09-REV2-{n+1:02}', 'question':stem,'options':options,'answer':options.index(correct),
          'explanation':f'{reason} Ley 40/2015, artículo {article}.','source':source,'sourceArticle':article,
          'origin':'REDACCION_ESPECIFICA_CORRECCION_LRJSP_2026_11_19',
          'qualityReview':{'status':'CONTRASTADA_CON_TEXTO_OFICIAL','flags':[],'sourceChecked':True,'reviewedAt':'2026-11-19'}}
        group.append(item)
    assert len(bank)==50 and len(essential)==10
    theme['tests']=bank;theme['checkTests']=essential
    theme['qualityGate']={'bank_count':50,'essential_count':10,'bankCriticalFlags':0,'essentialCriticalFlags':0,
      'status':'CONJUNTO_REESCRITO_Y_CONTRASTADO_CON_BOE','no_publicar':False,'auditDate':'2026-11-19',
      'scope':'Solo estas 60 preguntas y sus opciones; no extiende validacion a otros temas','source':source}
    theme['repair']={'date':'2026-11-19','method':'Reescritura individual de 60 preguntas con contraste BOE; aplicacion al mismo tema en C1/C2',
       'originalPayloadSHA256':hashlib.sha256(json.dumps(old,ensure_ascii=False,sort_keys=True).encode()).hexdigest()}
    theme['studyEdition']='2026-11-19-correccion-LRJSP'
    (data/f'original-{level}-T09.json').write_text(json.dumps(old,ensure_ascii=False,indent=2))
    changed.append(record)
    body=json.dumps([record],ensure_ascii=False,separators=(',',':')).replace("'","''")
    query="insert into public.opposition_materials(course_slug,resource_id,payload,updated_at) select x.course_slug,x.resource_id,x.payload,now() from jsonb_to_recordset('"+body+"'::jsonb) x(course_slug text,resource_id text,payload jsonb) on conflict(course_slug,resource_id) do update set payload=excluded.payload,updated_at=excluded.updated_at;"
    (data/f'corrected-{level}-T09.sql').write_text(query)
(data/'records-corrected-lrjsp.json').write_text(json.dumps(records,ensure_ascii=False))
(data/'correction-lrjsp-report.json').write_text(json.dumps({'themes':[r['course_slug'] for r in changed],'distinctAuthoredQuestions':60,'deployedQuestions':120,'bankPerCourse':50,'checkPerCourse':10,'source':source,'otherThemesValidated':False},ensure_ascii=False,indent=2))
print('Corrected',len(changed),'equivalent topics, 50 bank and 10 essential each; other topics unchanged.')
