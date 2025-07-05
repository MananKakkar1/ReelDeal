import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import MovieCard from "../components/MovieCard";
import Section from "../components/common/Section";
import SectionTitle from "../components/common/SectionTitle";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import SmartSearch from "../components/SmartSearch";
import { moviesAPI } from "../services/api";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomeContainer = styled(motion.div)`
  width: 100%;
`;

const SearchSection = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 2rem;
  }
`;

const MoviesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #94a3b8;
  padding: 3rem 1rem;
  font-size: 1.1rem;

  @media (max-width: 640px) {
    font-size: 1rem;
    padding: 2rem 1rem;
  }
`;

const GenreSection = styled.div`
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 2rem;
  }
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
`;

const GenreButton = styled(Button)`
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;

  @media (max-width: 640px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }
`;

const SurpriseButton = styled(Button)`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
  }
`;

function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    moviesAPI
      .getTrending({ time_window: "week" })
      .then((response) => {
        const movieData = response.data.data.movies || [];
        setMovies(movieData);
        setEmpty(!movieData.length);
      })
      .catch(() => setEmpty(true))
      .finally(() => setLoading(false));

    // Fetch genres from API
    moviesAPI
      .getGenres()
      .then((response) => {
        setGenres(response.data.data.genres || []);
      })
      .catch((error) => {
        console.warn('Failed to fetch genres from API, using fallback:', error.message);
        // Fallback to static genres if API fails
        const staticGenres = [
          { id: 28, name: "Action" },
          { id: 12, name: "Adventure" },
          { id: 16, name: "Animation" },
          { id: 35, name: "Comedy" },
          { id: 80, name: "Crime" },
          { id: 99, name: "Documentary" },
          { id: 18, name: "Drama" },
          { id: 10751, name: "Family" },
          { id: 14, name: "Fantasy" },
          { id: 36, name: "History" },
          { id: 27, name: "Horror" },
          { id: 10402, name: "Music" },
          { id: 9648, name: "Mystery" },
          { id: 10749, name: "Romance" },
          { id: 878, name: "Science Fiction" },
          { id: 10770, name: "TV Movie" },
          { id: 53, name: "Thriller" },
          { id: 10752, name: "War" },
          { id: 37, name: "Western" },
        ];
        setGenres(staticGenres);
      });
  }, []);

  const handleSmartSearchSelect = (movie) => {
    // Navigate to movie details
    window.location.href = `/movie/${movie.id}`;
  };

  const handleGenre = (genreId) => {
    setSelectedGenre(genreId);
    setLoading(true);
    moviesAPI
      .getByGenre(genreId)
      .then((response) => {
        const movieData = response.data.data.movies || [];
        setMovies(movieData);
        setEmpty(!movieData.length);
      })
      .catch(() => setEmpty(true))
      .finally(() => setLoading(false));
  };

  const clearGenre = () => {
    setSelectedGenre(null);
    setLoading(true);
    moviesAPI
      .getTrending({ time_window: "week" })
      .then((response) => {
        const movieData = response.data.data.movies || [];
        setMovies(movieData);
        setEmpty(!movieData.length);
      })
      .catch(() => setEmpty(true))
      .finally(() => setLoading(false));
  };

  const handleSurpriseMe = () => {
    // Get a random movie from the current list or trending
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    if (randomMovie) {
      navigate(`/movie/${randomMovie.id}`);
    } else {
      // If no movies loaded, navigate to recommendations
      navigate('/recommendations');
    }
  };

  return (
    <HomeContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Section>
        <SectionTitle>Discover Movies</SectionTitle>
        <SearchSection>
          <SmartSearch
            placeholder="Search for movies, actors, or genres..."
            onSelect={handleSmartSearchSelect}
          />
        </SearchSection>
        
        <SurpriseButton onClick={handleSurpriseMe}>
          <Sparkles size={20} />
          Surprise Me!
        </SurpriseButton>
      </Section>

      <Section>
        <SectionTitle>
          {selectedGenre
            ? `Movies in ${genres.find((g) => g.id === selectedGenre)?.name}`
            : "Trending Now"}
        </SectionTitle>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <Spinner />
          </div>
        ) : movies.length > 0 ? (
          <MoviesGrid
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </MoviesGrid>
        ) : (
          <EmptyState>
            {empty
              ? "No movies found. Try a different search or genre."
              : "No movies to display."}
          </EmptyState>
        )}
      </Section>

      <Section>
        <SectionTitle>Browse by Genre</SectionTitle>
        <GenreSection>
          <GenreGrid>
            <GenreButton
              type="button"
              style={{
                background: !selectedGenre
                  ? "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)"
                  : "rgba(30, 41, 59, 0.5)",
                color: !selectedGenre ? "#fff" : "#06b6d4",
                border: !selectedGenre ? "none" : "1px solid #06b6d4",
              }}
              onClick={clearGenre}
            >
              All
            </GenreButton>
            {genres.map((genre) => (
              <GenreButton
                key={genre.id}
                type="button"
                style={{
                  background:
                    selectedGenre === genre.id
                      ? "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)"
                      : "rgba(30, 41, 59, 0.5)",
                  color: selectedGenre === genre.id ? "#fff" : "#06b6d4",
                  border:
                    selectedGenre === genre.id ? "none" : "1px solid #06b6d4",
                }}
                onClick={() => handleGenre(genre.id)}
              >
                {genre.name}
              </GenreButton>
            ))}
          </GenreGrid>
        </GenreSection>
      </Section>
    </HomeContainer>
  );
}

export default Home;
