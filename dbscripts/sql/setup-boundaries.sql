BEGIN;

--- Generate district key
ALTER TABLE districts_boundaries_import ADD COLUMN district_key varchar(50);
UPDATE districts_boundaries_import SET
  district_key = lower(replace(state_ut,' ','-')) || '-' || lower(replace(district,' ', '-'));

--- Dissolve duplicate districts
--- NOTE: we average the population data because it's duplicated in the shpaefile.
drop table if exists districts_boundaries;
create table districts_boundaries as
select
  district_key,
  lower(replace(state_ut, ' ', '-')) as state_key,
  avg(tot_pop) as tot_pop,
  avg(f_pop) as f_pop,
  avg(tot_lit) as tot_lit,
  ST_Union(geom) as geom,
  ST_Extent(geom) as bbox
from districts_boundaries_import
group by state_key, district_key;

create temp table states_meta on commit drop as
SELECT state_key,
  sum(tot_pop) as tot_pop,
  sum(f_pop) as f_pop,
  sum(tot_lit) as tot_lit
FROM districts_boundaries
GROUP BY state_key;

create temp table states_merged on commit drop as
select
  lower(replace(sb.state_ut, ' ', '-')) as state_key,
  ST_Union(sb.geom) as geom,
  ST_Extent(sb.geom) as bbox
from states_boundaries_import sb
group by sb.state_ut;

drop table if exists states_boundaries;
create table states_boundaries as
select
  sb.state_key,
  sb.geom,
  sb.bbox,
  sm.tot_pop,
  sm.f_pop,
  sm.tot_lit
from states_meta sm join states_merged sb on sm.state_key = sb.state_key;

DROP TABLE districts_boundaries_import;
DROP TABLE states_boundaries_import;

COMMIT;
