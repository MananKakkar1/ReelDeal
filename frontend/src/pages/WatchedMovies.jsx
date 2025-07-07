import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Star,
  Heart,
  Trash2,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Clock,
  TrendingUp,
  BookOpen,
  BarChart3,
  Edit,
  X,
} from "lucide-react";
import Section from "../components/common/Section";
import SectionTitle from "../components/common/SectionTitle";
import Spinner from "../components/common/Spinner";
import Card from "../components/common/Card";
import Pagination from "../components/common/Pagination";
import { usersAPI, moviesAPI } from "../services/api";
import toast from "react-hot-toast";

const WatchedContainer = styled.div`
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

const WatchedCard = styled(motion.div)`
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

const UserRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #10b981;
  font-weight: 600;
  font-size: 0.9rem;
`;

const WatchedDate = styled.div`
  color: #94a3b8;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
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

const ReviewText = styled.p`
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  font-style: italic;
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

// Edit Modal Styles
const ModalOverlay = styled(motion.div)`
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
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(148, 163, 184, 0.1);
    color: #e2e8f0;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: #e2e8f0;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.5rem;
  color: #e2e8f0;
  font-size: 1rem;
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.5rem;
  color: #e2e8f0;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
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

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.filled ? "#fbbf24" : "#64748b")};
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: #fbbf24;
    transform: scale(1.1);
  }
`;

const RatingValue = styled.span`
  color: #fbbf24;
  font-weight: 600;
  font-size: 1.1rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(148, 163, 184, 0.2);
    color: #e2e8f0;
  }
`;

function WatchedMovies() {
  const navigate = useNavigate();
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("watched");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [stats, setStats] = useState({
    totalMovies: 0,
    averageRating: 0,
    topGenres: [],
    totalHours: 0,
  });

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editForm, setEditForm] = useState({
    rating: 0,
    review: "",
    watchedDate: "",
    favorite: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWatchedMovies();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [watchedMovies]);

  const fetchWatchedMovies = async (page = 1) => {
    try {
      setLoading(true);
      const response = await usersAPI.getCurrentUserWatched({ page });
      const watchedData = response.data.data?.watched || [];
      const paginationData = response.data.data?.pagination || {};

      setWatchedMovies(watchedData);
      setTotalPages(paginationData.totalPages || 0);
      setTotalResults(paginationData.totalResults || 0);
    } catch (error) {
      console.error("Error fetching watched movies:", error);
      toast.error("Failed to load watched movies");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchWatchedMovies(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculateStats = () => {
    if (watchedMovies.length === 0) {
      setStats({
        totalMovies: 0,
        averageRating: 0,
        topGenres: [],
        totalHours: 0,
      });
      return;
    }

    const totalMovies = watchedMovies.length;
    const totalRating = watchedMovies.reduce(
      (sum, movie) => sum + (movie.userRating || 0),
      0
    );
    const averageRating = (totalRating / totalMovies).toFixed(1);

    const totalHours =
      watchedMovies.reduce((sum, movie) => sum + (movie.runtime || 0), 0) / 60;

    // Calculate top genres
    const genreCount = {};
    watchedMovies.forEach((movie) => {
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
      totalHours: Math.round(totalHours),
    });
  };

  const handleRemoveFromWatched = async (movieId) => {
    try {
      await moviesAPI.rateMovie(movieId, {
        watched: false,
        rating: 0,
        review: "",
      });

      setWatchedMovies(watchedMovies.filter((movie) => movie.id !== movieId));
      toast.success("Removed from watched list");
    } catch (error) {
      console.error("Error removing from watched:", error);
      toast.error("Failed to remove from watched list");
    }
  };

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setEditForm({
      rating: movie.userRating || 0,
      review: movie.review || "",
      watchedDate: movie.watchedDate
        ? new Date(movie.watchedDate).toISOString().split("T")[0]
        : "",
      favorite: movie.favorite || false,
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingMovie(null);
    setEditForm({
      rating: 0,
      review: "",
      watchedDate: "",
      favorite: false,
    });
  };

  const handleRatingChange = (newRating) => {
    setEditForm((prev) => ({ ...prev, rating: newRating }));
  };

  const handleFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingMovie) return;

    try {
      setSaving(true);

      // Update the movie with new information
      const updateData = {
        rating: editForm.rating > 0 ? editForm.rating : undefined,
        review: editForm.review.trim() || undefined,
        watchedDate: editForm.watchedDate
          ? new Date(editForm.watchedDate).toISOString()
          : undefined,
        favorite: editForm.favorite,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      await moviesAPI.rateMovie(editingMovie.id, updateData);

      // Update local state
      setWatchedMovies((prev) =>
        prev.map((movie) =>
          movie.id === editingMovie.id
            ? {
                ...movie,
                userRating: editForm.rating > 0 ? editForm.rating : undefined,
                review: editForm.review.trim() || undefined,
                watchedDate: editForm.watchedDate || undefined,
                favorite: editForm.favorite,
              }
            : movie
        )
      );

      toast.success("Movie updated successfully!");
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Failed to update movie");
    } finally {
      setSaving(false);
    }
  };

  const filteredAndSortedMovies = watchedMovies
    .filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "high-rated" && movie.userRating >= 4) ||
        (filter === "recent" &&
          new Date(movie.release_date).getFullYear() >= 2020) ||
        (filter === "classic" &&
          new Date(movie.release_date).getFullYear() < 2000) ||
        (filter === "favorites" && movie.favorite);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "rating":
          comparison = (b.userRating || 0) - (a.userRating || 0);
          break;
        case "year":
          comparison = new Date(b.release_date) - new Date(a.release_date);
          break;
        case "watched":
        default:
          comparison =
            new Date(b.watchedDate || 0) - new Date(a.watchedDate || 0);
          break;
      }

      return sortOrder === "desc" ? comparison : -comparison;
    });

  return (
    <WatchedContainer>
      <Header>
        <Title>Watched Movies</Title>
        <Subtitle>Track your movie journey and ratings</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Eye size={24} color="white" />
          </StatIcon>
          <StatNumber>{stats.totalMovies}</StatNumber>
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
            <Clock size={24} color="white" />
          </StatIcon>
          <StatNumber>{stats.totalHours}h</StatNumber>
          <StatLabel>Total Hours</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>
            <BarChart3 size={24} color="white" />
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
          <Calendar size={16} />
          Classics
        </FilterButton>
        <FilterButton
          className={filter === "favorites" ? "active" : ""}
          onClick={() => setFilter("favorites")}
        >
          <Heart size={16} />
          Favorites
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
          {sortBy === "watched" && "Watched"}
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
                <WatchedCard
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
                        {movie.userRating && (
                          <UserRating>
                            <Star size={14} fill="#10b981" />
                            {movie.userRating}/5
                          </UserRating>
                        )}
                      </MovieMeta>

                      {movie.watchedDate && (
                        <WatchedDate>
                          Watched:{" "}
                          {new Date(movie.watchedDate).toLocaleDateString()}
                        </WatchedDate>
                      )}

                      {movie.review && (
                        <ReviewText>"{movie.review}"</ReviewText>
                      )}

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
                        handleEditMovie(movie);
                      }}
                    >
                      <Edit size={16} />
                      Edit
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWatched(movie.id);
                      }}
                    >
                      <Trash2 size={16} />
                      Remove
                    </ActionButton>
                  </ActionButtons>
                </WatchedCard>
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
          <EmptyTitle>No watched movies yet</EmptyTitle>
          <EmptyText>
            {searchTerm || filter !== "all"
              ? "No movies match your current filters. Try adjusting your search or filters."
              : "Start watching movies and rating them to see your collection here. Browse movies and mark them as watched to build your history."}
          </EmptyText>
        </EmptyState>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalOpen && editingMovie && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseEditModal}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>Edit {editingMovie.title}</ModalTitle>
                <CloseButton onClick={handleCloseEditModal}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <FormGroup>
                <Label>Your Rating</Label>
                <RatingContainer>
                  <RatingStars>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarButton
                        key={star}
                        filled={star <= editForm.rating}
                        onClick={() => handleRatingChange(star)}
                      >
                        ★
                      </StarButton>
                    ))}
                  </RatingStars>
                  <RatingValue>{editForm.rating}/5</RatingValue>
                </RatingContainer>
              </FormGroup>

              <FormGroup>
                <Label>Watched Date</Label>
                <Input
                  type="date"
                  value={editForm.watchedDate}
                  onChange={(e) =>
                    handleFormChange("watchedDate", e.target.value)
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Review (Optional)</Label>
                <Textarea
                  placeholder="Share your thoughts about this movie..."
                  value={editForm.review}
                  onChange={(e) => handleFormChange("review", e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    checked={editForm.favorite}
                    onChange={(e) =>
                      handleFormChange("favorite", e.target.checked)
                    }
                    style={{ marginRight: "0.5rem" }}
                  />
                  Mark as Favorite
                </Label>
              </FormGroup>

              <ModalActions>
                <CancelButton onClick={handleCloseEditModal}>
                  Cancel
                </CancelButton>
                <SaveButton onClick={handleSaveEdit} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </SaveButton>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </WatchedContainer>
  );
}

export default WatchedMovies;
