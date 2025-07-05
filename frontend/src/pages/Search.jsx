import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Section from "../components/common/Section";
import SectionTitle from "../components/common/SectionTitle";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import MovieCard from "../components/MovieCard";
import SmartSearch from "../components/SmartSearch";
import { moviesAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";

const SearchContainer = styled.div`
  width: 100%;
  padding: 1rem;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const SearchHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SearchTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 640px) {
    font-size: 2rem;
  }
`;

const SearchSubtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 1rem;
  }
`;

const SearchSection = styled.div`
  width: 100%;
  max-width: 600px;
`;

const FilterSection = styled.div`
  background: rgba(30, 41, 59, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(148, 163, 184, 0.1);

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #e2e8f0;
  font-weight: 600;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  outline: none;
  transition: border-color 0.3s ease;
  font-size: 0.9rem;

  &:focus {
    border-color: #06b6d4;
  }

  @media (max-width: 640px) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

const ResultsSection = styled.div`
  margin-top: 2rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const ResultsCount = styled.div`
  color: #94a3b8;
  font-size: 1rem;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #06b6d4;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    background: rgba(6, 182, 212, 0.1);
  }

  @media (min-width: 640px) {
    align-self: center;
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
  padding: 4rem 2rem;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #94a3b8;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: #64748b;
`;

const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 0.5rem;
  color: #06b6d4;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  @media (min-width: 640px) {
    display: none;
  }

  &:hover {
    background: rgba(6, 182, 212, 0.2);
  }
`;

const MobileFilterSection = styled(motion.div)`
  @media (min-width: 640px) {
    display: none;
  }
`;

const DesktopFilterSection = styled.div`
  @media (max-width: 639px) {
    display: none;
  }
`;

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    sortBy: "relevance",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const years = Array.from(
    { length: 30 },
    (_, i) => new Date().getFullYear() - i
  );
  const ratings = ["Any", "9+", "8+", "7+", "6+", "5+"];
  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "rating", label: "Rating" },
    { value: "date", label: "Release Date" },
    { value: "title", label: "Title" },
  ];

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) {
      setMovies([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    try {
      const params = {
        query,
        page: currentPage,
        ...filters,
      };

      const response = await moviesAPI.search(query, params);
      setMovies(response.data.data.movies);
      setTotalResults(response.data.data.totalResults);
    } catch (error) {
      console.error("Search error:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSmartSearchSelect = (movie) => {
    // Navigate to movie details
    window.location.href = `/movie/${movie.id}`;
  };

  const clearSearch = () => {
    setSearchQuery("");
    setMovies([]);
    setTotalResults(0);
    setFilters({
      genre: "",
      year: "",
      rating: "",
      sortBy: "relevance",
    });
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [filters, currentPage]);

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>Discover Movies</SearchTitle>
        <SearchSubtitle>
          Search through thousands of movies and find your next favorite
        </SearchSubtitle>
      </SearchHeader>

      <SearchSection>
        <SmartSearch
          placeholder="Search for movies, actors, or genres..."
          onSelect={handleSmartSearchSelect}
        />
      </SearchSection>

      {/* Mobile Filter Toggle */}
      <FilterToggle onClick={() => setShowMobileFilters(!showMobileFilters)}>
        <Filter size={16} />
        Filters
      </FilterToggle>

      {/* Mobile Filters */}
      <AnimatePresence>
        {showMobileFilters && (
          <MobileFilterSection
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FilterSection>
              <FilterHeader>
                <Filter size={20} />
                Filters
              </FilterHeader>
              <FilterGrid>
                <FilterGroup>
                  <FilterLabel>Sort By</FilterLabel>
                  <FilterSelect
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterGroup>
                <FilterGroup>
                  <FilterLabel>Year</FilterLabel>
                  <FilterSelect
                    value={filters.year}
                    onChange={(e) => handleFilterChange("year", e.target.value)}
                  >
                    <option value="">Any Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterGroup>
                <FilterGroup>
                  <FilterLabel>Minimum Rating</FilterLabel>
                  <FilterSelect
                    value={filters.rating}
                    onChange={(e) =>
                      handleFilterChange("rating", e.target.value)
                    }
                  >
                    {ratings.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterGroup>
              </FilterGrid>
            </FilterSection>
          </MobileFilterSection>
        )}
      </AnimatePresence>

      {/* Desktop Filters */}
      <DesktopFilterSection>
        <FilterSection>
          <FilterHeader>
            <Filter size={20} />
            Advanced Filters
          </FilterHeader>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Sort By</FilterLabel>
              <FilterSelect
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Year</FilterLabel>
              <FilterSelect
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
              >
                <option value="">Any Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Minimum Rating</FilterLabel>
              <FilterSelect
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
              >
                {ratings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          </FilterGrid>
        </FilterSection>
      </DesktopFilterSection>

      {movies.length > 0 && (
        <ResultsSection>
          <ResultsHeader>
            <ResultsCount>Found {totalResults} movies</ResultsCount>
            <ClearButton onClick={clearSearch}>
              <X size={16} />
              Clear Search
            </ClearButton>
          </ResultsHeader>

          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <Spinner />
            </div>
          ) : (
            <MoviesGrid
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </MoviesGrid>
          )}
        </ResultsSection>
      )}

      {!loading && searchQuery && movies.length === 0 && (
        <EmptyState>
          <EmptyIcon>🎬</EmptyIcon>
          <EmptyTitle>No movies found</EmptyTitle>
          <EmptyText>Try adjusting your search terms or filters</EmptyText>
        </EmptyState>
      )}

      {!searchQuery && !loading && (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyTitle>Start your search</EmptyTitle>
          <EmptyText>
            Search for movies, actors, or genres to discover new films
          </EmptyText>
        </EmptyState>
      )}
    </SearchContainer>
  );
}

export default Search;
