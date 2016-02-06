#!/usr/bin/env node

// Writes disputed-boundaries.geojson, line-of-control.geojson, and india-boundary.geojson
// to the given output directory.
// Usage: borders.js boundaries.topojson districts_object_name regions.topojson regions_object_name path/to/output

var fs = require('fs');
var path = require('path');
var topojson = require('topojson');

var districts_topo = JSON.parse(fs.readFileSync(process.argv[2]));
var districts = districts_topo.objects[process.argv[3]];
var regions_topo = JSON.parse(fs.readFileSync(process.argv[4]));
var regions = regions_topo.objects[process.argv[5]];

var output = process.argv[6];

/*
 * Disputed Boundaries
 */

var disputed = {
  type: 'FeatureCollection',
  features: []
};
// Jammu & Kashmir internal disputed boundary
var jnk = /Jammu & Kashmir/;
disputed.features.push(topojson.mesh(districts_topo, districts, function (a, b) {
  if (a === b) return false;
  a = a.properties;
  b = b.properties;
  if (jnk.test(a.STATE_UT) || jnk.test(b.STATE_UT)) { return a.STATE_UT !== b.STATE_UT; }
}));

disputed.features.push(topojson.mesh(regions_topo, regions, function (a, b) {
  a = a.properties;
  b = b.properties;
  var r;
  if (a.Name === 'Arunachal Pradesh') { r = b; } else if (b.Name === 'Arunachal Pradesh') { r = a; }
  else return false;
  return r.Name === 'China' || r.Name === 'India';
}));

disputed.features = disputed.features.map(function (g) {
  return {
    type: 'Feature',
    properties: {},
    geometry: g
  };
});

var aksai = regions.geometries.filter(function (f) {
  return f.properties.Name === 'Aksai Chin';
})[0];

disputed.features.push(topojson.feature(regions_topo, aksai));

fs.writeFileSync(path.join(output, 'disputed-boundaries.geojson'), JSON.stringify(disputed));

/*
 * Line of Control
 */
var loc = topojson.mesh(districts_topo, districts, function (a, b) {
  return a !== b && (a.properties.DIST_ID === 11 || b.properties.DIST_ID === 11);
});

loc = {
  type: 'Feature',
  properties: {},
  geometry: loc
};

loc = {
  type: 'FeatureCollection',
  features: [loc]
};

fs.writeFileSync(path.join(output, 'line-of-control.geojson'), JSON.stringify(loc));

