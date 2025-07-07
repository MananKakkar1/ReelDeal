import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import Card from "./common/Card";
import { motion } from "framer-motion";
import { Star, Calendar, Bookmark } from "lucide-react";
import { moviesAPI } from "../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../stores/authStore";

const Poster = styled(motion.img)`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-top-left-radius: 1.25rem;
  border-top-right-radius: 1.25rem;
  background: rgba(148, 163, 184, 0.2);
`;

const CardContent = styled.div`
  padding: 1rem;

  @media (max-width: 640px) {
    padding: 0.875rem;
  }
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    font-size: 0.9rem;
    margin-bottom: 0.375rem;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #94a3b8;
  font-size: 0.875rem;

  @media (max-width: 640px) {
    gap: 0.5rem;
    font-size: 0.8rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #06b6d4;
  font-weight: 600;
`;

const YearItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #64748b;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
  height: 100%;
`;

const MovieCardContainer = styled(motion.div)`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const BookmarkButton = styled(motion.button)`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => (props.isBookmarked ? "#06b6d4" : "#94a3b8")};
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(6, 182, 212, 0.15);
    border-color: rgba(6, 182, 212, 0.4);
    color: #06b6d4;
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(6, 182, 212, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const BookmarkIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function MovieCard({ movie, onBookmark }) {
  const { isAuthenticated } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if movie is in user's watchlist when component mounts
    if (isAuthenticated && movie.userInteraction) {
      setIsBookmarked(movie.userInteraction.watchlist || false);
    }
  }, [isAuthenticated, movie.userInteraction]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).getFullYear();
  };

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to add movies to your watchlist");
      return;
    }

    setIsLoading(true);
    try {
      if (isBookmarked) {
        // Remove from watchlist
        await moviesAPI.rateMovie(movie.id, {
          watchlist: false,
        });
        setIsBookmarked(false);
        toast.success("Removed from watchlist");
      } else {
        // Add to watchlist, send full movie info
        await moviesAPI.rateMovie(movie.id, {
          watchlist: true,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          genres: movie.genres,
        });
        setIsBookmarked(true);
        toast.success("Added to watchlist");
      }
      if (onBookmark) onBookmark();
    } catch (error) {
      console.error("Error updating watchlist:", error);
      toast.error(
        isBookmarked
          ? "Failed to remove from watchlist"
          : "Failed to add to watchlist"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledLink to={`/movie/${movie.id}`}>
      <MovieCardContainer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.03,
          y: -5,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <Card>
          <Poster
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            whileHover={{ opacity: 0.95 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div
            style={{
              width: "100%",
              aspectRatio: "2/3",
              background: "rgba(148, 163, 184, 0.2)",
              borderTopLeftRadius: "1.25rem",
              borderTopRightRadius: "1.25rem",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              fontSize: "2rem",
            }}
          >
            🎬
          </div>

          {/* Bookmark Button */}
          <BookmarkButton
            onClick={handleBookmarkClick}
            disabled={isLoading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <BookmarkIcon>
              <Bookmark
                size={18}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </BookmarkIcon>
          </BookmarkButton>

          <CardContent>
            <Title>{movie.title}</Title>
            <InfoRow>
              {movie.vote_average > 0 && (
                <InfoItem>
                  <Star size={14} />
                  {movie.vote_average.toFixed(1)}
                </InfoItem>
              )}
              {movie.release_date && (
                <YearItem>
                  <Calendar size={14} />
                  {formatDate(movie.release_date)}
                </YearItem>
              )}
            </InfoRow>
          </CardContent>
        </Card>
      </MovieCardContainer>
    </StyledLink>
  );
}

export default MovieCard;
