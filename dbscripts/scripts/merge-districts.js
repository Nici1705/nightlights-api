#!/usr/bin/env node

// merge districts into states
// modeled after topojson-merge script, just adding a bit of custom filtering
// merge-districts.js boundaries.topojson district_obj_name state_obj_name

var fs = require('fs');
var d3 = require('d3');
var topojson = require('topojson');
var mergeProperties = require('topojson/lib/topojson/merge-properties');

var topology = JSON.parse(fs.readFileSync(process.argv[2]));

function keyFn (d) {
  return d.properties.DIST_ID === 11 ? 'NA' : d.properties.STATE_UT;
}

topology.objects[process.argv[4]] = {
  type: 'GeometryCollection',
  geometries: d3.nest()
      .key(keyFn)
      .entries(topology.objects[process.argv[3]].geometries)
      .filter(function (entry) {
        return entry.key !== 'NA';
      })
      .map(function (entry) {
        console.log(entry.key);
        var polygon = topojson.mergeArcs(topology, entry.values);
        polygon.id = keyFn(entry.values[0]);
        var properties = mergeProperties();
        entry.values.forEach(properties.merge);
        properties.apply(polygon);

        return polygon;
      })
};

topojson.prune(topology, {verbose: true});

fs.writeFileSync(process.argv[2], JSON.stringify(topology));
