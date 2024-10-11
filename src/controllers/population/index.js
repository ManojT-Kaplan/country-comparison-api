"use strict";

const controller = require("./population.controller");

function routes(app, rootUrl) {
  const fullRootUrl = rootUrl + "/v1";

  /**
   * @apiVersion 1.0.0
   * @api {post} /population Get population of specified countries
   * @apiGroup Population
   * @apiName GetCountryPopulation
   * @apiDescription Retrieve population data for the provided countries.
   *
   * @apiParam {Array} countries List of country names.
   * @apiParam {String} [sortOrder] Sort the population data by 'asc' or 'desc'.
   *
   * @apiSuccess {json} Array of countries with their population data.
   * @apiSuccessExample {json} Success-Response:
   *   HTTP/1.1 200 OK
   *   [
   *     {"country": "India", "population": 1366417754},
   *     {"country": "USA", "population": 329064917},
   *     ...
   *   ]
   *
   * @apiError (Error 400) BadRequestError Returned if invalid input is provided.
   * @apiError (Error 500) InternalServerError Returned if there's an error fetching data from the external API.
   */
  app.post(
    { url: fullRootUrl + "/population" },
    controller.getCountriesPopulation
  );
}

module.exports = {
  routes: routes,
};
