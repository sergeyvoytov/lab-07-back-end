'use strict';

const express = require('express');
const app = express(); //creates a server that is an object
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

app.use(cors());
app.use(express.static('./public'));
const PORT = process.env.PORT || 3000;
let newLocation;

app.get('/location', (req, res) => {
  // let query =request.query.data;

  let googleURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.data}&key=${process.env.GEOCODING_API_KEY}`
  console.log(process.env.GEOCODING_API_KEY);

  superagent.get(googleURL).then(response => {
    // console.log('body', response.body);

    const location = response.body.results[0].geometry.location;
    const formatedAddress = response.body.results[0].formatted_address;
    const searchQuery = response.body.results[0].address_components[0].long_name;

    newLocation = new Location(searchQuery, formatedAddress, location);
    res.send(newLocation);

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

// weather

app.get('/weather', (req, res) => {
  let weatherURL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${newLocation.latitude},${newLocation.longitude}`

  superagent.get(weatherURL).then(response => {

    const weatherArray = response.body.daily.data
    const weatherResponse = weatherArray.map(byDay => {
      return new Forecast(byDay.summary, byDay.time);
      console.log(weatherResponse);
    })
    res.send(weatherResponse);

  })

    .catch(error => {
      console.error('catch on weather ', error)
    })

})
// weather constructor

function Forecast(summary, time) {
  this.forecast = summary;
  this.time = (new Date(time * 1000)).toDateString();
}


//////////////



app.get('/events', (req, res) => {
  let eventURL = `http://api.eventful.com/json/events/search?location=${req.query.data.formatted_query}&app_key=${process.env.EVENT_API_KEY}`
  superagent.get(eventURL).then(res => {

    let events = JSON.parse(res.text);

    let moreEvents = events.events.event;

    let eventData = moreEvents.map(event => {

      return new Event(event)

    })

    res.send(eventData);

  })
    .catch(error => {
      console.error(error)
    })
});




function Event(event) {

  this.link = event.url;
    this.name = event.venue_name;
    this.event_date = event.start_time;
    this.description = event.description; 
}

//////////////  



app.listen(PORT, function () {
  console.log('starting!');
});


