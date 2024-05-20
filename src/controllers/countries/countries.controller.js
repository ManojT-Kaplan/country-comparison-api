'use strict';

const co = require('co');
const errors = require('restify-errors');
const countryHelper = require('../../lib/country-helper');
const axios = require('axios');

exports.getCountries = co.wrap(function* getCountries(req, res, next) {
  try {
    const countries = countryHelper.getCountries();
    res.json(countries);
    return next();
  } catch (err) {
    return next(new errors.InternalServerError(err, 'Server error retrieving countries.'));
  }
});

exports.getCountryPopulation = function (req, res, next) {
  // Get the list of countries from the Population.io API
  axios.get('https://d6wn6bmjj722w.population.io/1.0/countries')
    .then(countriesResponse => {
      const validCountries = countriesResponse.data.countries;

      // Extract the list of countries from the query parameters
      const countries = req.query.countries ? req.query.countries.split(',') : [];

      // Check if all provided countries are valid
      const invalidCountries = countries.filter(country => !validCountries.includes(country));
      if (invalidCountries.length > 0) {
        const errorMessage = `Invalid country/countries: ${invalidCountries.join(', ')}`;
        console.error(errorMessage);
        return next(new errors.BadRequestError(errorMessage));
      }
      const populationData = [];

      // Fetch population data for each selected country from the Population.io API
      const promises = countries.map(country => {
        return axios.get(`https://d6wn6bmjj722w.population.io/1.0/population/${country}/${req.query.date}`)
          .then(populationResponse => {
            const population = populationResponse.data.total_population.population;
            populationData.push({ country, population });
          })
          .catch(error => {
            // Handle errors from individual population requests
            console.error(`Error fetching population data for ${country}:`, error.message);
          });
      });
      Promise.all(promises)
        .then(() => {
          // Sort the population data based on the requested sort order (if provided)
          if (req.query.sortOrder) {
            populationData.sort((a, b) => {
              if (req.query.sortOrder === 'asc') {
                return a.population - b.population;
              } else {
                return b.population - a.population;
              }
            });
          }
          res.json(populationData);
          return next();
        })
        .catch(error => {
          console.error('Error fetching population data:', error.message);
          return next(new errors.InternalServerError('Error fetching population data.'));
        });
    })
    .catch(error => {
      console.error('Error fetching countries:', error.message);
      return next(new errors.InternalServerError('Error fetching countries.'));
    });
};

