'use strict';

const controller = require('./countries.controller');

function routes(app, rootUrl) {
  // include api version number
  let fullRootUrl = rootUrl + '/v1';

  /**
    * @apiVersion 1.0.0
    * @api {get} /countries
    * @apiGroup Countries
    * @apiName Get list of all countries
    * @apiDescription Returns an array of country names
    *
    * @apiSampleRequest /api/v1/countries
    *
    * @apiSuccess {json} Array of all country names
    * @apiSuccessExample {json} Success-Response:
    *   HTTP/1.1 200 OK
    *   [
    *     "Afghanistan",
    *     "AFRICA",
    *     "Albania",
    *     ...
    *   ]
    *
    * @apiError (Error 500) InternalServerError Returned if there was a server error
    */
  app.get({ url: fullRootUrl + '/countries' },
    controller.getCountries);

  /**
  * @apiVersion 1.0.0
  * @api {get} /getCountryPopulation
  * @apiGroup Countries
  * @apiName Get population of selected countries
  * @apiDescription Returns population data for selected countries
  *
  * @apiSampleRequest /api/v1/getCountryPopulation?country=USA&date=2022-01-01&sortOrder=asc
  *
  * @apiParam (Query Params) {String[]} country Array of country names.
  * @apiParam (Query Params) {String} date Date for population data.
  * @apiParam (Query Params) {String} [sortOrder] Optional. Sort order for population data (asc or desc).
  *
  * @apiSuccess {json} Array of country population data
  * @apiSuccessExample {json} Success-Response:
  *   HTTP/1.1 200 OK
  *   [
  *     { "country": "USA", "population": 331002651 },
  *     { "country": "India", "population": 1380004385 },
  *     ...
  *   ]
  *
  * @apiError (Error 500) InternalServerError Returned if there was a server error
  */

  app.get({ url: fullRootUrl + '/getCountryPopulation' },
    controller.getCountryPopulation);
}

module.exports = {
  routes: routes
};
