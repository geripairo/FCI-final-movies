// DECONSTRUIR LA LIBRERIA PARA LAS URL
import {movieDB} from './library.js'
const {API_KEY, BASE_URL, IMAGES_URL, DISCOVER_URL} = movieDB


import {genres} from './library.js'

// VARIABLES PARA MANIPUILACIÓN DOM
const cardsSection = document.querySelector('#movie-cards-wrapper')
const filmDetailSection = document.querySelector('#movie-details-wrapper');
const header = document.querySelector('.header-search')
const nextBtn = document.querySelector('#next-btn');
const prevBtn = document.querySelector('#prev-btn');
let searchBar = document.querySelector('#search-bar')
const backBtn = document.querySelector('#back-button')


// VARIABLES DE CAMBIO DE ESTADO
let page = 1
let filmID = 0
let videosArr = []
let actorsArr = [];
let genresArr = []
let genresStr= ""



const discoverUrl = `${DISCOVER_URL}${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`
const searchUrl = `${BASE_URL}/search/movie${API_KEY}`

// CONSEGUIR EL DATA DE LAS PELICULAS POR POPULARIDAD
getMovies(`${DISCOVER_URL}${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`);
function getMovies (url){
  fetch(url)
  .then(response => response.json())
  .then(data => {
    // LLAMADA A SHOWMOVIES
    showMovies(data.results)
  } )
  .catch(err => console.log(err));
}

// IMPRIMIR CARTAS DE LAS PELÍCULAS EN LA PÁGINA
function showMovies(data){
      // RESET DEL CONTENIDO CADA VEZ QUE EJECUTA
  cardsSection.innerHTML = '';
  data.forEach(movie => {

    const {title, poster_path, vote_average, overview, genre_ids, id} = movie;
      //CREAR CARTAS  
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

      // IMPRIMIR LA PELICULA CLICADA
  movieCard.addEventListener('click', (e) => {
    let target = e.currentTarget;
    let focus = target.children[0].innerText
    filmID = focus;
    document.documentElement.scrollTop = 0;
    filmDetail(filmID)
  })
})
}

// FUNCIONES PARA ESTABLECER EL COLOR DE VOTO Y EL GÉNERO DE LA PELÍCULA
// SE UTILIZAN COMO VALOR
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


// FUNCIONES PARA PASAR DE PÁGINA E IMPRIMIR +20 PELÍCULAS
function nextPage(){
  page+=1
}

function prevPage(){
  if(page > 1){
    page-=1
  } else page+=0  
}


// EVENTO PASAR PÁGINA A LOS BOTONES

nextBtn.addEventListener('click', () => {
  nextPage();
  getMovies(`${DISCOVER_URL}${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`);
  document.documentElement.scrollTop = 0;

});
prevBtn.addEventListener('click', () => {
  prevPage();
  getMovies(`${DISCOVER_URL}${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`);
  document.documentElement.scrollTop = 0;

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

// RECOGER DETALLES DE LA PELÍCULA
function filmDetail(id) {
  fetch(`${BASE_URL}movie/${id}${API_KEY}&append_to_response=videos,images,genres,credits`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    showFilmDetails(data)    
  })
  .catch(err => console.log(err)); 
  backBtn.style.display = "block"
}

// IMPRIMIR DETALLES PELÍCULA
function showFilmDetails(data){
  filmDetailSection.innerHTML = ``;
  const {backdrop_path, credits, title, genres, images, original_language, overview,
      original_title, release_date, runtime, tagline, videos, vote_average, vote_count} = data;
  


      // ARRAY DE ACTORES
  actorsArr = []
  for(let i = 0; i < credits.cast.length; i++){
    actorsArr.push(credits.cast[i]);    
   }

      // ARRAY DE VIDEOS
      videosArr = []
      for (let i = 0; i < videos.results.length; i++){
        videosArr.push(videos.results[i])        
      }
      
      // ARRAY DE GÉNEROS
      genresArr = []
      genresStr = []
      for (let i = 0; i < genres.length; i++){
        genresArr.push(genres[i])                
      }
      genresStr = genresArr[0].id
      for (let i = 1; i < genresArr.length; i++){
        genresStr += `,${genresArr[i].id}`
      }
      console.log(genresStr);

      // MOSTRAR TITULO Y RESEÑA EN EL HEADER
      const heroContainer = document.createElement('div');
      heroContainer.innerHTML = ``
      heroContainer.classList.add('hero-wrapper');
      heroContainer.innerHTML = `
      <div id="hero-info">
                <h2 id="hero-title"></h2>
                <p id="movie-details"></p>
                <p id="movie-overview"></p>
       </div>    
      `     
      header.appendChild(heroContainer);
      document.querySelector('#hero-title').innerText = `${title}`
      if(genresArr.length < 2){
        document.querySelector('#movie-details').innerText = `${runtime}m • ${release_date} • ${genresArr[0].name}`
      } else if (genresArr.length < 3) {
        document.querySelector('#movie-details').innerText = `${runtime}m • ${release_date} • ${genresArr[0].name} • ${genresArr[1].name}`
      } else {
        document.querySelector('#movie-details').innerText = `${runtime}m • ${release_date} • ${genresArr[0].name} • ${genresArr[1].name} • ${genresArr[2].name}`
      }
      document.querySelector('#movie-overview').innerText = `${overview}`
   
      
      // CREAR DATA PARA LOS DETALLES DE LA PELÍCULA
  const filmDetail = document.createElement('div');
  filmDetail.classList.add('film-detail-wrapper');

  filmDetail.innerHTML = `
  <div class="actors-wrap">
    <p>Top Cast</p>
    <div class="actors"></div>
  </div>
  <div id="trailer "class="trailer"></div>
  <div class="videos-wrapper"><div class="videos"></div></div>
  <div class="similar-movies-wrapper"><div class="similar-movies"></div></div>


  `
      // AÑADIR ELEMENTO A LA SECCIÓN
  filmDetailSection.appendChild(filmDetail);
      

      // MOSTRAR ROSTROS ACTORES
   for(let actor of actorsArr){
    if(actor.profile_path != null){
      document.querySelector('.actors').innerHTML += `
      <div class="actor-container">
        <div class="img-cropper">
          <img src="${IMAGES_URL}/original${actor.profile_path}" alt="${actor.name} pic">
        </div>
        <div class="actor-name-wrapper">
          <p class="actor-name">${actor.name}</p>
          <p class="character">${actor.character}</p>
        </div>
      </div>`
    }
  }

      //MOSTRAR TRAILER Y VIDEOS
     /*  if (videosArr.length > 10){
        for (let i = 0; i < 10; i++){
          document.querySelector('.videos').innerHTML += `
             <iframe src="https://www.youtube.com/embed/${videosArr[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>           `
        }
    } else {
        for (let i = 0; i < videosArr.length; i++){
          document.querySelector('.videos').innerHTML += `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${videosArr[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
           `
        }
      }
       */

      // MOSTRAR SIMILAR MOVIES
      /* fetch(`${DISCOVER_URL}${API_KEY}&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genresStr}`)
      .then(responseGenres => responseGenres.json())
      .then(genresData => {
        
        const genresMovies = []
        for (let movie of genresData.results){
          genresMovies.push(movie)
          if(movie.title !== title)
          console.log(movie.id)
          document.querySelector('.similar-movies').innerHTML += `
          <div class="similar-movie">
            <p class="filmID">${movie.id}</p>
            <img src="${IMAGES_URL}/w400/${movie.backdrop_path}" alt="${movie.title} movie image">
          </div>          
          `
          const similarItemArr = document.querySelectorAll('.similar-movie')
          similarItemArr.forEach(item => {
            item.addEventListener('click', (e) => {
              showRecomended(e);
            } )
          })
          
        }
      }) */

      // GESTIÓN CAMBIOS DE ESTADO Y DISPLAYS
      header.classList.add('header-active')
      header.style.background = `linear-gradient(358.93deg, #0D0C0F 0.83%, rgba(13, 12, 15, 0.85) 20.55%, rgba(4, 4, 4, 0.26) 57.53%, rgba(13, 12, 15, 0.1) 70.66%, #0D0C0F 103.18%), url(${IMAGES_URL}/original${backdrop_path}) center / cover`
      cardsSection.style.display = "none"
      filmDetailSection.style.display = "block"
      document.querySelector('.page-buttons').style.display = "none"  
      document.querySelector('.hero-wrapper').style.display = "flex"

}

// MOSTRAR DETALLES DE UNA PELÍCULA RECOMENDADA
function showRecomended(e){
              let target = e.currentTarget;
              let focus = target.children[0].innerText
              console.log(focus)
              filmID = focus;
              document.documentElement.scrollTop = 0;
              filmDetail(filmID)
}

      // BOTÓN PARA VOLVER ATRÁS Y GESTIONAR ESTADOS DISPLAY
function closeDetails(){
    filmDetailSection.innerHTML = ``;
      header.classList.remove('header-active')
      header.style.background = ``
      cardsSection.style.display = "flex"
      filmDetailSection.style.display = "none"
      document.querySelector('.page-buttons').style.display = "flex"
      backBtn.style.display = "none"
      document.querySelector('.hero-wrapper').style.display = "none"
      document.documentElement.scrollTop = 0;
      

}
backBtn.addEventListener('click', closeDetails)



/* if (videosArr[i].name === "Official Trailer"){
            document.querySelector('.trailer').innerHTML = `
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${videosArr[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
              `
          } 
          if(videosArr[i].name === "Official Trailer (Red Band)"){
            document.querySelector('.trailer').innerHTML = `
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${videosArr[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
              `
          }
          if (videosArr[i].name === "Official Teaser Trailer"){
            document.querySelector('.trailer').innerHTML = `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${videosArr[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            `
          }
          if(videosArr[i].name === "Teaser"){
            document.querySelector('.trailer').innerHTML = `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${videosArr[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            `
          } */




           /*  if (videosArr[i].name === "Official Trailer"){
          document.querySelector('.trailer').innerHTML = `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${videosArr[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            `
        } 
        if(videosArr[i].name === "Official Trailer (Red Band)"){
          document.querySelector('.trailer').innerHTML = `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${videosArr[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            `
        } 
        if (videosArr[i].name === "Official Teaser Trailer"){
          document.querySelector('.trailer').innerHTML = `
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${videosArr[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          `
        } 
        if(videosArr[i].name === "Teaser"){
          document.querySelector('.trailer').innerHTML = `
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${videosArr[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          `
        } */