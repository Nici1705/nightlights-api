# Database Setup

These instructions cover 1) importing the summary data into the postgres database
and 2) generating the vector tiles of village lights for upload to Mapbox.

## Dependencies

Before running the `Makefile` make sure you have the following installed:
- Postgres 9.0+ and PostGIS 2.1.7+
- R 3.1.2 with the `tidyr`, `dplyr`, and `jsonlite` packages installed
- ogr2ogr
- GNU parallel
- tippecanoe (only if you're generating the sample village tileset)

## Installing

The scripts here expect that the `data/` directory contains:

 - The gzipped CSV files of the [summary data](../summaries/README.md), as produced by the data processing scripts.
  - `months/*.gz`: monthly village data - files will be gunzipped and concatenated
  - `states-months/*.gz`: monthly state data - files will be gunzipped and concatenated
  - `districts/*.gz`: monthly districts data - files will be gunzipped and concatenated
  - `states-distribution/*.gz`: state quintile distribution data - files will be gunzipped and concatenated
  - `districts-distribution/*.gz`: district quintile distribution data - files will be gunzipped and concatenated
 - `DISTRICT_11.*`: the 2011 India district boundaries shapefile from MLInfo
 - `UD_vills_CCODE01.csv`: Data from the RGGVY program
 - `villages.csv`: Villagecodes and associated lat,lon

Note: if you're producing your own monthly aggregate data, you can place `districts.csv`, `states-months.csv`,
`districts-distribution.csv`, `states-distribution.csv` directly in the `data/`
directory, in lieu of making gzipped chunks. Refer to file structure
descriptions [here](../summaries/README.md).

To run all the database scripts run `make DATABASE_URL=postgres://...`

Commands:
- `make boundaries *`: calls the following
  - `make csv_boundaries`: create the CSV files for districts and states
  - `make boundaries_import *`: creates the DB tables and imports
  - `make boundaries_index *`: creates the tables index
- `make villages * `:
  - `make villages_import * `: imports villages.csv and parallel streams the village montly data
  - `make villages_indes * `: build the villages tables index
- `make rggvy * `: creates rggvy.csv, the rgvy table and imports it
- `make sample`: Create vector tiles
- `make clean`:
  - `make clean_boundaries`: remove boundaries csvs and deps
  - `make clean_rgvy`: remove rggvy csvs and deps


 `*`: takes `DATABASE_URL` as an argument


