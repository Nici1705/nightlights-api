var Boom = require('boom');
var knex = require('../connection.js');

let parseInterval = require('../lib/parse-interval');
let knexTime = require('../lib/knex-time');

const dataKeys = ['key', 'year', 'month', 'satellite', 'count', 'vis_median'];

/**
 * @apiDefine TimeInterval
 * @apiParam {String} interval Time span, in the form `'yyyy.mm-yyyy.mm'`
 */

/**
 * @apiDefine TimeSeriesResponse
 * @apiSuccess {Object[]} result  Time series data
 * @apiSuccess {String} result.key Identifier of geographical area
 * @apiSuccess {Number} result.year Year of measurement
 * @apiSuccess {Number} result.month Month of measurement
 * @apiSuccess {String} result.satellite Satellite that took measurement
 * @apiSuccess {Number} result.count Number of measurements in this month
 * @apiSuccess {Number} result.vis_median Average median of measurements for this month
 */

module.exports = [
/**
 * @api {get} /months/{interval}/states All States
 * Time series for all states in the nation.
 * @apiExample {curl} Example usage:
 *     curl -i http://api.nightlights.io/months/1993.3-1993.4/states
 *
 * @apiGroup states
 *
 * @apiUse TimeInterval
 * @apiUse TimeSeriesResponse
 *
 * @apisuccessexample {json} example response
 * http/1.1 200 ok
 * [{
 *   "key": "gujarat",
 *   "year": 1993,
 *   "month": 4,
 *   "satellite": "f10",
 *   "count": 394799,
 *   "vis_median": "5.0000"
 * }, ...
 */
{
  method: 'GET',
  path: '/{time_units}/{interval}/states',
  handler: function allStates (req, res) {
    var span = parseInterval(req.params);

    let kt = knexTime(span);

    kt.select.apply(kt, dataKeys).from('states_month')
      .orderByRaw('year,month')
      .then(res)
      .catch((err) => {
        req.log(err);
        res(Boom.badImplementation());
      });
  }
},

/**
 * @api {get} /months/{interval}/states/{state_id} Single State
 * Time series for the given state.
 * @apiExample {curl} Example usage:
 *     curl -i http://api.nightlights.io/months/1993.3-1993.4/states/gujarat
 *
 * @apiGroup states
 *
 * @apiUse TimeInterval
 * @apiParam {String} state_id State id.
 * @apiUse TimeSeriesResponse
 *
 * @apisuccessexample {json} example response
 * http/1.1 200 ok
 * [{
 *   "key": "gujarat",
 *   "year": 1993,
 *   "month": 4,
 *   "satellite": "f10",
 *   "count": 394799,
 *   "vis_median": "5.0000"
 * }, ...
 */
{
  method: 'GET',
  path: '/{time_units}/{interval}/states/{state_id}',
  handler: function (req, res) {
    var span = parseInterval(req.params);

    let kt = knexTime(span);

    kt.select.apply(kt, dataKeys).from('states_month')
      .where('key', req.params.state_id)
      .orderByRaw('year,month')
      .then(res)
      .catch((err) => {
        req.log(err);
        res(Boom.badImplementation());
      });
  }
},

/**
 * @api {get} /months/{interval}/states/{state_id}/districts All Districts
 * Time series for all districts in a state
 * @apiExample {curl} Example usage:
 *     curl -i http://api.nightlights.io/months/1993.3-1993.4/states/gujarat/districts
 *
 * @apiGroup districts
 *
 * @apiUse TimeInterval
 * @apiParam {String} state_id State id.
 * @apiUse TimeSeriesResponse
 * @apiSuccess result.quintile1-4 Quintile values for the median
 * @apisuccessexample {json} example response
 * http/1.1 200 ok
 * [{
 *   "key": "gujarat-anand",
 *   "year": 1993,
 *   "month": 4,
 *   "satellite": "f10",
 *   "count": 7529,
 *   "vis_median": "6.0000"
 * }, ...
 */
{
  method: 'GET',
  path: '/{time_units}/{interval}/states/{state_id}/districts',
  handler: function (req, res) {
    var span = parseInterval(req.params);
    // Get districts for subquery
    let districts = knex.select('district_key')
                    .from('districts')
                    .where('state_key', req.params.state_id);

    // Get district data
    var kt = knexTime(span);
    kt = kt.select.apply(kt, dataKeys).from('districts_month')
      .join('districts', 'districts.district_key', 'districts_month.key')
      .where('key', 'in', districts)
      .orderByRaw('year,month');

    kt.then(res)
      .catch((err) => {
        req.log(err);
        res(Boom.badImplementation());
      });
  }
},

/**
 * @api {get} /months/{interval}/districts/{district_id} Single District
 * Time series for a single district
 * @apiExample {curl} Example usage:
 *     curl -i http://api.nightlights.io/months/1993.3-1993.4/districts/gujarat-anand
 * @apiGroup districts
 *
 * @apiUse TimeInterval
 * @apiParam {String} district_id  District id (16 digit): state + district + village codes from 2001 census.
 * @apiSuccess {Object[]} result  Time series data
 * @apiSuccess {String} result.key Identifier of geographical area
 * @apiSuccess {Number} result.year Year of measurement
 * @apiSuccess {Number} result.month Month of measurement
 * @apiSuccess {String} result.satellite Satellite that took measurement
 * @apiSuccess {Number} result.count Number of measurements in this month
 * @apiSuccess {Number} result.vis_median Average median of measurements for this month
 * @apiSuccess {Number} result.quintile1-4 Quintile of measurements for this month
 *
 * @apiSuccessExample {json} Example Response
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "key": "gujarat-anand",
 *     "year": 1993,
 *     "month": 4,
 *     "satellite": "F10",
 *     "count": 7529,
 *     "vis_median": "6.0000",
 *     "quintile1": "4.0000",
 *     "quintile2": "5.0000",
 *     "quintile3": "7.0000",
 *     "quintile4": "9.0000"
 *   }, ...
 */
{
  method: 'GET',
  path: '/{time_units}/{interval}/districts/{district_id}',
  handler: function (req, res) {
    var span = parseInterval(req.params);
    let keys = dataKeys
      .concat(['quintile1', 'quintile2', 'quintile3', 'quintile4']);

    var kt = knexTime(span);
    kt = kt.select.apply(kt, keys).from('districts_month')
      .join('districts', 'districts.district_key', 'districts_month.key')
      .where('key', req.params.district_id)
      .orderByRaw('year,month')
      .then(res)
      .catch((err) => {
        req.log('error', err);
        res(Boom.badImplementation());
      });
  }
}];
