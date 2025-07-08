import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Star,
  Heart,
  TrendingUp,
  Clock,
  Users,
  RefreshCw,
  Play,
  Info,
  Filter,
  Shuffle,
  Eye,
} from "lucide-react";
import Section from "../components/common/Section";
import SectionTitle from "../components/common/SectionTitle";
import Spinner from "../components/common/Spinner";
import Card from "../components/common/Card";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/common/Pagination";
import { moviesAPI, usersAPI } from "../services/api";
import toast from "react-hot-toast";

const RecommendationsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 640px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(6, 182, 212, 0.3);
  }
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: #06b6d4;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #94a3b8;
  font-weight: 500;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  justify-content: center;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)"
      : "rgba(30, 41, 59, 0.5)"};
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  color: ${(props) => (props.active ? "white" : "#94a3b8")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
  }
`;

const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const GenreTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const GenreTag = styled.span`
  background: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(6, 182, 212, 0.2);
`;

const MoviesGrid = styled.div`
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
  margin-bottom: 2rem;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingContent = styled.div`
  text-align: center;
  color: white;
`;

const LoadingText = styled.div`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #94a3b8;
`;

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(true);
  const [filter, setFilter] = useState("all");
  const [userPreferences, setUserPreferences] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [stats, setStats] = useState({
    totalWatched: 0,
    averageRating: 0,
    favoriteGenres: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    analyzeUserPreferences();
  }, []);

  const analyzeUserPreferences = async () => {
    try {
      setAnalyzing(true);
      // Fetch watched movies from backend API
      const response = await usersAPI.getCurrentUserWatched();
      const watchedMovies = response.data.data || [];

      console.log("Watched Movies Response:", response);
      console.log("Watched Movies:", watchedMovies);

      if (watchedMovies.length === 0) {
        setStats({
          totalWatched: 0,
          averageRating: 0,
          favoriteGenres: [],
        });
        setAnalyzing(false);
        return;
      }

      // Calculate average rating
      const totalRating = watchedMovies.reduce(
        (sum, movie) => sum + (movie.userRating || 0),
        0
      );
      const averageRating = totalRating / watchedMovies.length;

      // Analyze genres from actual movie data
      const genreCounts = {};
      watchedMovies.forEach((movie) => {
        if (movie.genres && Array.isArray(movie.genres)) {
          movie.genres.forEach((genre) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        }
      });

      const favoriteGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([genre]) => genre);

      setStats({
        totalWatched: watchedMovies.length,
        averageRating: averageRating.toFixed(1),
        favoriteGenres,
      });

      setUserPreferences({
        averageRating,
        favoriteGenres,
        watchedMovies,
      });
    } catch (error) {
      console.error("Error analyzing user preferences:", error);
      toast.error("Failed to load user preferences");
    } finally {
      setAnalyzing(false);
    }
  };

  const generateRecommendations = async (page = 1) => {
    if (!userPreferences || userPreferences.watchedMovies.length === 0) {
      toast.error("Please add some movies to your watched list first!");
      return;
    }

    setLoading(true);
    try {
      // Get recommendations from backend API with pagination
      const response = await usersAPI.getRecommendations(page);
      const apiRecommendations = response.data.data?.recommendations || [];
      const paginationData = response.data.data?.pagination || {};

      console.log("API Recommendations:", apiRecommendations);

      if (apiRecommendations.length > 0) {
        // Add userInteraction field to make it compatible with MovieCard
        const recommendationsWithInteraction = apiRecommendations.map(
          (movie) => ({
            ...movie,
            userInteraction: {
              watchlist: false,
              watched: false,
              favorite: false,
              rating: 0,
            },
          })
        );

        setRecommendations(recommendationsWithInteraction);
        setTotalPages(paginationData.totalPages || 0);
        setTotalResults(paginationData.totalResults || 0);
        toast.success(
          `Generated ${apiRecommendations.length} personalized recommendations!`
        );
      } else {
        // Fallback to mock recommendations if API doesn't return data
        const mockRecommendations = generateMockRecommendations();
        setRecommendations(mockRecommendations);
        setTotalPages(1);
        setTotalResults(mockRecommendations.length);
        toast.success(
          `Generated ${mockRecommendations.length} personalized recommendations!`
        );
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      // Fallback to mock recommendations on error
      const mockRecommendations = generateMockRecommendations();
      setRecommendations(mockRecommendations);
      setTotalPages(1);
      setTotalResults(mockRecommendations.length);
      toast.success(
        `Generated ${mockRecommendations.length} personalized recommendations!`
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    generateRecommendations(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generateMockRecommendations = () => {
    const mockMovies = [
      {
        id: 1,
        title: "Inception",
        poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        vote_average: 8.4,
        release_date: "2010-07-16",
        genres: ["Action", "Sci-Fi", "Thriller"],
        matchScore: 95,
        matchReason: "Similar to your high-rated sci-fi films",
      },
      {
        id: 2,
        title: "The Dark Knight",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        vote_average: 9.0,
        release_date: "2008-07-18",
        genres: ["Action", "Crime", "Drama"],
        matchScore: 92,
        matchReason: "Matches your preference for action dramas",
      },
      {
        id: 3,
        title: "Interstellar",
        poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        vote_average: 8.6,
        release_date: "2014-11-07",
        genres: ["Adventure", "Drama", "Sci-Fi"],
        matchScore: 89,
        matchReason: "Based on your love for sci-fi epics",
      },
      {
        id: 4,
        title: "Pulp Fiction",
        poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        vote_average: 8.9,
        release_date: "1994-10-14",
        genres: ["Crime", "Drama"],
        matchReason: "Similar to your crime drama preferences",
      },
      {
        id: 5,
        title: "The Matrix",
        poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        vote_average: 8.7,
        release_date: "1999-03-31",
        genres: ["Action", "Sci-Fi"],
        matchScore: 87,
        matchReason: "Matches your sci-fi action taste",
      },
      {
        id: 6,
        title: "Fight Club",
        poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        vote_average: 8.8,
        release_date: "1999-10-15",
        genres: ["Drama"],
        matchScore: 85,
        matchReason: "Based on your drama preferences",
      },
    ];

    // Filter based on selected filter
    let filtered = mockMovies;
    switch (filter) {
      case "high-rated":
        filtered = mockMovies.filter((movie) => movie.vote_average >= 8.5);
        break;
      case "recent":
        filtered = mockMovies.filter(
          (movie) => new Date(movie.release_date).getFullYear() >= 2010
        );
        break;
      case "classic":
        filtered = mockMovies.filter(
          (movie) => new Date(movie.release_date).getFullYear() < 2000
        );
        break;
      default:
        break;
    }

    return filtered.slice(0, 6);
  };

  const filteredRecommendations = recommendations.filter((movie) => {
    switch (filter) {
      case "high-rated":
        return movie.vote_average >= 8.5;
      case "recent":
        return new Date(movie.release_date).getFullYear() >= 2010;
      case "classic":
        return new Date(movie.release_date).getFullYear() < 2000;
      default:
        return true;
    }
  });

  return (
    <RecommendationsContainer>
      <Header>
        <Title>Movie Recommendations</Title>
        <Subtitle>
          Discover your next favorite movie based on your taste
        </Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Eye size={24} color="white" />
          </StatIcon>
          <StatNumber>{stats.totalWatched}</StatNumber>
          <StatLabel>Movies Watched</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>
            <Star size={24} color="white" />
          </StatIcon>
          <StatNumber>{stats.averageRating}</StatNumber>
          <StatLabel>Average Rating</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>
            <Heart size={24} color="white" />
          </StatIcon>
          <StatNumber>{stats.favoriteGenres.length}</StatNumber>
          <StatLabel>Favorite Genres</StatLabel>
        </StatCard>
      </StatsGrid>

      {stats.favoriteGenres.length > 0 && (
        <Section>
          <SectionTitle>Your Favorite Genres</SectionTitle>
          <GenreTags>
            {stats.favoriteGenres.map((genre) => (
              <GenreTag key={genre}>{genre}</GenreTag>
            ))}
          </GenreTags>
        </Section>
      )}

      <Controls>
        <FilterButton
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          <Filter size={16} />
          All
        </FilterButton>
        <FilterButton
          className={filter === "high-rated" ? "active" : ""}
          onClick={() => setFilter("high-rated")}
        >
          <Star size={16} />
          High Rated
        </FilterButton>
        <FilterButton
          className={filter === "recent" ? "active" : ""}
          onClick={() => setFilter("recent")}
        >
          <TrendingUp size={16} />
          Recent
        </FilterButton>
        <FilterButton
          className={filter === "classic" ? "active" : ""}
          onClick={() => setFilter("classic")}
        >
          <Clock size={16} />
          Classics
        </FilterButton>
        <GenerateButton
          onClick={generateRecommendations}
          disabled={
            loading ||
            !userPreferences ||
            userPreferences.watchedMovies.length === 0
          }
        >
          {loading ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Recommendations
            </>
          )}
        </GenerateButton>
      </Controls>

      {recommendations.length > 0 ? (
        <>
          <MoviesGrid>
            <AnimatePresence>
              {filteredRecommendations.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MovieCard
                    movie={movie}
                    onBookmark={analyzeUserPreferences}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </MoviesGrid>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalResults={totalResults}
              itemsPerPage={20}
            />
          )}
        </>
      ) : (
        <EmptyState>
          <EmptyIcon>🎬</EmptyIcon>
          <EmptyTitle>No recommendations yet</EmptyTitle>
          <EmptyText>
            {userPreferences && userPreferences.watchedMovies.length > 0
              ? "Click the button above to generate personalized recommendations based on your watched movies."
              : "Add some movies to your watched list first to get personalized recommendations."}
          </EmptyText>
          {userPreferences && userPreferences.watchedMovies.length > 0 && (
            <GenerateButton
              onClick={generateRecommendations}
              disabled={loading}
            >
              <Sparkles size={20} />
              Generate Recommendations
            </GenerateButton>
          )}
        </EmptyState>
      )}

      <AnimatePresence>
        {(loading || analyzing) && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingContent>
              <Spinner />
              <LoadingText>
                {analyzing
                  ? "Loading your movie preferences..."
                  : "Analyzing your preferences and finding the perfect movies..."}
              </LoadingText>
            </LoadingContent>
          </LoadingOverlay>
        )}
      </AnimatePresence>
    </RecommendationsContainer>
  );
}

export default Recommendations;
