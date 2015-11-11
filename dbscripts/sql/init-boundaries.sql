-- Drop everything
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS districts_month CASCADE;
DROP TABLE IF EXISTS states_month CASCADE;

-- District metadata table
-- Contains districts

CREATE TABLE districts (
  district_key varchar(50) primary key,
  district_name varchar(50),
  state_key varchar(20),
  state_name varchar(20)
);

-- District per month table

CREATE TABLE districts_month (
  key varchar(50) REFERENCES districts (district_key),
  year smallint,
  month smallint,
  satellite varchar(10),
  count integer,
  vis_mean decimal(6,4),
  vis_sd decimal(6,4),
  vis_min decimal(6,4),
  vis_median decimal(6,4),
  vis_max decimal(6,4),
  quintile1 decimal(6,4),
  quintile2 decimal(6,4),
  quintile3 decimal(6,4),
  quintile4 decimal(6,4)
);

-- State per month table

CREATE TABLE states_month (
  key varchar(50),
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

