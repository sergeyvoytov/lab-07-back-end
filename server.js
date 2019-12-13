'use strict';

//DEPENDENCIES
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const cors = require('cors');
const superagent = require('superagent');
app.use(cors());
require('dotenv').config();
const pg = require('pg');

// GLOBAL VARIABLES
let error = {
  status: 500,
  responseText: 'Sorry, something went wrong',
}

const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const EVENT_API_KEY = process.env.EVENT_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
let locationSubmitted;
let query;

const client = new pg.Client(DATABASE_URL);
client.on('error', error => console.error(error));
client.connect();


// LOCATION PATH
function getLocationData(request, response) {
  query = request.query.data;
  const sql = 'SELECT * FROM location WHERE search_query = $1';
  client.query(sql, [query]).then(sqlResponse => {
    if (sqlResponse.rowCount > 0) {
      response.send(sqlResponse.rows[0]);
    } else {
      createDataFromAPI(request, response, query);
    }
  });
}

function createDataFromAPI(request, response, query) {


  superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${GEOCODE_API_KEY}`).then(geoResponse => {
    const location = geoResponse.body.results[0].geometry.location;
    const formAddr = geoResponse.body.results[0].formatted_address;
    locationSubmitted = new Geolocation(query, formAddr, location);
    const sqlValue = [locationSubmitted.search_query, locationSubmitted.formatted_query, locationSubmitted.latitude, locationSubmitted.longitude];
    const SQL = `INSERT INTO location(
      search_query, formatted_query, latitude, longitude
      ) VALUES (
        $1, $2, $3, $4
        )`;
    client.query(SQL, sqlValue);
    
    response.send(locationSubmitted);
  })
}


// LOCATION CONSTRUCTOR FUNCTION
function Geolocation(searchquery, formAddr, location) {
  this.searchquery = searchquery;
  this.formatted_query = formAddr;
  this.latitude = location.lat;
  this.longitude = location.lng;
}

// WEATHER PATH
function getWeatherData(request, response) {
  superagent.get(`https://api.darksky.net/forecast/${WEATHER_API_KEY}/${locationSubmitted.latitude},${locationSubmitted.longitude}`).then(res => {
    const weatherArr = res.body.daily.data
    const reply = weatherArr.map(byDay => {
      return new Forecast(byDay.summary, byDay.time);
    })
    response.send(reply);
  })
}


// FORECAST CONSTRUCTOR FUNCTION
function Forecast(summary, time) {
  this.forecast = summary;
  this.time = (new Date(time * 1000)).toDateString();
}

// EVENTS PATH

function getEventData(request, response) {

  superagent.get(`http://api.eventful.com/json/events/search?where=${locationSubmitted.latitude},${locationSubmitted.longitude}&within=25&app_key=${EVENT_API_KEY}`).then(res => {
    let events = JSON.parse(res.text);
    let moreEvents = events.events.event
    let eventData = moreEvents.map(event => {
      return new Event(event.url, event.title, event.start_time, event.description);
    })
    response.send(eventData);
  }).catch(error => {
    console.error('catch on events ', error)
  })
};



// EVENTS CONSTRUCTOR FUNCTION
function Event(link, name, event_date, summary = 'none') {
  this.link = link,
    this.name = name,
    this.event_date = event_date,
    this.summary = summary
}


// LOCATION
app.get('/location', getLocationData);

// WEATHER
app.get('/weather', getWeatherData);

//EVENT
app.get('/events', getEventData);



// LISTEN
app.listen(PORT, () => {
  console.log(`App is on PORT: ${PORT}`);
});

