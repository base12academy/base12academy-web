select cron.alter_job(
  jobid,
  command := $job$
    select net.http_post(
      url := 'https://base12academy.es/api/banco-opositores/ingest',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || coalesce(
          (select decrypted_secret from vault.decrypted_secrets where name = 'base12_cron_secret' limit 1),
          ''
        )
      ),
      body := jsonb_build_object('source', 'boe'),
      timeout_milliseconds := 55000
    );
  $job$
)
from cron.job
where jobname = 'base12-opposition-ingestion';
