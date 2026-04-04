import { useState, useEffect } from 'react';
import { Search, PlayCircle, Loader, Trophy, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import { fetchMovies } from './services/api';
import './index.css';

// MovieCard Component - Standard Netflix Style Hover Poster
const MovieCard = ({ movie, onWatch }) => {
  const { orig_title, year, quality } = movie;
  
  // Generate a random gradient based on title length for placeholder poster
  const gradients = [
    'linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)',
    'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)',
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
    'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
  ];
  const gradient = gradients[(orig_title.length || 0) % gradients.length];

  return (
    <div 
      className="netflix-card" 
      onClick={() => onWatch(movie)}
      style={{ background: gradient }}
    >
      <div style={{ padding: '1rem', color: 'rgba(255,255,255,0.7)', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PlayCircle size={48} color="rgba(255,255,255,0.3)" />
      </div>
      {(quality || year) && (
        <div className="poster-year">
          {quality || year}
        </div>
      )}
      <div className="poster-title">
        {orig_title}
      </div>
    </div>
  );
};

// Row Component for Carousels
const MovieRow = ({ title, movies, onWatch }) => {
  if (!movies || movies.length === 0) return null;
  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-posters">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.imdb_id || movie.tmdbid || Math.random()} 
            movie={movie} 
            onWatch={onWatch} 
          />
        ))}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [row1, setRow1] = useState([]);
  const [row2, setRow2] = useState([]);
  const [row3, setRow3] = useState([]);
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [query, setQuery] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showIframe, setShowIframe] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    loadInitialRows();
  }, []);

  const loadInitialRows = async () => {
    setLoading(true);
    // Fetch different pages to simulate different categorization
    const [p1, p2, p3] = await Promise.all([
      fetchMovies(1),
      fetchMovies(2),
      fetchMovies(3)
    ]);
    
    if (p1 && p1.data) setRow1(p1.data);
    if (p2 && p2.data) setRow2(p2.data);
    if (p3 && p3.data) setRow3(p3.data);
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Execute search if user typed a query, OR if filters are active
      if (query.trim() !== '' || filterYear !== '') {
        executeSearch(query, filterYear);
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, filterYear]);

  const executeSearch = async (searchQuery, year) => {
    setLoading(true);
    const result = await fetchMovies(1, searchQuery, year);
    if (result && result.data) {
      setSearchResults(result.data);
    } else {
      setSearchResults([]);
    }
    setLoading(false);
  };

  // Render Details View (Player)
  if (selectedMovie) {
    return (
      <div className="details-view animate-fade-in">
        <button
          onClick={() => { setSelectedMovie(null); setShowIframe(false); }}
          style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
        >
          &larr; Back to Browse
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '2.5rem' }}>{selectedMovie.orig_title} ({selectedMovie.year})</h2>
          
          <div style={{ background: 'rgba(229, 9, 20, 0.1)', border: '1px solid rgba(229, 9, 20, 0.2)', padding: '0.75rem 1rem', borderRadius: '4px', color: '#ff6b6b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
            <AlertTriangle size={18} />
            <strong>Caution:</strong> Use Brave browser or an adblocker to restrict popups
          </div>
          
          {!showIframe ? (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn-primary" 
                onClick={() => setShowIframe(true)}
              >
                <PlayCircle size={22} /> Play
              </button>
              <a 
                href={`https://moviesapi.to/movie/${selectedMovie.imdb_id || selectedMovie.tmdbid}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <ExternalLink size={22} /> Open in New Tab
              </a>
            </div>
          ) : (
            <div style={{ aspectRatio: '16/9', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
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
    );
  }

  const featuredMovie = row1.length > 0 ? row1[0] : null;

  return (
    <div className="app">
      {/* Navbar */}
      <nav className={`nav-netflix ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">PURA TIMEPASS</div>
        <div className="search-wrapper">
          <Search className="search-icon" size={18} color="#808080" />
          <input
            type="text"
            className="search-input"
            placeholder="Titles, people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(e.target.value)}
            className="filter-select"
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
      </nav>

      {(query.trim() !== '' || filterYear !== '') ? (
        /* Search Results View */
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
          <h2 className="search-title">Search Results for "{query}"</h2>
          
          {loading ? (
             <div className="search-grid" style={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <Loader className="spin" size={48} color="var(--accent-color)" />
             </div>
          ) : searchResults.length > 0 ? (
            <div className="search-grid">
              {searchResults.map((movie) => (
                <MovieCard 
                  key={movie.imdb_id || movie.tmdbid || Math.random()} 
                  movie={movie} 
                  onWatch={setSelectedMovie} 
                />
              ))}
            </div>
          ) : (
            <div style={{ height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              <Trophy size={48} style={{ marginBottom: '1rem' }} />
              <h3>No movies found</h3>
            </div>
          )}
        </div>
      ) : (
        /* Browse View */
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
          {featuredMovie && (
            <header className="banner" style={{ background: `linear-gradient(135deg, #111 0%, #e5091444 100%)` }}>
              <div className="banner-contents">
                <h1 className="banner-title">{featuredMovie.orig_title}</h1>
                <div className="banner-buttons">
                  <button className="btn-primary" onClick={() => setSelectedMovie(featuredMovie)}>
                    <PlayCircle size={20} /> Play
                  </button>
                  <button className="btn-secondary" onClick={() => setSelectedMovie(featuredMovie)}>
                    <Info size={20} /> More Info
                  </button>
                </div>
                <h1 className="banner-description">
                  {featuredMovie.year} • {featuredMovie.quality || 'HD'} <br/>
                  Watch {featuredMovie.orig_title} securely directly in your browser. Action packed cinema available instantly.
                </h1>
              </div>
              <div className="banner-fadeBottom" />
            </header>
          )}

          {loading && row1.length === 0 ? (
            <div style={{ height: '30vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <Loader className="spin" size={48} color="var(--accent-color)" />
            </div>
          ) : (
            <>
              <MovieRow title="Trending Now" movies={row1} onWatch={setSelectedMovie} />
              <MovieRow title="New Releases" movies={row2} onWatch={setSelectedMovie} />
              <MovieRow title="Top Picks for You" movies={row3} onWatch={setSelectedMovie} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
