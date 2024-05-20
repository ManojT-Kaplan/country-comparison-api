const app = require('../../../src/server.js');
const config = require('../../../src/config');
const request = require('supertest');
const sinon = require('sinon');
const axios = require('axios');
require('chai').should();

const countryHelper = require('../../../src/lib/country-helper');
const mockCountries = require('../../fixtures/data/mock-countries.json');

describe('countries endpoint tests', () => {
  let sandbox;
  beforeEach(function beforeEach() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function afterEach() {
    sandbox.restore();
  });

  describe('get countries', function getCountries() {
    const endpointUrl = config.routes.controllerRootUrl + '/v1/countries';

    it('should return a list of countries', function handleGettingCountries(done) {
      sandbox.stub(countryHelper, 'getCountries').returns(mockCountries);

      request(app)
        .get(`${endpointUrl}`)
        .set('accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.body.should.be.an.array;
          res.body.should.eql(mockCountries);
          return done();
        });
    });

    it('should return empty array if no countries found', function handleNoCountriesFound(done) {
      sandbox.stub(countryHelper, 'getCountries').returns([]);

      request(app)
        .get(`${endpointUrl}`)
        .set('accept', 'application/json')
        .expect(200, [])
        .end(err => {
          if (err) {
            return done(err);
          }
          return done();
        });
    });

    it('should return 500 if error getting countries', function handleErrorGettingCountries(done) {
      const error = new Error('fake error');
      sandbox.stub(countryHelper, 'getCountries').throws(error);

      request(app)
        .get(`${endpointUrl}`)
        .set('accept', 'application/json')
        .expect(500)
        .end(err => {
          if (err) {
            return done(err);
          }
          return done();
        });
    });
  });
});

describe('getCountryPopulation endpoint tests', () => {
  let sandbox;
  beforeEach(function beforeEach() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function afterEach() {
    sandbox.restore();
  });

  describe('getCountryPopulation', function getCountryPopulation() {
    const endpointUrl = config.routes.controllerRootUrl + '/v1/getCountryPopulation';

    it('should return population data for valid countries', (done) => {
      // Stub the axios.get method to return resolved promises with mock data
      sandbox.stub(axios, 'get')
        .onFirstCall().returns(Promise.resolve({ data: { countries: mockCountries } }))
        .onSecondCall().returns(Promise.resolve({ data: { total_population: { population: 100 } } }));
      request(app)
        .get(`${endpointUrl}?countries=Cuba&date=2020-03-25`)
        .set('accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          // Assert response body and any other necessary validations
          res.body.should.be.an.array;
          // Add more assertions as needed
          return done();
        });
    });
    it('should return 400 if invalid countries are provided:', (done) => {
      sandbox.stub(axios, 'get')
        .onFirstCall().returns(Promise.resolve(({ data: { countries: mockCountries } })))
        .onSecondCall().returns(Promise.reject({ response: { status: 400, data: { error: 'Bad request' } } }));

      request(app)
        .get(`${endpointUrl}?countries=test&date=2024-03-25`)
        .set('accept', 'application/json')
        .expect(400)
        .end(err => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return 500 if error occurs while fetching population data', (done) => {
      sandbox.stub(axios, 'get')
        .returns(Promise.reject({
          response: {
            status: 500,
            data: {
              message: 'Fake error'
            }
          }
        }));

      request(app)
        .get(`${endpointUrl}?countries=test&date=2024-03-25`)
        .set('accept', 'application/json')
        .expect(500)
        .end(err => {
          if (err) return done(err);
          return done();
        });
    });

    it('should return 500 if error occurs while fetching countries', (done) => {
      sandbox.stub(axios, 'get').returns(Promise.reject(new Error('fake error')));

      request(app)
        .get(`${endpointUrl}?countries=USA&date=2024-03-25`)
        .set('accept', 'application/json')
        .expect(500)
        .end(err => {
          if (err) return done(err);
          return done();
        });
    });

  });
});

