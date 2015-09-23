-- Drop everything
DROP INDEX IF EXISTS villages_month_key_idx CASCADE;
DROP INDEX IF EXISTS villages_month_year_month_villagecode_idx CASCADE;

-- Create indexes on tables
-- Do this after imports

ALTER TABLE villages ADD CONSTRAINT village_district_fk FOREIGN KEY (district_key) REFERENCES districts (district_key);

CREATE INDEX villages_month_key_idx ON villages_month (villagecode);
CREATE INDEX villages_month_year_month_villagecode_idx ON villages_month (villagecode, year, month);

-- CLUSTER the database according to the new index
-- ANALYZE to update statistics
CLUSTER VERBOSE villages_month USING villages_month_year_month_villagecode_idx;
ANALYZE;
