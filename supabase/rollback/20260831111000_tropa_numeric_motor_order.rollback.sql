alter table public.trop_motors
  drop constraint if exists trop_motors_aptitude_slug_display_order_key;

update public.trop_motors
set display_order = case code when 'NU01' then 1 when 'NU02' then 2 when 'NU03' then 3 end,
    minimum_interactive_plan = case code
      when 'NU01' then 'esencial'
      when 'NU02' then 'operativa'
      when 'NU03' then 'integral'
    end,
    updated_at = now()
where code in ('NU01', 'NU02', 'NU03');

alter table public.trop_motors
  add constraint trop_motors_aptitude_slug_display_order_key
  unique (aptitude_slug, display_order);

delete from public.trop_plan_motors
where motor_code in ('NU01', 'NU02', 'NU03');

insert into public.trop_plan_motors (plan_slug, motor_code)
values
  ('esencial', 'NU01'),
  ('operativa', 'NU01'), ('operativa', 'NU02'),
  ('integral', 'NU01'), ('integral', 'NU02'), ('integral', 'NU03')
on conflict (plan_slug, motor_code) do nothing;
