
CREATE TABLE public.scraped_courses (
  id uuid primary key default gen_random_uuid(),
  institution_key text not null,
  name text not null,
  faculty text,
  duration text,
  min_points integer,
  best_n integer default 6,
  requirements jsonb default '[]'::jsonb,
  source_url text,
  scraped_at timestamptz not null default now(),
  unique (institution_key, name)
);

GRANT SELECT ON public.scraped_courses TO anon, authenticated;
GRANT ALL ON public.scraped_courses TO service_role;

ALTER TABLE public.scraped_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read scraped courses"
  ON public.scraped_courses FOR SELECT
  USING (true);

CREATE INDEX scraped_courses_inst_idx ON public.scraped_courses (institution_key);
