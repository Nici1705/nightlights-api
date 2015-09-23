-- Drop everything
DROP TABLE IF EXISTS villages CASCADE;
DROP TABLE IF EXISTS villages_month CASCADE;

-- Village metadata Table
-- Contains data about each village

CREATE TABLE villages (
  villagecode bigint primary key,
  longitude real,
  latitude real,
  acid smallint,
  district_key varchar(40) 
);

-- Village per month table

CREATE TABLE villages_month (
  villagecode bigint REFERENCES villages (villagecode),
  year smallint,
  month smallint,
  satellite varchar(10),
  count integer,
  vis_mean decimal(6,4),
  vis_sd decimal(6,4),
  vis_min decimal(6,4),
  vis_median decimal(6,4),
  vis_max decimal(6,4)
);
