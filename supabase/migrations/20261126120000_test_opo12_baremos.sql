-- Each attempt snapshots its set's settings, so saved results keep their original grading.
with grading(course, size, reserve_count, sections) as (
 values
  ('auxilio-judicial', 146, 6,
   '[{"label":"Primer ejercicio","count":100,"credit":0.60,"penalty":0.15},{"label":"Segundo ejercicio","count":40,"credit":1,"penalty":0.25}]'::jsonb),
  ('tramitacion-procesal', 140, 10,
   '[{"label":"Primer ejercicio","count":100,"credit":0.60,"penalty":0.15},{"label":"Segundo ejercicio","count":10,"credit":2,"penalty":0.50},{"label":"Tercer ejercicio","count":20,"credit":1,"penalty":0.25}]'::jsonb),
  ('agentes-hacienda-publica', 110, 0,
   '[{"label":"Parte tipo test","count":80,"credit":1,"penalty":0.25}]'::jsonb)
)
update public.test_opo12_sets as s
set settings=jsonb_set(s.settings,'{scoringSections}',g.sections)
from grading as g
where s.course=g.course and s.kind='simulacro'
  and s.id ~ '^SIM(0[1-9]|10)$'
  and jsonb_array_length(s.items)=g.size
  and (s.settings->>'reserve')::integer=g.reserve_count;
