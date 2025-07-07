import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Star,
  Eye,
  Trash2,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Clock,
  TrendingUp,
  Heart,
} from "lucide-react";
import Section from "../components/common/Section";
import SectionTitle from "../components/common/SectionTitle";
import Spinner from "../components/common/Spinner";
import Card from "../components/common/Card";
import Pagination from "../components/common/Pagination";
import { usersAPI, moviesAPI } from "../services/api";
import toast from "react-hot-toast";

const WatchlistContainer = styled.div`
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

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  color: #e2e8f0;
  font-size: 1rem;
  min-width: 250px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.className === "active"
      ? "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)"
      : "rgba(30, 41, 59, 0.5)"};
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  color: ${(props) => (props.className === "active" ? "white" : "#94a3b8")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
  }
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  color: #94a3b8;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
  }
`;

const WatchlistCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(6, 182, 212, 0.3);
    box-shadow: 0 12px 40px rgba(6, 182, 212, 0.15);
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
`;

const MovieInfo = styled.div`
  padding: 1.5rem;
`;

const MovieTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const MovieMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #fbbf24;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Year = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const GenreTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const GenreTag = styled.span`
  background: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: ${(props) =>
    props.variant === "danger"
      ? "rgba(239, 68, 68, 0.1)"
      : "rgba(6, 182, 212, 0.1)"};
  color: ${(props) => (props.variant === "danger" ? "#ef4444" : "#06b6d4")};
  border: 1px solid
    ${(props) =>
      props.variant === "danger"
        ? "rgba(239, 68, 68, 0.3)"
        : "rgba(6, 182, 212, 0.3)"};
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.variant === "danger"
        ? "rgba(239, 68, 68, 0.2)"
        : "rgba(6, 182, 212, 0.2)"};
    transform: translateY(-1px);
  }
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingContent = styled.div`
  text-align: center;
  color: #e2e8f0;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #94a3b8;
`;

function Watchlist() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("added");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [stats, setStats] = useState({
    totalMovies: 0,
    averageRating: 0,
    topGenres: [],
  });

  useEffect(() => {
    fetchWatchlist();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [watchlist]);

  const fetchWatchlist = async (page = 1) => {
    try {
      setLoading(true);
      const response = await usersAPI.getCurrentUserWatchlist({ page });
      const watchlistData = response.data.data || [];
      const paginationData = response.data.data?.pagination || {};

      setWatchlist(watchlistData);
      setTotalPages(paginationData.totalPages || 0);
      setTotalResults(paginationData.totalResults || 0);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      toast.error("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchWatchlist(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculateStats = () => {
    if (watchlist.length === 0) {
      setStats({
        totalMovies: 0,
        averageRating: 0,
        topGenres: [],
      });
      return;
    }

    const totalMovies = watchlist.length;
    const totalRating = watchlist.reduce(
      (sum, movie) => sum + (movie.vote_average || 0),
      0
    );
    const averageRating = (totalRating / totalMovies).toFixed(1);

    // Calculate top genres
    const genreCount = {};
    watchlist.forEach((movie) => {
      if (movie.genres) {
        movie.genres.forEach((genre) => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });

    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    setStats({
      totalMovies,
      averageRating,
      topGenres,
    });
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await moviesAPI.rateMovie(movieId, {
        watchlist: false,
      });

      setWatchlist(watchlist.filter((movie) => movie.id !== movieId));
      toast.success("Removed from watchlist");
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      toast.error("Failed to remove from watchlist");
    }
  };

  const handleMarkAsWatched = async (movieId) => {
    try {
      await moviesAPI.rateMovie(movieId, {
        watched: true,
        watchlist: false,
      });

      setWatchlist(watchlist.filter((movie) => movie.id !== movieId));
      toast.success("Marked as watched and removed from watchlist");
    } catch (error) {
      console.error("Error marking as watched:", error);
      toast.error("Failed to mark as watched");
    }
  };

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const filteredAndSortedMovies = watchlist
    .filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "high-rated" && movie.vote_average >= 8) ||
        (filter === "recent" &&
          new Date(movie.release_date).getFullYear() >= 2020) ||
        (filter === "classic" &&
          new Date(movie.release_date).getFullYear() < 2000);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "rating":
          comparison = (b.vote_average || 0) - (a.vote_average || 0);
          break;
        case "year":
          comparison = new Date(b.release_date) - new Date(a.release_date);
          break;
        case "added":
        default:
          comparison = new Date(b.addedDate || 0) - new Date(a.addedDate || 0);
          break;
      }

      return sortOrder === "desc" ? comparison : -comparison;
    });

  return (
    <WatchlistContainer>
      <Header>
        <Title>My Watchlist</Title>
        <Subtitle>Movies you've saved to watch later</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Bookmark size={24} color="white" />
          </StatIcon>
          <StatNumber>{stats.totalMovies}</StatNumber>
          <StatLabel>Movies in Watchlist</StatLabel>
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
          <StatNumber>{stats.topGenres.length}</StatNumber>
          <StatLabel>Top Genres</StatLabel>
        </StatCard>
      </StatsGrid>

      {stats.topGenres.length > 0 && (
        <Section>
          <SectionTitle>Your Top Genres</SectionTitle>
          <GenreTags>
            {stats.topGenres.map((genre) => (
              <GenreTag key={genre}>{genre}</GenreTag>
            ))}
          </GenreTags>
        </Section>
      )}

      <Controls>
        <SearchInput
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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

        <SortButton
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
        >
          {sortOrder === "desc" ? (
            <SortDesc size={16} />
          ) : (
            <SortAsc size={16} />
          )}
          {sortBy === "title" && "Title"}
          {sortBy === "rating" && "Rating"}
          {sortBy === "year" && "Year"}
          {sortBy === "added" && "Added"}
        </SortButton>
      </Controls>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <Spinner />
        </div>
      ) : filteredAndSortedMovies.length > 0 ? (
        <>
          <MoviesGrid>
            <AnimatePresence>
              {filteredAndSortedMovies.map((movie, index) => (
                <WatchlistCard
                  key={movie.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div onClick={() => handleMovieClick(movie)}>
                    <MoviePoster
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      onError={(e) => {
                        e.target.src = "/placeholder-poster.jpg";
                      }}
                    />
                    <MovieInfo>
                      <MovieTitle>{movie.title}</MovieTitle>

                      <MovieMeta>
                        <Rating>
                          <Star size={14} fill="#fbbf24" />
                          {movie.vote_average?.toFixed(1) || "N/A"}
                        </Rating>
                        <Year>
                          {new Date(movie.release_date).getFullYear()}
                        </Year>
                      </MovieMeta>

                      <GenreTags>
                        {movie.genres?.slice(0, 2).map((genre) => (
                          <GenreTag key={genre}>{genre}</GenreTag>
                        ))}
                      </GenreTags>
                    </MovieInfo>
                  </div>

                  <ActionButtons>
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsWatched(movie.id);
                      }}
                    >
                      <Eye size={16} />
                      Mark Watched
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWatchlist(movie.id);
                      }}
                    >
                      <Trash2 size={16} />
                      Remove
                    </ActionButton>
                  </ActionButtons>
                </WatchlistCard>
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
          <EmptyIcon>📝</EmptyIcon>
          <EmptyTitle>Your watchlist is empty</EmptyTitle>
          <EmptyText>
            {searchTerm || filter !== "all"
              ? "No movies match your current filters. Try adjusting your search or filters."
              : "Start adding movies to your watchlist to see them here. Browse movies and click the bookmark icon to add them."}
          </EmptyText>
        </EmptyState>
      )}
    </WatchlistContainer>
  );
}

export default Watchlist;
