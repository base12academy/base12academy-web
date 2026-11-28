update public.opposition_sources s
set consultation_method=v.method
from (values 
  ('Boletín Oficial de la Junta de Andalucía','Andalucía','boja_atom'),
  ('Boletín Oficial de la Comunidad de Madrid','Madrid','bocm_rss'),
  ('Boletín Oficial de la Ciudad Autónoma de Melilla (BOME)','Melilla','bome_sumario'),
  ('Boletín Oficial de Canarias (BOC)','Canarias','boc_rss'),
  ('Diario Oficial de Galicia (DOG)','Galicia','dog_rss'),
  ('Boletín Oficial de la Provincia de Ávila','Ávila','bop_avila_rss')
) v(name,territory,method)
where s.name=v.name and s.territory=v.territory and s.active=false;
