var Boom = require('boom');
let knex = require('../connection');
let Readable = require('readable-stream').Readable;
let JSONStream = require('JSONStream');
let parseInterval = require('../lib/parse-interval');
let knexTime = require('../lib/knex-time');

const MAX_VILLAGES = 10000;

module.exports = [
/**
 * @api {get} /months/{interval}/villages/{village_ids} List of Villages
 * Time series for comma separated list of villages
 * @apiExample {curl} Example usage:
 *     curl -i http://api.nightlights.io/months/1993.3-1993.4/villages/104000100132900,104000200153500,108000200308200
 *
 * @apiGroup villages
 *
 * @apiSuccess {Object[]} result List of villages and properties
 * @apiSuccess {String} result.villagecode Village Identifier
 * @apiSuccess {Number} result.year Year of measurement
 * @apiSuccess {Number} result.month Month of measurement
 * @apiSuccess {String} result.satellite Satellite that took measurement
 * @apiSuccess {Number} result.count Number of measurements for this period
 * @apiSuccess {Number} result.vis_mean Mean of measurements
 * @apiSuccess {Number} result.vis_sd Stdev of measurements
 * @apiSuccess {Number} result.vis_min Minimum of measurements
 * @apiSuccess {Number} result.vis_median Median of measurements
 * @apiSuccess {Number} result.vis_max Maximum of measurements
 *
 * @apisuccessexample {json} example response
 * http/1.1 200 ok
 * [{
 *   "villagecode": "104000100132900",
 *   "year": 1993,
 *   "month": 3,
 *   "satellite": "F10",
 *   "count": 19,
 *   "vis_mean": "4.5263",
 *   "vis_sd": "4.0190",
 *   "vis_min": "0.0000",
 *   "vis_median": "4.0000",
 *   "vis_max": "14.0000"
 * }, ...
 */
  {
    method: 'GET',
    path: '/{time_units}/{interval}/villages/{village_ids}',
    handler: (req, res) => {
      var span = parseInterval(req.params);

      let village_ids = req.params.village_ids.split(',');

      knexTime(span).from('villages_month')
        .whereIn('villagecode', village_ids)
        .orderByRaw('year,month')
        .then(res)
        .catch((err) => {
          req.log(err);
          res(Boom.badImplementation());
        });
    }
  },
  {
    method: 'GET',
    path: '/districts/{district_id}/villages',
    handler: function (req, res) {
      let [year, month] = (req.query.month || '').split('.');

      if (!month || !year) {
        throw Boom.badRequest('Bad `month` parameter: ' + req.query.month);
      }
      let stream = knex('villages_month')
        .innerJoin(
            'villages',
            'villages_month.villagecode',
            'villages.villagecode')
        .leftJoin(
            'rgvy',
            'villages.villagecode',
            'rgvy.villagecode')
        .select(knex.raw(
              'villages.villagecode,' +
              'villages.name,' +
              'villages.latitude,' +
              'villages.longitude,' +
              'rgvy.energ_date,' +
              'avg(villages_month.vis_median)::dec(4,2) as vis_median,' +
              'sum(villages_month.count)::dec(4,0) as count'))
        .where('district_key', req.params.district_id)
        .where('year', year)
        .where('month', month)
        .groupBy(
            'villages.villagecode',
            'villages.name',
            'villages.latitude',
            'villages.longitude',
            'rgvy.energ_date')
        .limit(MAX_VILLAGES)
        .stream();

      req.raw.req.on('close', stream.end.bind(stream));
      stream.on('error', function (err) {
        stream.end();
        req.log('error', err.toString());
        res(Boom.badImplementation(err));
      });

      res(new Readable().wrap(stream.pipe(JSONStream.stringify())));
    }
  }
];
