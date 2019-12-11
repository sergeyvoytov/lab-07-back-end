'use strict';

const express = require('express');
const app = express(); //creates a server that is an object
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

app.use(cors());
app.use(express.static('./public'));
const PORT = process.env.PORT || 3005;
app.get('/location', (req, res) => {
  // let query =request.query.data;

  let URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.data}&key=${process.env.GEOCODING_API_KEY}`
console.log(process.env.GEOCODING_API_KEY);

  superagent.get(URL).then(response => {
    console.log('body', response.body);

    const location = response.body.results[0].geometry.location;
    const formatedAddress = response.body.results[0].formatted_address;
    const searchQuery = response.body.results[0].address_components[0].long_name;

    res.send(new Location(searchQuery, formatedAddress, location));

  })

    .catch(error => {
      console.error(error)
    })

})





// location constructor

function Location(searchQuery, formatedAddress, location) {

  this.searchQuery = searchQuery;
  this.formatted_query = formatedAddress;
  this.latitude = location['lat'];
  this.longitude = location['lng'];
}

// WEATHER PATH

app.get('/weather', (req, res) => {

  const weatherData = require('./data/darksky.json');
  const weatherArray = weatherData.daily.data
  const weatherResponse = weatherArray.map(byDay => {
    return new Forecast(byDay.summary, byDay.time);
    console.log(weatherResponse);
  })
  res.send(weatherResponse);
})

// FORECAST CONSTRUCTOR FUNCTION

function Forecast(summary, time) {
  this.forecast = summary;
  this.time = (new Date(time * 1000)).toDateString();
}


app.listen(PORT, function () {
  console.log('starting!');
});


