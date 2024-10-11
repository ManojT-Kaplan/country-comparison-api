<img src="atom.png"  width="200" height="60">

## Country Comparison API

### What is this?

The Country Comparison API will use data from a 3rd party provider, [api.population.io](http://api.population.io)<sup>[1](#footnote1)</sup>, to provide comparisons on population statistics. Your colleague Joe Coder started the implementation (in Node.js v10 using restify), and now it's your turn to bring it to the next level.

Our current stack is primarily built in Node.js, Golang, and .NET. Since this service is just getting off the ground, if you'd rather implement this in a different language, feel free to do so.

### Setup

1. Download the repo
2. Run `npm install` to install dependencies
3. Run `npm test` to run unit tests
4. Set your NODE_ENV to `dev`
5. Run `npm start` to start the server

### Requirements

Joe created one endpoint that retrieves a list of country names, using mock data.

1. Update the endpoint to pull country data from http://api.population.io/1.0/countries.
2. The endpoint http://api.population.io/1.0/population/:country/:date returns the total population for a given country on a given date. Design and implement an endpoint in our API that will allow a consumer to specify an arbitrary set of countries and an optional sort order, and receive back a list of countries and their population based on the current date. If a sort order was specified, return the list sorted on population size, according to the consumer's requested sort order.

Try to be consistent with Joe's implementation in terms of:

- unit tests
- documentation
- error handling
- response codes
- validation
- etc.

Zip your solution, upload it somewhere, and send us a link to the zipped file.

### Bonus

1. Some scenarios to consider (leave your thoughts inline in your code or edit the README):

- How efficient is your code? What are some ways that you could improve performance?
  Currently, the code fetches data for each country from the third-party API in parallel using Promise.all. This is reasonably efficient as each country's population data is fetched concurrently, minimizing wait time.

- Suppose we expect this API to be hit 1000s of times a second. How can we handle the load?

1. By using load balancer
2. By using caching
3. By using services like (Aws lambda, Kuberentes)

- What if the 3rd party provider is not available? How resilient is our API?
  your API is resilient to short-term outages from the 3rd party provider by leveraging caching. However, if both the cache is stale/empty and the provider is down, your API will return an error, which is something that can be further improved with more advanced techniques like persistent caching or retry mechanisms.

- What if the requirement for the new endpoint was to also allow the consumer to compare populations for any given date. How would you modify your implementation?
  Update the Endpoint: Accept an optional date parameter in the request (in req.query or req.body).

- What if we have a database of users and we wanted to make our API smarter by defaulting comparisons to always include the population of the current user's country. How could we accomplish this?
  To default comparisons to include the current user's country, modify the API to retrieve the user's country from the database and add it to the list of countries for population comparison if it’s not already included. This ensures that the user's country is always included in the API response, making it more relevant and personalized.

- What if we wanted to keep a tally of the most frequently requested countries and have this be available to consumers. How could we accomplish this?
  To keep a tally of the most frequently requested countries, implement a counter that increments each time a country is requested in your API, storing the data in a database or in-memory store like Redis. we can then create a dedicated endpoint to expose this tally, allowing consumers to access the most frequently requested countries.

2. Dockerize the API

I have dockerized the project using Dockerfile

<br>
<i><a name="footnote1"><sup>1</sup></a> Joe says that api.population.io is down, so try https://d6wn6bmjj722w.population.io/ as the host instead.<i>
