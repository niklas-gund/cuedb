const API_KEY = "26a43d82f599e9c54e5ece77b6953144";

const ENDPOINTS = {
  single_movie: "3/movie/",
  movieSearch: "3/search/movie",
  single_person: "3/person/",
};

async function requestWithKey(endpoint: string, additionalParams = "") {
  const fullURL =
    "https://api.themoviedb.org/" +
    endpoint +
    "?api_key=" +
    API_KEY +
    additionalParams;
  const res = await fetch(fullURL);
  console.log(fullURL);
  console.log(res.url);
  const json = await res.json();
  return json;
}

const singleMovieCache = new Map<number, any>();
// clear every 3 days
setInterval(singleMovieCache.clear, 3 * 24 * 60 * 60 * 1000);

export async function getSingleMovie(tmdb_id: number) {
  const cached = singleMovieCache.get(tmdb_id);
  if (cached != undefined) {
    console.log("Using cache for single movie ", tmdb_id);
    return cached;
  } else {
    const movieInfo = await requestWithKey(ENDPOINTS.single_movie + tmdb_id);
    singleMovieCache.set(tmdb_id, movieInfo);
    return movieInfo;
  }
}

const singlePersonCache = new Map<string, any>();
// clear every 3 days
setInterval(singlePersonCache.clear, 3 * 24 * 60 * 60 * 1000);

export async function getContributorByID(tmdb_id: string) {
  const cached = singlePersonCache.get(tmdb_id);
  if (cached != undefined) {
    console.log("Using cache for single person " + tmdb_id);
    return cached;
  } else {
    const personInfo = await requestWithKey(ENDPOINTS.single_person + tmdb_id);
    singlePersonCache.set(tmdb_id, personInfo);
    return personInfo;
  }
}

export async function searchMovies(name: string) {
  return await requestWithKey(ENDPOINTS.movieSearch, "&query=" + name);
}

export async function searchPerson(name: string) {
  return await requestWithKey("3/search/person", "&query=" + name);
}
