const BASE_URL = 'https://moviesapi.to';

export const fetchMovies = async (page = 1, query = '', year = '') => {
  try {
    let url = `${BASE_URL}/api/discover/movie?direction=desc&page=${page}`;
    
    // Add searching functionalities if provided
    if (query && query.length >= 3) {
      url += `&query=${encodeURIComponent(query)}`;
    }
    if (year) {
      url += `&year=${year}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching movies: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchMovies error:", error);
    return null;
  }
};

export const fetchMovieById = async (id) => {
  try {
    // According to docs, the endpoint is /movie/$id
    // But typically this might return HTML or maybe JSON depending on headers? 
    // Wait, the docs say https://moviesapi.club/movie/385687. Maybe the API returns JSON if we call /api/movie/$id or we just fetch it? 
    // I'll fetch `/movie/${id}` and see if it's JSON capable.
    const url = `${BASE_URL}/movie/${id}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching movie details: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchMovieById error:", error);
    return null;
  }
};
