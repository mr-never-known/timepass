import { useState, useEffect, useCallback } from 'react';
import { Search, PlayCircle, Loader, Trophy, ExternalLink, AlertTriangle, Info, X, Tv, Film, RotateCw } from 'lucide-react';
import { fetchMovies, fetchTVShows } from './services/api';
import './index.css';

// ─── MediaCard ────────────────────────────────────────────────────────────────
const MediaCard = ({ item, onWatch, isTV }) => {
  const { orig_title, year, quality, imdb_id } = item;
  const [posterUrl, setPosterUrl] = useState(null);

  useEffect(() => {
    if (imdb_id) {
      const cached = sessionStorage.getItem(`poster_${imdb_id}`);
      if (cached) {
        setPosterUrl(cached);
      } else {
        fetch(`/api/poster?i=${imdb_id}`)
          .then(r => r.json())
          .then(data => {
            if (data.Poster && data.Poster !== 'N/A') {
              setPosterUrl(data.Poster);
              sessionStorage.setItem(`poster_${imdb_id}`, data.Poster);
            }
          })
          .catch(console.error);
      }
    }
  }, [imdb_id]);

  const gradients = [
    'linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)',
    'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)',
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
    'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
  ];
  const gradient = gradients[(orig_title?.length || 0) % gradients.length];
  const cardBg = posterUrl ? `url(${posterUrl})` : gradient;

  return (
    <div
      className="netflix-card"
      onClick={() => onWatch(item)}
      style={{ backgroundImage: cardBg, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      {isTV && <div className="card-tv-badge">TV</div>}
      {!posterUrl && (
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PlayCircle size={48} color="rgba(255,255,255,0.3)" />
        </div>
      )}
      {(quality || year) && <div className="poster-year">{quality || year}</div>}
      <div className="poster-title">{orig_title}</div>
    </div>
  );
};

// ─── MediaRow ─────────────────────────────────────────────────────────────────
const MediaRow = ({ title, items, onWatch, isTV }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-posters">
        {items.map(item => (
          <MediaCard
            key={item.imdb_id || item.tmdbid || Math.random()}
            item={item}
            onWatch={onWatch}
            isTV={isTV}
          />
        ))}
      </div>
    </div>
  );
};

// ─── TVDetails ────────────────────────────────────────────────────────────────
const TVDetails = ({ show, onBack }) => {
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const maxSeasons = 10;
  const maxEpisodes = 20;
  const id = show.imdb_id || show.tmdbid;
  const playerUrl = `https://moviesapi.to/tv/${id}-${season}-${episode}`;
  const externalUrl = playerUrl;

  const cachedPoster = sessionStorage.getItem(`poster_${show.imdb_id}`);
  const detailsBg = cachedPoster ? cachedPoster.replace('SX300', 'SX1080') : null;

  return (
    <div
      className="details-view animate-fade-in"
      style={detailsBg ? {
        backgroundImage: `url("${detailsBg}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      } : {}}
    >
      <div className="details-overlay" />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <button
          onClick={onBack}
          style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
        >
          &larr; Back to Browse
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '2.5rem', textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
            {show.orig_title} {show.year && <span style={{ fontSize: '1.5rem', opacity: 0.7 }}>({show.year})</span>}
          </h2>

          {/* Season / Episode pickers */}
          <div className="tv-selectors">
            <div className="tv-selector-group">
              <label>Season</label>
              <div className="tv-selector-row">
                {Array.from({ length: maxSeasons }, (_, i) => i + 1).map(s => (
                  <button
                    key={s}
                    className={`episode-btn ${season === s ? 'active' : ''}`}
                    onClick={() => { setSeason(s); setEpisode(1); setShowIframe(false); }}
                  >{s}</button>
                ))}
              </div>
            </div>
            <div className="tv-selector-group">
              <label>Episode</label>
              <div className="tv-selector-row">
                {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map(e => (
                  <button
                    key={e}
                    className={`episode-btn ${episode === e ? 'active' : ''}`}
                    onClick={() => { setEpisode(e); setShowIframe(false); }}
                  >{e}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(229, 9, 20, 0.15)', border: '1px solid rgba(229,9,20,0.3)', padding: '0.75rem 1rem', borderRadius: '4px', color: '#ff6b6b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content', backdropFilter: 'blur(4px)' }}>
            <AlertTriangle size={18} />
            <strong>Caution:</strong> Use Brave browser or an adblocker to restrict popups
          </div>

          {!showIframe ? (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="btn-primary" onClick={() => setShowIframe(true)}>
                <PlayCircle size={22} /> Play S{season} E{episode}
              </button>
              <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <ExternalLink size={22} /> Open in New Tab
              </a>
            </div>
          ) : (
            <div style={{ aspectRatio: '16/9', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              <iframe key={iframeKey} src={playerUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen title="TV Player" />
              <button
                onClick={() => setIframeKey(k => k + 1)}
                className="iframe-refresh-btn"
                title="Reload player"
              >
                <RotateCw size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('app_mode') || 'movies'); // 'movies' | 'tv'

  const [row1, setRow1] = useState([]);
  const [row2, setRow2] = useState([]);
  const [row3, setRow3] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showIframe, setShowIframe] = useState(false);
  const [movieIframeKey, setMovieIframeKey] = useState(0);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [featuredItem, setFeaturedItem] = useState(null);
  const [featuredPoster, setFeaturedPoster] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sync mode to localStorage
  useEffect(() => {
    localStorage.setItem('app_mode', mode);
  }, [mode]);

  // scroll listener
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // reload rows when mode switches
  useEffect(() => {
    setRow1([]); setRow2([]); setRow3([]);
    setFeaturedItem(null); setFeaturedPoster(null);
    setQuery(''); setFilterYear(''); setSearchResults([]);
    loadRows(mode);
  }, [mode]);

  const fetchFn = useCallback((page, q = '') =>
    mode === 'tv' ? fetchTVShows(page, q) : fetchMovies(page, q, ''),
  [mode]);

  const loadRows = (currentMode) => {
    setLoading(true);
    const cachePrefix = currentMode === 'tv' ? 'tv_' : '';

    const getRow = (pageNum, setRow, key) => {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        setRow(parsed);
        return Promise.resolve(parsed);
      }
      const fn = currentMode === 'tv' ? fetchTVShows : fetchMovies;
      return fn(pageNum).then(res => {
        if (res && res.data) {
          sessionStorage.setItem(key, JSON.stringify(res.data));
          setRow(res.data);
          return res.data;
        }
        return [];
      });
    };

    getRow(1, setRow1, `${cachePrefix}row1`).then(data => {
      if (data && data.length > 0) {
        setFeaturedItem(data[Math.floor(Math.random() * data.length)]);
      }
      setLoading(false);
    }).catch(console.error);

    getRow(2, setRow2, `${cachePrefix}row2`).catch(console.error);
    getRow(3, setRow3, `${cachePrefix}row3`).catch(console.error);
  };

  // featured poster
  useEffect(() => {
    if (featuredItem?.imdb_id) {
      const cached = sessionStorage.getItem(`poster_${featuredItem.imdb_id}`);
      if (cached) {
        setFeaturedPoster(cached.replace('SX300', 'SX1080'));
      } else {
        fetch(`/api/poster?i=${featuredItem.imdb_id}`)
          .then(r => r.json())
          .then(data => {
            if (data.Poster && data.Poster !== 'N/A') {
              setFeaturedPoster(data.Poster.replace('SX300', 'SX1080'));
              sessionStorage.setItem(`poster_${featuredItem.imdb_id}`, data.Poster);
            }
          })
          .catch(console.error);
      }
    }
  }, [featuredItem]);

  // debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      if (query.trim() !== '' || filterYear !== '') {
        executeSearch(query, filterYear);
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [query, filterYear, mode]);

  const executeSearch = async (q, year) => {
    setLoading(true);
    const fn = mode === 'tv' ? fetchTVShows : fetchMovies;
    const result = mode === 'tv' ? await fn(1, q) : await fn(1, q, year);
    setSearchResults(result?.data || []);
    setLoading(false);
  };

  const clearSearch = () => { setQuery(''); setFilterYear(''); setMobileSearchOpen(false); };

  // ── TV Details View ──
  if (selectedItem && mode === 'tv') {
    return <TVDetails show={selectedItem} onBack={() => setSelectedItem(null)} />;
  }

  // ── Movie Details View ──
  if (selectedItem && mode === 'movies') {
    const cachedPoster = sessionStorage.getItem(`poster_${selectedItem.imdb_id}`);
    const detailsBg = cachedPoster ? cachedPoster.replace('SX300', 'SX1080') : null;
    return (
      <div
        className="details-view animate-fade-in"
        style={detailsBg ? {
          backgroundImage: `url("${detailsBg}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        } : {}}
      >
        <div className="details-overlay" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <button
            onClick={() => { setSelectedItem(null); setShowIframe(false); }}
            style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
          >
            &larr; Back to Browse
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '2.5rem', textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
              {selectedItem.orig_title} ({selectedItem.year})
            </h2>
            <div style={{ background: 'rgba(229, 9, 20, 0.15)', border: '1px solid rgba(229,9,20,0.3)', padding: '0.75rem 1rem', borderRadius: '4px', color: '#ff6b6b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content', backdropFilter: 'blur(4px)' }}>
              <AlertTriangle size={18} />
              <strong>Caution:</strong> Use Brave browser or an adblocker to restrict popups
            </div>
            {!showIframe ? (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn-primary" onClick={() => setShowIframe(true)}>
                  <PlayCircle size={22} /> Play
                </button>
                <a href={`https://moviesapi.to/movie/${selectedItem.imdb_id || selectedItem.tmdbid}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <ExternalLink size={22} /> Open in New Tab
                </a>
              </div>
            ) : (
              <div style={{ aspectRatio: '16/9', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                <iframe
                  key={movieIframeKey}
                  src={`https://moviesapi.to/movie/${selectedItem.imdb_id || selectedItem.tmdbid}`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allowFullScreen title="Movie Player"
                />
                <button
                  onClick={() => setMovieIframeKey(k => k + 1)}
                  className="iframe-refresh-btn"
                  title="Reload player"
                >
                  <RotateCw size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isSearching = query.trim() !== '' || filterYear !== '';

  return (
    <div className="app">
      {/* Navbar */}
      <nav className={`nav-netflix ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-header">
          <div className="nav-logo">PURA TIMEPASS</div>
          <button className="mobile-search-toggle" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
            <Search size={24} color="#fff" />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'movies' ? 'active' : ''}`}
            onClick={() => setMode('movies')}
          >
            <Film size={16} /> Movies
          </button>
          <button
            className={`mode-btn ${mode === 'tv' ? 'active' : ''}`}
            onClick={() => setMode('tv')}
          >
            <Tv size={16} /> TV Series
          </button>
        </div>

        <div className={`search-wrapper ${mobileSearchOpen ? 'mobile-open' : ''}`}>
          <div className="search-input-container">
            <Search className="search-icon" size={18} color="#808080" />
            <input
              type="text"
              className="search-input"
              placeholder={mode === 'tv' ? 'Search series...' : 'Titles, people...'}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {isSearching && (
              <button onMouseDown={e => { e.preventDefault(); clearSearch(); }} className="clear-search-btn" title="Close Search">
                <X size={16} />
              </button>
            )}
          </div>
          {mode === 'movies' && (
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="filter-select">
              <option value="">All Years</option>
              {[2026,2025,2024,2023,2022,2021,2020].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          )}
        </div>
      </nav>

      {isSearching ? (
        /* Search Results */
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
          <h2 className="search-title">
            {mode === 'tv' ? 'TV Series' : 'Movies'} matching &ldquo;{query}&rdquo;
          </h2>
          {loading ? (
            <div className="search-grid" style={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Loader className="spin" size={48} color="var(--accent-color)" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="search-grid">
              {searchResults.map(item => (
                <MediaCard
                  key={item.imdb_id || item.tmdbid || Math.random()}
                  item={item}
                  onWatch={setSelectedItem}
                  isTV={mode === 'tv'}
                />
              ))}
            </div>
          ) : (
            <div style={{ height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              <Trophy size={48} style={{ marginBottom: '1rem' }} />
              <h3>No results found</h3>
            </div>
          )}
        </div>
      ) : (
        /* Browse View */
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
          {featuredItem && (
            <header className="banner" style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              backgroundImage: featuredPoster
                ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("${featuredPoster}")`
                : 'linear-gradient(135deg, #111 0%, #e5091444 100%)'
            }}>
              <div className="banner-contents">
                <h1 className="banner-title">{featuredItem.orig_title}</h1>
                <div className="banner-buttons">
                  <button className="btn-primary" onClick={() => setSelectedItem(featuredItem)}>
                    <PlayCircle size={20} />
                    {mode === 'tv' ? 'Watch' : 'Play'}
                  </button>
                  <button className="btn-secondary" onClick={() => setSelectedItem(featuredItem)}>
                    <Info size={20} /> More Info
                  </button>
                </div>
                <p className="banner-description">
                  {featuredItem.year} • {featuredItem.quality || (mode === 'tv' ? 'Series' : 'HD')}<br />
                  {mode === 'tv'
                    ? `Watch ${featuredItem.orig_title} episodes directly in your browser.`
                    : `Watch ${featuredItem.orig_title} securely directly in your browser.`}
                </p>
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
              <MediaRow title={mode === 'tv' ? 'Trending Series' : 'Trending Now'} items={row1} onWatch={setSelectedItem} isTV={mode === 'tv'} />
              <MediaRow title={mode === 'tv' ? 'Latest Episodes' : 'New Releases'} items={row2} onWatch={setSelectedItem} isTV={mode === 'tv'} />
              <MediaRow title={mode === 'tv' ? 'Popular Shows' : 'Top Picks for You'} items={row3} onWatch={setSelectedItem} isTV={mode === 'tv'} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
