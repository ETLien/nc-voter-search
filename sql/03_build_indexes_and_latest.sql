/*
03_build_indexes_and_latest.sql
Purpose:
1) Create/ensure indexes exist on base tables
2) Update planner statistics (ANALYZE)
3) (Re)build the materialized view used for fast "latest per NCID" searching
4) Create/ensure indexes exist on the materialized view
Notes:
- Uses IF NOT EXISTS so you can safely re-run while iterating.
- Drops/recreates the materialized view each run so it always reflects current base-table data.
*/

-- REQUIRED for DISTINCT ON (ncid) ORDER BY data_date DESC
CREATE INDEX IF NOT EXISTS idx_hist_ncid_datadate_desc
ON public.nc_vreg_history (ncid, data_date DESC);

-- Exact-match searchable fields
CREATE INDEX IF NOT EXISTS idx_hist_county_desc
ON public.nc_vreg_history (county_desc);

CREATE INDEX IF NOT EXISTS idx_hist_city_desc
ON public.nc_vreg_history (res_city_desc);

CREATE INDEX IF NOT EXISTS idx_hist_last_name
ON public.nc_vreg_history (last_name);

CREATE INDEX IF NOT EXISTS idx_hist_first_name
ON public.nc_vreg_history (first_name);

-- Keep only if users can filter by middle name
CREATE INDEX IF NOT EXISTS idx_hist_middle_name
ON public.nc_vreg_history (middle_name);

-- Optional composite for common lookups
CREATE INDEX IF NOT EXISTS idx_hist_last_first
ON public.nc_vreg_history (last_name, first_name);

-- Supports: WHERE ncid = ? ORDER BY election_lbl DESC
CREATE INDEX IF NOT EXISTS idx_vhis_ncid_election_lbl_desc
ON public.nc_vhis_history (ncid, election_lbl DESC);

ANALYZE public.nc_vreg_history;
ANALYZE public.nc_vhis_history;

-- Materialized view for fast search (latest row per NCID)
DROP MATERIALIZED VIEW IF EXISTS public.nc_vreg_latest;

CREATE MATERIALIZED VIEW public.nc_vreg_latest AS
SELECT DISTINCT ON (ncid)
  ncid,
  county_desc,
  last_name,
  first_name,
  middle_name,
  res_city_desc,
  data_date
FROM public.nc_vreg_history
WHERE ncid IS NOT NULL AND ncid <> ''
ORDER BY ncid, data_date DESC;

-- Indexes on materialized view (fast exact searches)
CREATE UNIQUE INDEX IF NOT EXISTS idx_latest_ncid
ON public.nc_vreg_latest (ncid);

CREATE INDEX IF NOT EXISTS idx_latest_last_first
ON public.nc_vreg_latest (last_name, first_name);

CREATE INDEX IF NOT EXISTS idx_latest_county_desc
ON public.nc_vreg_latest (county_desc);

CREATE INDEX IF NOT EXISTS idx_latest_city_desc
ON public.nc_vreg_latest (res_city_desc);

ANALYZE public.nc_vreg_latest;

-- Quick storage check
SELECT
  'nc_vreg_history' AS table_name,
  pg_size_pretty(pg_total_relation_size('public.nc_vreg_history')) AS total_size
UNION ALL
SELECT
  'nc_vhis_history' AS table_name,
  pg_size_pretty(pg_total_relation_size('public.nc_vhis_history')) AS total_size
UNION ALL
SELECT
  'nc_vreg_latest' AS table_name,
  pg_size_pretty(pg_total_relation_size('public.nc_vreg_latest')) AS total_size;
