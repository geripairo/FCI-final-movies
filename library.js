export const movieDB = {
    API_KEY: "?api_key=8114c981400cf1383e7886a00fb9f174",
    BASE_URL: "http://api.themoviedb.org/3/",
    IMAGES_URL: "http://image.tmdb.org/t/p/",
    timeout: 5000,
    language: "en-US",
}
            // Buscar pelicula con search
// https://api.themoviedb.org/3/search/movie?api_key=8114c981400cf1383e7886a00fb9f174&query=Jack+Reacher
            // buscar los detalles de esa pelicula con su ID
// https://api.themoviedb.org/3/movie/343611?api_key=8114c981400cf1383e7886a00fb9f174
            // Buscar con videos y imágenes
// https://api.themoviedb.org/3/movie/343611?api_key=8114c981400cf1383e7886a00fb9f174&append_to_response=videos,images,genres

/* MOVIE
Action          28
Adventure       12
Animation       16
Comedy          35
Crime           80
Documentary     99
Drama           18
Family          10751
Fantasy         14
History         36
Horror          27
Music           10402
Mystery         9648
Romance         10749
Science Fiction 878
TV Movie        10770
Thriller        53
War             10752
Western         37



TV SHOW
Action & Adventure  10759
Animation           16
Comedy              35
Crime               80
Documentary         99
Drama               18
Family              10751
Kids                10762
Mystery             9648
News                10763
Reality             10764
Sci-Fi & Fantasy    10765
Soap                10766
Talk                10767
War & Politics      10768
Western             37 */