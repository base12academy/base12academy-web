"""Import reviewed university masters and packaged regional materials without downloads."""
import csv, importlib.util, io, json, re, sys
from pathlib import Path
from zipfile import ZipFile

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('packages',ROOT/'scripts/import-haciendas-locales.py')
helpers=importlib.util.module_from_spec(spec);spec.loader.exec_module(helpers)
OUT=ROOT.parent/'university-import';OUT.mkdir(exist_ok=True)
records=[]
def save(slug,index,resources):
    p=ROOT/'lib/oppositions'/slug;p.mkdir(parents=True,exist_ok=True)
    (p/'index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')
    for rid,payload in resources.items():
        records.append({'course_slug':slug,'resource_id':rid,'payload':payload})
def question(q):
    return {'id':q['id'],'question':q['question'],'options':[q[k] for k in 'ABCD'],
            'answer':'ABCD'.index(q['answer']),'explanation':q['explanation']}
for source in (ROOT.parent/'universidades/source').glob('*MAESTRO*.json'):
    master=json.loads(source.read_text());slug=master['courseSlug'];level=master['level']
    archive=next(source.parent.glob(('*C1*' if level=='C1' else '*C2*')+'Premium*.zip'))
    with ZipFile(archive) as z:
        closed=json.loads(z.read('05_Rocio/Rocio_preguntas_cerradas.json'))
        resources={}
        for theme in master['themes']:
            theme=dict(theme)
            theme['rocio']=[{'question':q['pregunta'],'answer':q['respuesta_esperada']+'\n'+q.get('criterio','')} for q in closed if int(q['tema'])==theme['number']]
            resources[theme['id']]=theme
        simulations=[]
        documents=[]
        for name in z.namelist():
            if not name.startswith(('00_Guia/','08_Premium/','06_Simulacros/','07_Solucionarios_de_simulacro/')) or 'Registro_de_progreso' in name:continue
            blocks=[]
            if name.endswith('.docx'):blocks=helpers.chapter(helpers.document(z,name))
            elif name.endswith('.txt'):blocks=[{'type':'paragraph','text':z.read(name).decode('utf-8-sig')}]
            elif name.endswith('.csv'):
                rows=list(csv.reader(io.StringIO(z.read(name).decode('utf-8-sig')),delimiter=';' if b';' in z.read(name).splitlines()[0] else ','))
                blocks=[{'type':'table','text':name,'rows':rows}]
            if blocks:documents.append({'title':Path(name).stem.replace('_',' '),'minimumPlan':'premium' if name.startswith('08_Premium/') else 'estandar' if name.startswith(('06_Simulacros/','07_Solucionarios_de_simulacro/')) else 'esencial','blocks':blocks})
        resources['documents']={'documents':documents}
        resources['resources']={'glossary':master['glossary'],'simulations':simulations}
        index={'courseSlug':slug,'title':master['title'],'shortTitle':master['title'],'level':level,'region':'Universidades','durationMonths':12,'enrollmentOpen':False,
          'themes':[{k:t[k] for k in ['id','code','number','title','publicPreview']} for t in master['themes']],
          'simulations':simulations,'simulationNote':'Practica con test aleatorios de 20 preguntas. Los cinco simulacros de respuesta breve y sus solucionarios están en Recursos del paquete. El módulo autonómico tiene su propio entrenamiento.',
          'counts':master['counts']}
        save(slug,index,resources)
        print(slug,len(master['themes']),sum(len(t['tests']) for t in master['themes']),len(documents))

regions={'La_Rioja':'la-rioja','Murcia':'region-de-murcia','Navarra':'navarra','Pais_Vasco':'pais-vasco','Valencia':'comunidad-valenciana'}
with ZipFile(next((ROOT.parent/'modules').glob('*.zip'))) as bundle:
    for key,region in regions.items():
        archive=next(n for n in bundle.namelist() if f'_{key}_Estandar_' in n)
        with ZipFile(io.BytesIO(bundle.read(archive))) as z:
            meta=json.loads(z.read('course_manifest.json'));themes=json.loads(z.read('temas.json'))
            bank=json.loads(z.read(next(n for n in z.namelist() if re.fullmatch(r'banco_\d+.json',n))))
            checks=json.loads(z.read('tests_temas.json'));closed=json.loads(z.read('rocio_closed.json'));glossary=json.loads(z.read('glosario.json'))
            resources={};slug='modulo-autonomico-'+region
            for t in themes:
                n=t['number'];rid=f'T{n:02}';blocks=[{'type':'paragraph','text':t.get('overview','')}]
                temario=next((name for name in z.namelist() if name.startswith(f'Temario_{n:02}_') and name.endswith('.docx')),None)
                if temario:blocks=helpers.chapter(helpers.document(z,temario))
                else:
                    for heading,text in t['sections']:blocks.extend([{'type':'heading','text':heading},{'type':'paragraph','text':text}])
                explanation=next((name for name in z.namelist() if name.startswith(f'Explicacion_{n:02}_') and name.endswith('.docx')),None)
                if explanation:blocks+=helpers.chapter(helpers.document(z,explanation))
                resources[rid]={'id':rid,'code':rid,'number':n,'title':t['title'],'publicPreview':n==1,'blocks':blocks,'glossary':glossary,
                  'rocio':[{'question':q['question'],'answer':q['answer']} for q in closed if q.get('topic')==n],
                  'tests':[question(q) for q in bank if q['topic']==n],
                  'checkTests':[question(q) for group in checks if group['number']==n for q in group['questions']][:10]}
            sims=[]
            for sim in json.loads(z.read('simulacros_autonomicos_5x20.json')):
                rid=f"SIM{sim['number']:02}";qs=[question(q) for q in sim['questions']]
                resources[rid]={'id':rid,'title':f"Simulacro autonómico {sim['number']}",'questions':qs};sims.append({'id':rid,'title':resources[rid]['title'],'count':len(qs)})
            resources['resources']={'glossary':glossary,'simulations':sims}
            index={'courseSlug':slug,'title':'Módulo autonómico · '+meta['community'],'shortTitle':meta['community'],'level':'C1/C2','region':meta['community'],'durationMonths':12,'enrollmentOpen':True,
              'themes':[{k:t[k] for k in ['id','code','number','title','publicPreview']} for t in resources.values() if 'blocks' in t],
              'simulations':sims,'counts':{'themes':len(themes),'questions':len(bank),'glossaryTerms':len(glossary)}}
            save(slug,index,resources);print(slug,len(themes),len(bank))

for row in records:
    if re.fullmatch('T[0-9]+',row['resource_id']):
        t=row['payload'];assert t['blocks'] and t['glossary'] and t['tests'] and len(t['checkTests'])==10
        for q in t['tests']+t['checkTests']:assert len(q['options'])==4 and q['answer'] in range(4) and q['explanation']
for i,row in enumerate(records):
    body=json.dumps([row],ensure_ascii=False,separators=(',',':')).replace("'","''")
    sql="insert into public.opposition_materials(course_slug,resource_id,payload,updated_at) select x.course_slug,x.resource_id,x.payload,now() from jsonb_to_recordset('"+body+"'::jsonb) as x(course_slug text,resource_id text,payload jsonb) on conflict(course_slug,resource_id) do update set payload=excluded.payload,updated_at=excluded.updated_at;"
    (OUT/f'{i:03}.sql').write_text(sql)
(OUT/'records.json').write_text(json.dumps(records,ensure_ascii=False))
print('Import records',len(records))
