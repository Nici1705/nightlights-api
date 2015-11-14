'use strict';
/*global before, describe, it*/

var server = require('../../');
var topojson = require('topojson');

describe('Boundaries endpoints', function () {
  var response = {};

  describe('/boundaries/states/{key}', function () {
    hitEndpoint('/boundaries/states/gujarat', response);

    it('should contain the state and its districts', function (done) {
      response.parsed.objects.should.have.property('gujarat');
      var subregions = topojson.feature(response.parsed, response.parsed.objects.subregions);
      subregions.features.forEach(function (feat) {
        feat.properties.key.should.match(/^gujarat/);
      });
      done();
    });

    it('should provide geometry and properties via topojson',
    function (done) {
      var subregions = topojson.feature(response.parsed, response.parsed.objects.subregions);
      subregions.features.forEach(function (district) {
        district.should.have.properties('geometry', 'properties');
        district.properties.should.have.properties(
          'state_key',
          'key',
          'name',
          'tot_pop'
        );
      });
      done();
    });
  });

  describe('/boundaries/states', function () {
    hitEndpoint('/boundaries/states', response);

    it('should include a GeoJSON `geometry` and metadata as `properties`',
    function (done) {
      var subregions = topojson.feature(response.parsed, response.parsed.objects.subregions);
      let states = subregions.features.map(function (feat) { return feat.properties.key; });
      states.should.containDeep([
        'andhra-pradesh',
        'jammu-&-kashmir',
        'karnataka',
        'kerala',
        'madhya-pradesh',
        'maharashtra',
        'manipur',
        'meghalaya',
        'mizoram',
        'nagaland',
        'orissa',
        'assam',
        'punjab',
        'rajasthan',
        'sikkim',
        'tripura',
        'uttar-pradesh',
        'uttarakhand',
        'west-bengal',
        'bihar',
        'chhattisgarh',
        'delhi',
        'goa',
        'gujarat',
        'haryana',
        'himachal-pradesh'
      ]);
      subregions.features.forEach(function (feat) {
        feat.should.have.properties('geometry', 'properties');
        feat.properties.should.have.properties(
          'key',
          'name',
          'tot_pop'
        );
      });
      done();
    });
  });
});

/* helpers */
function hitEndpoint (url, response) {
  before(function () {
    return server.injectThen({ method: 'GET', url: url })
    .then(function (resp) {
      response.raw = resp;
      response.parsed = JSON.parse(resp.payload);
    });
  });
}

