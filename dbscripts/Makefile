all: boundaries villages rggvy

BOUNDARIES_CSVS = data/districts_meta.csv data/districts_month.csv data/states_month.csv
BOUNDARIES_CSVS_DEPS = data/states.csv data/districts.csv data/states_key.csv data/districts_key.csv
RGGVY_CSVS = data/rggvy.csv

.PHONY: sample
sample: data/sample.mbtiles

data/dbsample.csv:
	cat sql/sample.sql | psql ${DATABASE_URL} > $@

data/sample.csv: data/dbsample.csv
	./scripts/sample.R

data/sample.geojson: data/sample.csv
	ogr2ogr -f "GeoJSON" $@ scripts/sample.vrt

data/sample.mbtiles: data/sample.geojson
	 tippecanoe -l sample -Z 3 -z 8 -r 2 -m 4 -pd -f -o $@ $<

.PHONY: boundaries admin_import boundaries_import boundaries_index csv_boundaries
# csv_boundaries is redundant target to create only the csvs
csv_boundaries: $(BOUNDARIES_CSVS)
admin_import: $(BOUNDARIES_CSVS)
	# Reset db
	cat sql/init-postgis.sql sql/init-boundaries.sql | psql ${DATABASE_URL}
	# Import data
	cat data/districts_meta.csv | ./scripts/dbimport.sh ${DATABASE_URL} districts
	cat data/districts_month.csv | ./scripts/dbimport.sh ${DATABASE_URL} districts_month
	cat data/states_month.csv | ./scripts/dbimport.sh ${DATABASE_URL} states_month
# Import India admin boundaries
boundaries_import: data/boundaries/districts.shp data/boundaries/states.shp
	shp2pgsql -s 4326 -W "LATIN1" -d data/boundaries/districts.shp districts_boundaries_import | psql ${DATABASE_URL}
	shp2pgsql -s 4326 -W "LATIN1" -d data/boundaries/states.shp states_boundaries_import | psql ${DATABASE_URL}
	cat sql/setup-boundaries.sql | psql ${DATABASE_URL}
boundaries_index: admin_import 
	# Index
	cat ./sql/add-boundaries-indexes.sql | psql ${DATABASE_URL}

# Admin boundary preprocessing
data/boundaries/regions.shp:
	mkdir -p data/boundaries
	ogr2ogr -f "ESRI Shapefile" data/boundaries/regions.shp shp/india-poly.shp
	ogr2ogr -f "ESRI Shapefile" -update -append data/boundaries/regions.shp shp/Non\ Subj.\ Polys.shp -nln regions
	ogr2ogr -f "ESRI Shapefile" -update -append data/boundaries/regions.shp shp/Disp.\ Areas.shp -nln regions
	ogr2ogr -f "ESRI Shapefile" -update -append data/boundaries/regions.shp shp/jammu-and-kashmir.shp -nln regions
	ogr2ogr -f "ESRI Shapefile" -update -append data/boundaries/regions.shp shp/pakistan-undisputed.shp -nln regions
data/boundaries/districts_clipped.shp:
	ogr2ogr -f 'ESRI Shapefile' -clipsrc shp/india-clip-area.shp data/boundaries/districts_clipped.shp data/DISTRICT_11.shp
# -dialect sqlite \
-sql "SELECT d.Geometry, d.DIST_ID, d.DISTRICT, d.STATE_UT, d.TOT_POP, d.F_POP, d.TOT_LIT, group_concat(DISTINCT r.name) regions \
#  FROM DISTRICT_11 d LEFT JOIN 'data/boundaries/regions.shp'.regions r ON ST_Intersects(r.Geometry, d.Geometry) GROUP BY d.Geometry, d.DIST_ID, d.DISTRICT, d.STATE_UT, d.TOT_POP, d.F_POP, d.TOT_LIT"
data/boundaries/regions.topojson: data/boundaries/regions.shp
	topojson -p -q 1e5 -s 3e-8 data/boundaries/regions.shp > data/boundaries/regions.topojson
	topojson-geojson -o data/boundaries data/boundaries/regions.topojson
data/boundaries/regions.json: data/boundaries/regions.topojson
	@
data/boundaries/boundaries.topojson: data/boundaries/districts_clipped.shp
	topojson -p -q 1e5 -s 3e-8 data/boundaries/districts_clipped.shp > data/boundaries/boundaries.topojson
	./scripts/merge-districts.js data/boundaries/boundaries.topojson districts_clipped states
	# Export GeoJSON (districts_clipped.json and states.json)
	topojson-geojson -o data/boundaries data/boundaries/boundaries.topojson
data/boundaries/districts_clipped.json: data/boundaries/boundaries.topojson
	echo "exported districts"
data/boundaries/states.json: data/boundaries/boundaries.topojson
	echo "exported states"
data/boundaries/disputed-boundaries.geojson: data/boundaries/regions.topojson data/boundaries/boundaries.topojson
	./scripts/make_boundaries.js data/boundaries/boundaries.topojson districts_clipped data/boundaries/regions.topojson regions data/boundaries
data/boundaries/line-of-control.geojson: data/boundaries/disputed-boundaries.geojson
	@
data/boundaries/india.geojson: data/boundaries
data/boundaries/districts.shp: data/boundaries/districts_clipped.json
	ogr2ogr -f "ESRI Shapefile" data/boundaries/districts.shp data/boundaries/districts_clipped.json
data/boundaries/states.shp: data/boundaries/states.json
	ogr2ogr -f "ESRI Shapefile" data/boundaries/states.shp data/boundaries/states.json

# Import all admin area info and boundary data
boundaries: boundaries_import data/boundaries/disputed-boundaries.geojson boundaries_index

.PHONY: rggvy
rggvy: $(RGGVY_CSVS)
	cat sql/init-rggvy.sql | psql ${DATABASE_URL}
	cat data/rggvy.csv | ./scripts/dbimport.sh ${DATABASE_URL} rgvy
	cat ./sql/add-rggvy-indexes.sql | psql ${DATABASE_URL}

data/rggvy.csv:
	./scripts/rggvy.R

.PHONY: villages
villages_import: data/villages_meta.sql
	# Reset db
	cat sql/init-postgis.sql sql/init-villages.sql | psql ${DATABASE_URL}
	# Import village metadata
	cat data/villages_meta.sql | psql ${DATABASE_URL}
	# Import village by month data
	parallel --bar 'cat {} | gunzip | ./scripts/dbimport.sh ${DATABASE_URL} villages_month ' ::: data/months/*.gz
villages_index:
	# Index 
	cat ./sql/add-villages-indexes.sql | psql ${DATABASE_URL}

data/villages_meta.sql:
	# Clean village metadata: replace NA with '', remove any commas within quotes, add district key
	echo "CREATE TEMP TABLE villages_temp AS SELECT * FROM villages WITH NO DATA;" > data/villages_meta.sql
	sed '1d;s/,NA,/,,/;/^NA,/d' data/villages.csv | awk -F'"' -v OFS='' '{ for (i=2; i<=NF; i+=2) gsub(",", "", $$i) } 1' | awk 'BEGIN { FS=",";OFS=","; printf "COPY villages_temp FROM STDIN WITH (FORMAT CSV,HEADER '\''FALSE'\'', NULL '\'''\'');\n ";} \
		{ d_key=(tolower($$6)"-"tolower($$7)); gsub(/ +/,"-",d_key); print $$1, $$2, $$3, $$4, $$5, $$8, d_key } END {print "\\.";}' >> data/villages_meta.sql
	echo "INSERT INTO villages SELECT DISTINCT ON (villagecode) * FROM villages_temp WHERE villagecode IS NOT NULL; DROP TABLE villages_temp;" >> data/villages_meta.sql

villages: villages_import villages_index

## Create data/states.csv
data/states.csv:
	gunzip -c data/states-months/*.gz > data/states.csv

## Create data/districts.csv
data/districts.csv:
	gunzip -c data/districts/*.gz > data/districts.csv

## Create data/districts_distribution.csv
data/districts_distribution.csv:
	gunzip -c data/districts-distribution/*.gz > data/districts_distribution.csv

## Create districts_key and state_key for districts.csv
# header is 13 fields
# state (1), district (2), year (3), month (4), satellite (5), count (6), vis_mean (7)
# vis_sd (8), vis_min (9), vis_median (10), vis_max (11), state_key (12), district_key (13)
data/districts_key.csv: data/districts.csv
	cat $< | awk -F ',' 'BEGIN {} { \
	d_key=(tolower($$1)"-"tolower($$2)); \
	s_key=(tolower($$1)); \
	gsub(/ +/,"-",d_key); \
	gsub(/ +/,"-",s_key); \
	print $$0","s_key","d_key \
	}' > $@

## Create state_key for states.csv
## header is 11 fields
# state (1), year (2), month (3), satellite (4), count (5), vis_mean (6), vis_sd (7)
# vis_min (8), vis_median (9), vis_max (10), state_key (11)
data/states_key.csv: data/states.csv
	cat data/states.csv | awk -F ',' 'BEGIN {} { \
	s_key=(tolower($$1)); gsub(/ +/,"-",s_key); \
	print $$0","s_key \
	}' > data/states_key.csv

# Create states_month table
data/states_month.csv: data/states_key.csv
	awk 'BEGIN{FS=",";OFS=","} {print $$11, $$2, $$3, $$4, $$5, $$6, $$7, $$8, $$9, $$10}' $< > $@

## Cut into two tables
data/districts_month.csv: data/districts_distribution.csv data/districts_key.csv
	awk 'BEGIN{FS=",";OFS=","} {print $$13, $$3, $$4, $$5, $$6, $$7, $$8, $$9, $$10, $$11}' data/districts_key.csv > $@
	./scripts/quintiles.R

data/districts_meta.csv: data/districts_key.csv
	awk 'BEGIN{FS=",";OFS=","} {print $$13, $$2, $$12, $$1}' $< | sort | uniq > $@

## Cleanup
clean_boundaries:
	rm $(BOUNDARIES_CSVS_DEPS) $(BOUNDARIES_CSVS)

clean_rgvy: 
	rm $(RGGVY_CSVS)

clean_sample:
	rm data/dbsample.csv data/sample.csv data/sample.csvt data/sample.geojson data/sample.mbtiles

clean: clean_boundaries clean_rgvy clean_sample
