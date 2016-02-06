'use strict';
/*global describe,it*/

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var server = require('../../');

var UPDATE = !!process.env.UPDATE;

describe('basic endpoint input/output', function () {
  glob.sync(path.join(__dirname, '..', 'fixtures', '*.request.txt'))
  .forEach(function (file) {
    var lines = fs.readFileSync(file, 'utf-8').split('\n');
    var url = lines.shift();
    var expectedStatusCode = Number(lines.shift());
    var expected = lines.join('\n');

    it(path.basename(file), function (done) {
      this.timeout(10000);

      server.injectThen({
        method: 'GET',
        url: url
      })
      .then(function (resp) {
        if (UPDATE) {
          fs.writeFileSync(file, url + '\n' +
            resp.statusCode + '\n' +
            resp.payload);
          return done();
        }
        resp.statusCode.should.eql(expectedStatusCode);
        resp.payload.trim().length.should.eql(expected.trim().length);
        var expectedData;
        try {
          expectedData = JSON.parse(expected);
        } catch (e) { }
        if (expectedData) {
          var parsed = JSON.parse(resp.payload);
          parsed.should.be.eql(expectedData);
        }
        done();
      })
      .catch(function (err) {
        return done(err);
      });
    });
  });
});
