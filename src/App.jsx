import { useState, useEffect } from 'react';
import { Film, Search, Star, PlayCircle, Loader, Trophy, ExternalLink, AlertTriangle } from 'lucide-react';
import { fetchMovies } from './services/api';
import './index.css';

// MovieCard Component
const MovieCard = ({ movie, onWatch }) => {
  const { orig_title, year, quality } = movie;

  // Generate a random gradient based on title length for placeholder
  const gradients = [
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  ];
  const gradient = gradients[(orig_title.length || 0) % gradients.length];

  return (
    <div className="movie-card glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div
        className="poster-placeholder"
        style={{
          height: '240px',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Film size={48} color="rgba(255,255,255,0.4)" />
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
          {quality || 'HD'}
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', flexGrow: 1 }}>{orig_title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <Star size={16} color="#f6d365" /> {year || 'N/A'}
          </span>
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => onWatch(movie)}
        >
          <PlayCircle size={18} /> Watch Now
        </button>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showIframe, setShowIframe] = useState(false);

  const loadMovies = async (searchQuery = '') => {
    setLoading(true);
    const result = await fetchMovies(1, searchQuery);
    if (result && result.data) {
      setMovies(result.data);
    } else {
      setMovies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadMovies(query);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadMovies(query);
  };

  return (
    <div className="app">
      {/* Navbar segment */}
      <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Film color="var(--accent-color)" size={28} />
            <h1 className="text-gradient" style={{ fontSize: '1.5rem', margin: 0 }}>Timepass</h1>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '0.25rem 1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', padding: '0.5rem', width: '200px' }}
            />
            <button type="submit" style={{ color: 'var(--text-secondary)' }}>
              <Search size={18} />
            </button>
          </form>
        </div>
      </nav>

      <main className="container" style={{ padding: '2rem 1.5rem' }}>
        {selectedMovie ? (
          <div className="animate-fade-in glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <button
              onClick={() => { setSelectedMovie(null); setShowIframe(false); }}
              style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: 'block' }}
            >
              &larr; Back to movies
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2>{selectedMovie.orig_title} ({selectedMovie.year})</h2>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem 1rem', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} />
                <strong>Caution:</strong> Use Brave browser or an adblocker to restrict popups
              </div>
              {!showIframe ? (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    className="btn-primary" 
                    onClick={() => setShowIframe(true)}
                  >
                    <PlayCircle size={18} /> Play Here (Embedded)
                  </button>
                  <a 
                    href={`https://moviesapi.to/movie/${selectedMovie.imdb_id || selectedMovie.tmdbid}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', textDecoration: 'none' }}
                  >
                    <ExternalLink size={18} /> Open in New Tab
                  </a>
                </div>
              ) : (
                <div style={{ aspectRatio: '16/9', width: '100%', background: '#000', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                  <iframe
                    src={`https://moviesapi.to/movie/${selectedMovie.imdb_id || selectedMovie.tmdbid}`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                    title="Player"
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <section style={{ marginBottom: '3rem', textAlign: 'center', padding: '3rem 0' }}>
              <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Discover Infinite Stories</h1>
              <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                Explore a massive collection of movies. Beautiful design, infinite entertainment. Experience the magic of cinema.
              </p>
            </section>

            {loading ? (
              <div className="flex-center" style={{ height: '300px', flexDirection: 'column', gap: '1rem' }}>
                <Loader className="spin" size={48} color="var(--accent-color)" style={{ animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                <p>Curating movies...</p>
              </div>
            ) : movies.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '2rem'
              }}>
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.imdb_id || movie.tmdbid || Math.random()}
                    movie={movie}
                    onWatch={setSelectedMovie}
                  />
                ))}
              </div>
            ) : (
              <div className="flex-center" style={{ height: '300px', flexDirection: 'column', opacity: 0.7 }}>
                <Trophy size={48} style={{ marginBottom: '1rem' }} />
                <h3>No movies found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
