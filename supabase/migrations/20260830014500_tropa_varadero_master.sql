alter table public.trop_varadero_system
  add column if not exists master_title text,
  add column if not exists master_full_text text,
  add column if not exists master_content_json jsonb,
  add column if not exists master_source_document text,
  add column if not exists master_source_sha256 text
    check (master_source_sha256 is null or master_source_sha256 ~ '^[0-9a-f]{64}$');
