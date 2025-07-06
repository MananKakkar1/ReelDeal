import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Film, Star, Calendar } from "lucide-react";
import { moviesAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 999px;
  border: 2px solid rgba(148, 163, 184, 0.2);
  background: rgba(30, 41, 59, 0.5);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }

  @media (max-width: 640px) {
    font-size: 16px;
    padding: 0.875rem 1rem 0.875rem 2.75rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  z-index: 1;

  @media (max-width: 640px) {
    left: 0.875rem;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  z-index: 1;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    color: #06b6d4;
    background: rgba(6, 182, 212, 0.1);
  }

  @media (max-width: 640px) {
    right: 0.875rem;
  }
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1rem;
  margin-top: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  z-index: 50;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(148, 163, 184, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(6, 182, 212, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(6, 182, 212, 0.5);
  }
`;

const SearchResult = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(6, 182, 212, 0.1);
  }

  @media (max-width: 640px) {
    padding: 0.875rem;
    gap: 0.75rem;
  }
`;

const MoviePoster = styled.div`
  width: 3rem;
  height: 4.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(148, 163, 184, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 640px) {
    width: 2.5rem;
    height: 3.75rem;
  }
`;

const MovieInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MovieTitle = styled.div`
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    font-size: 0.875rem;
  }
`;

const MovieMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #94a3b8;
  font-size: 0.8rem;

  @media (max-width: 640px) {
    gap: 0.75rem;
    font-size: 0.75rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const NoResults = styled.div`
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: #06b6d4;
`;

const Spinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(6, 182, 212, 0.2);
  border-top: 2px solid #06b6d4;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SmartSearch = ({
  placeholder = "Search movies...",
  onSelect,
  className,
  value = "",
  onChange,
}) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Update internal query when external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced search function
  const searchMovies = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const response = await moviesAPI.search(searchQuery, { page: 1 });
      setResults(response.data.data.movies.slice(0, 8)); // Limit to 8 results
      setShowDropdown(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    // Call external onChange if provided
    if (onChange) {
      onChange(e);
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchMovies(value);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectMovie(results[selectedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle movie selection
  const handleSelectMovie = (movie) => {
    if (onSelect) {
      onSelect(movie);
    } else {
      navigate(`/movie/${movie.id}`);
    }
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).getFullYear();
  };

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/w92${posterPath}`;
  };

  return (
    <SearchContainer ref={dropdownRef} className={className}>
      <SearchIcon>
        <Search size={20} />
      </SearchIcon>

      <SearchInput
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => query && setShowDropdown(true)}
        placeholder={placeholder}
        autoComplete="off"
      />

      {query && (
        <ClearButton
          onClick={() => {
            setQuery("");
            setResults([]);
            setShowDropdown(false);
            setSelectedIndex(-1);
          }}
        >
          <X size={16} />
        </ClearButton>
      )}

      <AnimatePresence>
        {showDropdown && (
          <Dropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <LoadingSpinner>
                <Spinner />
              </LoadingSpinner>
            ) : results.length > 0 ? (
              results.map((movie, index) => (
                <SearchResult
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    background:
                      selectedIndex === index
                        ? "rgba(6, 182, 212, 0.1)"
                        : "transparent",
                  }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <MoviePoster>
                    {movie.poster_path ? (
                      <img
                        src={getPosterUrl(movie.poster_path)}
                        alt={movie.title}
                        loading="lazy"
                      />
                    ) : (
                      <Film size={20} color="#64748b" />
                    )}
                  </MoviePoster>

                  <MovieInfo>
                    <MovieTitle>{movie.title}</MovieTitle>
                    <MovieMeta>
                      {movie.release_date && (
                        <MetaItem>
                          <Calendar size={12} />
                          {formatDate(movie.release_date)}
                        </MetaItem>
                      )}
                      {movie.vote_average > 0 && (
                        <MetaItem>
                          <Star size={12} />
                          {movie.vote_average.toFixed(1)}
                        </MetaItem>
                      )}
                      {movie.genre_ids && movie.genre_ids.length > 0 && (
                        <MetaItem>
                          <Film size={12} />
                          {movie.genre_ids.slice(0, 2).join(", ")}
                        </MetaItem>
                      )}
                    </MovieMeta>
                  </MovieInfo>
                </SearchResult>
              ))
            ) : query && !loading ? (
              <NoResults>No movies found for "{query}"</NoResults>
            ) : null}
          </Dropdown>
        )}
      </AnimatePresence>
    </SearchContainer>
  );
};

export default SmartSearch;
