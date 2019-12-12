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

// function Event(event) {

//     this.link = event.url;
//     this.name = event.venue_name;
//     this.event_date = event.start_time;
//     this.description = event.description; 
// }

try {
  app.get('/events', getEvents);
  
} catch (error) {
  console.error('catch on weather ', error)

}

function getEvents(req, res) {
  console.log(req.query);
  // go to eventful, get data and get it to look like this
  superagent.get(`http://api.eventful.com/json/events/search?app_key=kcbDf9m2gZnd2bBR&keywords=sports&location=${req.query.data.formatted_query}&date=Future`).then(response => {
    // console.log(JSON.parse(response.text).events.event[0]);
    const firstEvent = JSON.parse(response.text).events.event[0];
    const allEvents = JSON.parse(response.text).events.event;

    const allData = allEvents.map(event => {
      return {
        'link': event.url,
        'name': event.title,
        'event_date': event.start_time,
        'summary': event.description
      };
    });
    console.log(allData);

    res.send(allData);

  });

}

app.listen(PORT, function () {
  console.log('starting!');
});
