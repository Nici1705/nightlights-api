#!/usr/bin/env node
var fs = require('fs');
var prompt = require('prompt');

var vars = [
  'VILLAGE_S3_URI',
  'NIGHTLY_S3_URI',
  'OUTPUT_S3_URI',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY'
];

var vals = {};

vars = vars.filter(function (v) {
  if (process.env[v]) {
    vals[v] = process.env[v];
    return false;
  }
  return true;
});

if (vars.length > 0) {
  prompt.start();
  prompt.get(vars, function (err, result) {
    if (err) { throw err; }
    for (var k in result) { vals[k] = result[k]; }
    done();
  });
} else {
  done();
}

function done () {
  var template = fs.readFileSync(__dirname + '/summaries.sql', {encoding: 'utf8'});
  vals.CREDENTIALS = 'aws_access_key_id=' + vals.AWS_ACCESS_KEY_ID +
      ';aws_secret_access_key=' + vals.AWS_SECRET_ACCESS_KEY;

  fs.writeFileSync('summaries.configured.sql',
    Object.keys(vals).reduce(function (s, varname) {
      var val = varname === 'OUTPUT_S3_URI' ? vals[varname] : quote(vals[varname]);
      return s.split(varname).join(val);
    }, template));
}

function quote (s) { return '\'' + s + '\''; }
