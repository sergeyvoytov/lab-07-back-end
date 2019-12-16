'use strict';


// Creates a movie with state readable by front-end app
function Movie(movieData) {

    this.title = movieData.title;
    this.overview = movieData.overview;
    this.average_vote = movieData.vote_average;
    this.total_votes = movieData.vote_count;
    this.image_url = 'https://image.tmdb.org/t/p/w500';
    this.popularity = movieData.popularity;
    this.released_on = movieData.relase_date;
}
const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${locationMovie}&page=1&include_adult=false`;

function renderMovies(req, res) {

    const locationMovie = `${request.query.data.formatted_query}`.split(',')[0];


    superagent.get(movieUrl).then(data => {

        let movieArray = data.body.results;

        let data = movieArray.map(movieData => new Movie(movieData));

        response.send(data);
    });
}
app.get('/movies', renderMovies);
