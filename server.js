'use strict';

const express = require('express');
const app = express(); //creates a server that is an object
const cors = require('cors');

app.use( cors() );

app.use(express.static('./public'));

const PORT = process.env.PORT || 3005;



//this is a route 
//called in browser http://localhost:3000/Portfolio
//response what will show on the browser 

app.get('/location', function(request,response){
  //console.log('route portfiolio works');
  // response.send('this is the response');
  const geoData = require('./data/geo.json');
  const location = geoData.results[0].address_components[0].long_nam;
  var latitude = geoData.results[0].geometry.location.lat
  console.log(latitude);
  var longitude = geoData.results[0].geometry.location.lng


  response.send({
    "search_query": location,
    "formatted_query": "Seattle, WA, USA",
    "latitude": latitude,
    "longitude": longitude
  })

});



// app.get('/weather', function(request,response){
//   //console.log('route portfiolio works');
//   // response.send('this is the response');
  

//   response.send({
    
      
//         "forecast": "Partly cloudy until afternoon.",
//         "time": "Mon Jan 01 2001",
    
      
      
//       })
    
    
    

      

// });


app.listen(PORT, function(){
  console.log('starting!');
});


