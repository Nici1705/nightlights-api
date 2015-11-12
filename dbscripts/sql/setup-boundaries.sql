--- Generate district key
ALTER TABLE districts_boundaries ADD COLUMN district_key varchar(50);
UPDATE districts_boundaries SET
  district_key = lower(replace(state_ut,' ','-')) || '-' || lower(replace(district,' ', '-'));

--- Dissolve duplicate districts
--- NOTE: we average the population data because it's duplicated in the shpaefile.
drop table if exists districts_boundaries_merged;
create table districts_boundaries_merged as
select
  district_key,
  lower(replace(state_ut, ' ', '-')) as state_key,
  avg(tot_pop) as tot_pop,
  avg(f_pop) as f_pop,
  avg(tot_lit) as tot_lit,
  ST_Union(geom) as geom
from districts_boundaries
group by state_key, district_key;

drop table districts_boundaries;
alter table districts_boundaries_merged rename to districts_boundaries;

--- Simplify boundaries using a topology
-- Create a topology
select topology.droptopogeometrycolumn('public', 'districts_boundaries', 'topogeom');
select topology.DropTopology('districts_topo');
select topology.CreateTopology('districts_topo', find_srid('public', 'districts_boundaries', 'geom'));
-- Add a layer
select topology.addtopogeometrycolumn('districts_topo', 'public', 'districts_boundaries', 'topogeom', 'MULTIPOLYGON');
-- Populate the layer and the topology: this step takes a while.
UPDATE districts_boundaries SET topogeom = topology.toTopoGeom(geom, 'districts_topo', 1);

--- Simplify (see init-postgis.sql)
SELECT SimplifyEdgeGeom('districts_topo', edge_id, 0.01) FROM districts_topo.edge;
-- Convert the TopoGeometries to Geometries for visualization
ALTER TABLE districts_boundaries DROP COLUMN geom_simplified;
ALTER TABLE districts_boundaries ADD geom_simplified GEOMETRY;
UPDATE districts_boundaries SET geom_simplified = topogeom::geometry;

--- Dissolve districts into states

drop table if exists states_boundaries;
create table states_boundaries as
select
  state_key,
  sum(tot_pop) as tot_pop,
  sum(f_pop) as f_pop,
  sum(tot_lit) as tot_lit,
  ST_Union(geom) as geom,
  ST_Union(geom_simplified) as geom_simplified,
from districts_boundaries
group by state_key;
