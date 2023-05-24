import {movieDB} from './library.js'
const {api_key, base_url, images_url} = movieDB
const main = document.querySelector('main')


// console.log(`${base_url}${api_key}`)
getMovies();
function getMovies (){
  fetch('https://api.themoviedb.org/3/discover/movie?api_key=8114c981400cf1383e7886a00fb9f174&language=en-US&page=1&sort_by=popularity.desc')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    showMovies(data.results)
  } )
  .catch(err => console.log(err));
}

function showMovies(data){
  main.innerHTML = '';
  data.forEach(movie => {
    const {title, poster_path, vote_average, overview} = movie;
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie');
    movieItem.innerHTML = `
    <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

   <div class="movie-info">
       <h3>${title}</h3>
       <span class="${getColor(vote_average)}">${vote_average}</span>
   </div>

   <div class="overview">

       <h3>Overview</h3>
       ${overview}
       <br/> 
       <button class="know-more" id="${id}">Know More</button
   </div>

`
main.appendCChild(movieItem);
  })
}