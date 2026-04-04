const BASE_URL = 'https://moviesapi.to';

export const fetchMovies = async (page = 1, query = '', year = '') => {
  try {
    let url = `${BASE_URL}/api/discover/movie?direction=desc&page=${page}`;
    if (query && query.length >= 3) url += `&query=${encodeURIComponent(query)}`;
    if (year) url += `&year=${year}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching movies: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('fetchMovies error:', error);
    return null;
  }
};

export const fetchTVShows = async (page = 1, query = '') => {
  try {
    let url = `${BASE_URL}/api/discover/tv?direction=desc&page=${page}`;
    if (query && query.length >= 3) url += `&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching TV shows: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('fetchTVShows error:', error);
    return null;
  }
};

export const fetchMovieById = async (id) => {
  try {
    const url = `${BASE_URL}/movie/${id}`;
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) throw new Error(`Error fetching movie details: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('fetchMovieById error:', error);
    return null;
  }
};
