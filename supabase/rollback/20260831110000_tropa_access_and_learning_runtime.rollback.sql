drop table if exists public.trop_operation_attempts;
drop table if exists public.trop_simulacro_attempts;
drop table if exists public.trop_question_attempts;

drop policy if exists "Enrolled students read TROP aptitudes" on public.trop_aptitudes;
create policy "Enrolled students read TROP aptitudes"
on public.trop_aptitudes for select to authenticated
using (
  exists (
    select 1 from public.course_enrollments enrollment
    where enrollment.user_id = auth.uid()
      and enrollment.course_slug = 'tropa-y-marineria'
      and enrollment.status = 'active'
      and enrollment.starts_at <= now()
      and (enrollment.expires_at is null or enrollment.expires_at >= now())
  )
);

drop policy if exists "Enrolled students read TROP motors" on public.trop_motors;
create policy "Enrolled students read TROP motors"
on public.trop_motors for select to authenticated
using (
  exists (
    select 1 from public.course_enrollments enrollment
    where enrollment.user_id = auth.uid()
      and enrollment.course_slug = 'tropa-y-marineria'
      and enrollment.status = 'active'
      and enrollment.starts_at <= now()
      and (enrollment.expires_at is null or enrollment.expires_at >= now())
      and public.trop_plan_rank(enrollment.plan_slug) >= public.trop_plan_rank(minimum_interactive_plan)
  )
);

drop policy if exists "Enrolled students read TROP families" on public.trop_families;
create policy "Enrolled students read TROP families"
on public.trop_families for select to authenticated
using (
  exists (
    select 1 from public.course_enrollments enrollment
    where enrollment.user_id = auth.uid()
      and enrollment.course_slug = 'tropa-y-marineria'
      and enrollment.status = 'active'
      and enrollment.starts_at <= now()
      and (enrollment.expires_at is null or enrollment.expires_at >= now())
  )
);

drop function if exists public.trop_user_can_access_motor(text, text);
drop function if exists public.trop_user_can_access_aptitude(text);
drop table if exists public.trop_product_grants;
