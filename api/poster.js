export default async function handler(request, response) {
  const { i } = request.query;
  const apiKey = process.env.OMDB_API_KEY || process.env.VITE_OMDB_API_KEY;

  if (!i) {
    return response.status(400).json({ error: 'Missing IMDB ID' });
  }

  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${i}&apikey=${apiKey}`);
    const data = await res.json();
    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({ error: 'Failed to fetch poster' });
  }
}
