-- Drop everything
DROP INDEX IF EXISTS rgvy_energ_idx CASCADE;

-- Create indexes on tables
-- Do this after imports

CREATE INDEX rgvy_energ_idx ON rgvy (energ_date);

--- Add a foreign key constraint; requires deleting any rows that violate it, which is quite slow
--- DELETE FROM rgvy WHERE villagecode NOT IN (SELECT v.villagecode FROM villages v);
--- ALTER TABLE rgvy ADD CONSTRAINT rgvy_villagecode_fk FOREIGN KEY (villagecode) REFERENCES villages (villagecode);
