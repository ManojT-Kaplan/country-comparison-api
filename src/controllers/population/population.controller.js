const axios = require("axios");
const moment = require("moment");

exports.getCountriesPopulation = async (req, res) => {
  const { countries } = req.body;
  const { sortOrder } = req.query;
  const currentDate = moment().format("YYYY-MM-DD");
  try {
    // Validate input: Check if countries is an array and not empty
    if (!Array.isArray(countries) || countries.length === 0) {
      return res.send(404, { message: "No country specified" });
    }

    // Fetch population data for each country
    const populationData = await Promise.all(
      countries.map(async (country) => {
        try {
          const response = await axios.get(
            `https://d6wn6bmjj722w.population.io/1.0/population/${country}/${currentDate}/`
          );

          // Extract the population value from the response
          const population = response.data.total_population.population;

          return { country, population };
        } catch (err) {
          console.error(
            `Error fetching population for ${country}: ${err.message}`
          );
          return { country, population: null }; // Handle cases where the population API fails for a country
        }
      })
    );

    if (sortOrder === "asc") {
      populationData.sort((a, b) => a.population - b.population);
    } else if (sortOrder === "desc") {
      populationData.sort((a, b) => b.population - a.population);
    }

    // Send the response
    res.json(populationData);
  } catch (error) {
    console.error(`Error retrieving countries population: ${error.message}`);
    return res.status(500).json({
      message: "Server error retrieving countries population.",
      error: error.message,
    });
  }
};
