const BASE_URL = 'https://moviesapi.to';

export const fetchMovies = async (page = 1, query = '', year = '', ordering = '', limit = 20) => {
  try {
    let url = `${BASE_URL}/api/discover/movie?direction=desc&page=${page}&resultsPerPage=${limit}`;
    if (query && query.length >= 3) url += `&query=${encodeURIComponent(query)}`;
    if (year) url += `&year=${year}`;
    if (ordering) url += `&ordering=${ordering}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching movies: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('fetchMovies error:', error);
    return null;
  }
};

export const fetchTVShows = async (page = 1, query = '', ordering = '', limit = 20) => {
  try {
    let url = `${BASE_URL}/api/discover/tv?direction=desc&page=${page}&resultsPerPage=${limit}`;
    if (query && query.length >= 3) url += `&query=${encodeURIComponent(query)}`;
    if (ordering) url += `&ordering=${ordering}`;
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
