import {movieDB} from './library.js'
const {API_KEY, BASE_URL, IMAGES_URL, DISCOVER_URL} = movieDB


import {genres} from './library.js'

let page = randomPage()
console.log(page)
const header = document.querySelector('header')
const slider = document.querySelector('#slider')

function randomPage(){
    let result = 0
    
    result = Math.floor(Math.random() *50 +1)
    return result
}
getMovies(`${DISCOVER_URL}${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`);
function getMovies (url){
  fetch(url)
  .then(response => response.json())
  .then(data => {
    // LLAMADA A SHOWMOVIES
    console.log(data)
    showMovies(data.results)
  } )
  .catch(err => console.log(err));
}

function showMovies(data){
    // RESET DEL CONTENIDO CADA VEZ QUE EJECUTA

data.forEach(movie => {

  const {title, poster_path, vote_average, overview, genre_ids, id,
    release_date,backdrop_path
} = movie;
    //CREAR CARTAS  
  const slide = document.createElement('div');
  slide.classList.add('slide');
  slide.innerHTML = `  
                
    <div class="slider-info-wrapper">
        <div class="slider-info">
            <h1>${title}</h1>
            <p class="landing-runtime">${release_date} • ${getGenres(genre_ids)}</p>
            <p>${overview}</p>
            <a class="landing-button" href="./search.html">Start Exploring</a>

        </div>
    </div>
                
 
`
slide.style.background = `linear-gradient(358.93deg, #0D0C0F 0.83%, rgba(13, 12, 15, 0.85) 20.55%, rgba(4, 4, 4, 0.26) 57.53%, rgba(13, 12, 15, 0.1) 70.66%, #0D0C0F 103.18%), url(${IMAGES_URL}/original${backdrop_path}) center / cover`
// IMPRIMIR LA PELICULA CLICADA
slider.appendChild(slide);
})

}

function getGenres(genre){
    let filmGenre = ""
    for (let item of genres) {
      if(item.id == genre[0]) filmGenre = `${item.name}`
      if (item.id == genre[1]) filmGenre += `-${item.name}`
      else filmGenre += ""
      if (item.id == genre[2]) filmGenre += `-${item.name}`
      else filmGenre += ""
    } 
    return filmGenre
  }