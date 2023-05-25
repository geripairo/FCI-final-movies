import {movieDB} from './library.js'
const {API_KEY, BASE_URL, IMAGES_URL, DISCOVER_URL} = movieDB

import {genres} from './library.js'


const cardsSection = document.querySelector('#movie-cards-wrapper')
const filmDetailSection = document.querySelector('#movie-details-wrapper');
const header = document.querySelector('.header-search')
let searchBar = document.querySelector('#search-bar')

let page = 1
let filmID = 0
const discoverUrl = `${DISCOVER_URL}${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`
const searchUrl = `${BASE_URL}/search/movie${API_KEY}`

// CONSEGUIR EL DATA DE LAS PELICULAS POR POPULARIDAD
getMovies(`${DISCOVER_URL}${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`);
function getMovies (url){
  fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    showMovies(data.results)
  } )
  .catch(err => console.log(err));
}

// IMPRIMIR CARTAS DE LAS PELÍCULAS EN LA PÁGINA
function showMovies(data){
  cardsSection.innerHTML = '';
  data.forEach(movie => {
    const {title, poster_path, vote_average, overview, genre_ids, id} = movie;
    
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie');
    movieCard.innerHTML = `
    <p class="filmID">${id}</p>
    <img src="${IMAGES_URL}/w500/${poster_path}" alt="${title} movie image">
    <div class="card__overlay">
      <div class="movie-info overlay_text">
        <h3 class="movie-title">${title}</h3>        
        <span class="movie-rate ${getColors(vote_average)}">${vote_average.toFixed(1)}</span>
        <span class="movie-genre">| ${getGenres(genre_ids)}</span>
      </div>
    </div>
`
  
  cardsSection.appendChild(movieCard);
  movieCard.addEventListener('click', (e) => {
    let target = e.currentTarget;
    let focus = target.children[0].innerText
    filmID = focus;

    filmDetail(filmID)
  })
})
}

function getColors(rate){  
  if(rate <= 4){return "red-rate"}      
  if(rate > 4 && rate <= 6.5) {return "orange-rate"}
  else return "green-rate"
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

// FUNCIONES PARA PASAR DE PÁGINA
function nextPage(){
  page+=1
}

function prevPage(){
  if(page > 1){
    page-=1
  } else page+=0  
}

const nextBtn = document.querySelector('#next-btn');
const prevBtn = document.querySelector('#prev-btn');

nextBtn.addEventListener('click', () => {
  nextPage();
  getMovies(`${DISCOVER_URL}${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`);
});
prevBtn.addEventListener('click', () => {
  prevPage();
  getMovies(`${DISCOVER_URL}${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`);
});

// FILTRAR PELICULAS POR EL BUSCADOR

searchBar.addEventListener("keydown", (e) => {
  if (e.key == "Enter"){
    const searchValue = searchBar.value;
    if(searchValue){
      getMovies(`${searchUrl}&query=${searchValue}`)
    }
   }
  });

// MOSTRAR DETALLES PELÍCULA
function filmDetail(id) {
  fetch(`${BASE_URL}movie/${id}${API_KEY}&append_to_response=videos,images,genres,credits`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    const {backdrop_path} = data;
    header.classList.add('header-active')
    header.style.background = `url(${IMAGES_URL}/original${backdrop_path}) center / cover`
  } )
  .catch(err => console.log(err));  
  
  cardsSection.style.display = "none"
  filmDetailSection.style.display = "block"
  document.querySelector('.page-buttons').style.display = "none"
  
  
}
