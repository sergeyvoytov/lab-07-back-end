 
'use strict';

const superagent = require('superagent');

function yelp(yelpData) {
  this.name = yelpData.name;
  this.image_url = yelpData.image_url;
  this.price = yelpData.price;
  this.rating = yelpData.rating;
  this.url = yelpData.url;
}
const yelpUrl = `https://api.yelp.com/v3/businesses/search?term="restaurants"&location="${request.query.data.formatted_query}"`;

function getInfo(req, res) {


  superagent.get(yelpUrl).set('Authorization', `BEARER ${process.env.YELP_API_KEY}`).then(data => {

    const yelpJSON = JSON.parse(data.text);
    const restaurantArray = yelpJSON.businesses;
    const restaurantData = restaurantArray.map(yelpData => new yelp(yelpData));
    response.status(200).send(restaurantData);

  });
};

exports.yelp = yelp;
