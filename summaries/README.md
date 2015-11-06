# Summary Data

The monthly summary data needed by the nightlights-api are as follows:

## Village metadata

**`villages.csv`:** the villages, with location and region info.
This file *should* have a header, and the following structure:
```
villagecode,longitude,latitude,name,tot_pop,state,district,acid
```

To recreate this file from the village and district shapefiles:

```sh
ogr2ogr -f CSV villages.csv VillAC_ALLINDIA_ids_xy.shp -dialect SQLITE -sql "SELECT v.C_CODE01 as villagecode, v.LONGITUDE as longitude, v.LATITUDE as latitude, v.NAME as name, v.TOT_POP as tot_pop, d.STATE_UT as state, d.DISTRICT as district, v.AC_ID as acid  FROM VillAC_ALLINDIA_ids_xy v, 'districts_clipped.shp'.districts_clipped as d WHERE ST_Contains(d.Geometry, v.Geometry)"
```


## Summaries

The following CSV files, containing the time series, should *not* have headers.

**`months/*.gz`**: Since the village-level data is quite large, it is expected in (any number of) gzipped pieces, within a folder called `months`.  Comma-separated data should be in the following order (again, with no header):
```
villagecode, year, month, satellite, num_observations, vis_mean, vis_sd, vis_min, vis_median, vis_max
```

**`districts.csv`**
```
state, district, year, month, satellite, num_observations, vis_mean, vis_sd, vis_min, vis_median, vis_max
```

**`states_months.csv`**
```
state, year, month, satellite, num_observations, vis_mean, vis_sd, vis_min, vis_median, vis_max
```

**`districts_distribution.csv`**
```
state, district, year, month, satellite, quintile, min, max
```

**`states_distribution.csv`**
```
state, year, month, satellite, quintile, min, max
```

**Column Info:**
latitude, longitude: decimal degrees
state: state name (e.g. 'Uttar Pradesh')
district: district name (e.g., 'Hardoi')
year: numeric, e.g. 2011
month: numeric, month of year, 1 == January
satellite: string (e.g. 'F10')
num_observations, vis_mean, vis_sd, vis_min, vis_median, vis_max: numeric
quintile, min, max: quintile number (1-5), min value for that quintile, max value for that quintile

Instructions for generating these data from the raw nightly TIF files are below.

## Dependencies

The following pipeline depends on:

 - R >= v3.0
 - csvcut

## Extract tabular data from nightly TIFs

Use [this R script](DMSP_extract.R) to extract data for village points like so:

```sh
r --slave --no-restore --file=DMSP_extract.R --args /absolute/path/to/village-points.shp input-dir output-dir
```

Note that for the entire 20-year timespan, the final output is ~1.2 TB, so that doing the entire extraction in serial is infeasible.


## Clean the CSV

[clean-csv.sh](clean-csv.sh) does a bit of cleanup on the CSV, preparing it for
use with Redshift (or another SQL) db.  Use it with `./clean-csv.sh
the-csv-file.csv`, or parallelize with GNU parallel with `parallel
./clean-csv.sh ::: your/csv/files/*.csv`.

## Generate summaries

For generating the monthly summaries of the dataset, we used Amazon Redshift to
deal with the large volume of data, but the scripts could be relatively easily
adapted to another SQL database.

To use redshift to create summaries, put the cleaned CSV data onto an S3
bucket, and then, from this directory, run:

```
./config.js
```

This will output `summaries.configured.sql` (warning--this file will include
your AWS credentials!), which you can then feed to an Amazon RedShift cluster

