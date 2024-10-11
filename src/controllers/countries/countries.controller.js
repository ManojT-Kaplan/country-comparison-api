"use strict";

const countryHelper = require("../../lib/country-helper");
const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 });

exports.getCountries = async function getCountries(req, res) {
  const cachedCountries = cache.get("countries");
  if (cachedCountries) {
    return res.json(cachedCountries); // Return from cache if available
  }
  try {
    const response = await axios.get(
      `https://d6wn6bmjj722w.population.io/1.0/countries/`
    );
    const countries = response.data.countries;
    cache.set("countries", countries);
    return res.json(countries);
  } catch (err) {
    if (cachedCountries) {
      return res.json(cachedCountries);
    }
    res.send(500, {
      message: "Server error retrieving countries.",
      error: err.message,
    });
  }
};
