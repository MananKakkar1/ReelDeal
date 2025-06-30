import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import Section from '../components/common/Section';
import SectionTitle from '../components/common/SectionTitle';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:5000/api/tmdb';

function Home() {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/trending/movie/week`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results || []);
        setEmpty(!(data.results && data.results.length));
      })
      .catch(() => setEmpty(true))
      .finally(() => setLoading(false));
    fetch(`${API_BASE}/genre/movie/list`)
      .then(res => res.json())
      .then(data => setGenres(data.genres || []));
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (!search) return;
    setLoading(true);
    fetch(`${API_BASE}/search/movie?query=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results || []);
        setEmpty(!(data.results && data.results.length));
      })
      .catch(() => setEmpty(true))
      .finally(() => setLoading(false));
  };

  const handleGenre = genreId => {
    setSelectedGenre(genreId);
    setLoading(true);
    fetch(`${API_BASE}/discover/movie?with_genres=${genreId}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results || []);
        setEmpty(!(data.results && data.results.length));
      })
      .catch(() => setEmpty(true))
      .finally(() => setLoading(false));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Section>
        <SectionTitle>Discover Movies</SectionTitle>
        <form style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32, width: '100%' }} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for a movie..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: 220,
              padding: '0.7em 1em',
              borderRadius: 999,
              border: '1px solid #23232b',
              background: '#23232b',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              fontWeight: 500,
              width: '100%',
            }}
          />
          <Button type="submit">Search</Button>
        </form>
      </Section>
      <Section>
        <SectionTitle>{selectedGenre ? `Movies in ${genres.find(g => g.id === selectedGenre)?.name}` : 'Trending Now'}</SectionTitle>
        {loading ? <Spinner /> : (
          movies.length > 0 ? (
            <motion.div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 24,
              }}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07 } },
              }}
            >
              {movies.map(movie => (
                <motion.div key={movie.id} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', color: '#888', padding: '2rem 0', fontSize: '1.2rem' }}>
              {empty ? 'No movies found. Try a different search or genre.' : 'No movies to display.'}
            </div>
          )
        )}
      </Section>
      <Section>
        <SectionTitle>Browse by Genre</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {genres.map(genre => (
            <Button
              key={genre.id}
              type="button"
              style={{
                background: selectedGenre === genre.id ? 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)' : '#23232b',
                color: selectedGenre === genre.id ? '#fff' : '#06b6d4',
                border: selectedGenre === genre.id ? 'none' : '1px solid #06b6d4',
                marginBottom: 8,
              }}
              onClick={() => handleGenre(genre.id)}
            >
              {genre.name}
            </Button>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}

export default Home; 