let Boom = require('boom');
let knex = require('../connection');

module.exports = [
/**
 * @api {get} /districts List of all the districts with display name and id
 * @apiExample {curl} Example usage:
 *    curl -i http://api.nightlights.io/districts
 *
 * @apiGroup regions
 */
{
  method: 'GET',
  path: '/districts',
  handler: function regions (req, res) {
    knex('districts').select('*')
      .then(regions => res({regions}))
      .catch((err) => {
        req.log(err);
        res(Boom.badImplementation());
      });
  }
}
];
