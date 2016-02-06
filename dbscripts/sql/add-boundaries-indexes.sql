--Drop everything
DROP INDEX IF EXISTS districts_month_key_idx CASCADE;
DROP INDEX IF EXISTS districts_month_ym_idx CASCADE;
DROP INDEX IF EXISTS state_month_key_idx CASCADE;
DROP INDEX IF EXISTS state_month_ym_idx CASCADE;
DROP INDEX IF EXISTS districts_state_key_idx CASCADE;
DROP INDEX IF EXISTS districts_district_key_idx CASCADE;
DROP INDEX IF EXISTS districts_boundaries_district_key_idx CASCADE;
DROP INDEX IF EXISTS states_boundaries_state_key_idx CASCADE;

-- Create indexes on tables
-- Do this after imports

CREATE INDEX districts_month_key_idx ON districts_month (key);
CREATE INDEX districts_month_ym_idx ON districts_month (year,month);
CREATE INDEX state_month_key_idx ON states_month (key);
CREATE INDEX state_month_ym_idx ON states_month (year,month);
CREATE INDEX districts_state_key_idx ON districts (state_key);
CREATE INDEX districts_district_key_idx ON districts (district_key);
CREATE INDEX districts_boundaries_district_key_idx ON districts_boundaries (district_key);
CREATE INDEX states_boundaries_state_key_idx ON states_boundaries (state_key);

-- geometry indexes
DROP INDEX IF EXISTS districts_boundaries_idx;
DROP INDEX IF EXISTS states_boundaries_idx;

CREATE INDEX districts_boundaries_idx ON districts_boundaries USING GIST (geom);
CREATE INDEX states_boundaries_idx ON states_boundaries USING GIST (geom);
