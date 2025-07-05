import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import Section from "../components/common/Section";
import SectionTitle from "../components/common/SectionTitle";
import Spinner from "../components/common/Spinner";
import Card from "../components/common/Card";
import { moviesAPI } from "../services/api";
import { motion } from "framer-motion";
import {
  Star,
  Calendar,
  Clock,
  Users,
  Sparkles,
  Bookmark,
  Eye,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../stores/authStore";

const MovieContainer = styled.div`
  width: 100%;
  padding: 1rem;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const Poster = styled.img`
  width: 100%;
  max-width: 300px;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  box-shadow: 0 8px 32px rgba(6, 182, 212, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 40px rgba(6, 182, 212, 0.25);
  }

  @media (max-width: 640px) {
    max-width: 250px;
    margin: 0 auto;
    display: block;
  }
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  @media (min-width: 900px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 3.5rem;
  }
`;

const MovieHeader = styled.div`
  margin-bottom: 2rem;
`;

const MovieTitle = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 1rem;
  line-height: 1.1;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`;

const MovieMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  align-items: center;

  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`;

const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1f2937;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.3);

  @media (max-width: 640px) {
    font-size: 0.8rem;
    padding: 0.375rem 0.875rem;
  }
`;

const MetaInfo = styled.div`
  color: #94a3b8;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 0.9rem;

  @media (max-width: 640px) {
    font-size: 0.8rem;
    padding: 0.375rem 0.875rem;
  }
`;

const Overview = styled.p`
  color: #e2e8f0;
  line-height: 1.7;
  font-size: 1rem;
  margin-bottom: 2rem;
  background: rgba(30, 41, 59, 0.3);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.1);

  @media (max-width: 640px) {
    font-size: 0.95rem;
    padding: 1rem;
    line-height: 1.6;
  }
`;

const CastList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 0.75rem;
  }
`;

const CastItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CastImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 3px solid rgba(6, 182, 212, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

  @media (max-width: 640px) {
    width: 50px;
    height: 50px;
  }
`;

const CastName = styled.span`
  font-size: 0.75rem;
  color: #e2e8f0;
  margin-top: 0.5rem;
  text-align: center;
  font-weight: 500;
  line-height: 1.2;

  @media (max-width: 640px) {
    font-size: 0.7rem;
    margin-top: 0.375rem;
  }
`;

const TrailerContainer = styled.div`
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(148, 163, 184, 0.1);
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const PhotoItem = styled(motion.img)`
  border-radius: 1rem;
  object-fit: cover;
  width: 100%;
  height: 100px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (min-width: 640px) {
    height: 120px;
  }
`;

const GenreTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    gap: 0.375rem;
  }
`;

const GenreTag = styled.span`
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);

  @media (max-width: 640px) {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.1);

  @media (max-width: 640px) {
    padding: 0.75rem;
  }
`;

const StatIcon = styled.div`
  color: #06b6d4;
  display: flex;
  align-items: center;
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.span`
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.9rem;

  @media (max-width: 640px) {
    font-size: 0.8rem;
  }
`;

const StatLabel = styled.span`
  color: #94a3b8;
  font-size: 0.75rem;

  @media (max-width: 640px) {
    font-size: 0.7rem;
  }
`;

const SurpriseButton = styled.button`
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
  margin: 2rem auto 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 0.75rem;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.variant === "primary"
      ? "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)"
      : "rgba(30, 41, 59, 0.5)"};
  color: ${(props) => (props.variant === "primary" ? "white" : "#94a3b8")};
  border: 1px solid
    ${(props) =>
      props.variant === "primary" ? "transparent" : "rgba(148, 163, 184, 0.2)"};
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.variant === "primary"
        ? "0 8px 25px rgba(6, 182, 212, 0.3)"
        : "0 8px 25px rgba(148, 163, 184, 0.2)"};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 640px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.8rem;
  }
`;

function MovieDetails() {
  const { movieId } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInteraction, setUserInteraction] = useState({
    watchlist: false,
    watched: false,
    favorite: false,
    rating: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    console.log("Fetching movie details for ID:", movieId);

    Promise.all([
      moviesAPI.getDetails(movieId),
      moviesAPI.getCredits(movieId),
      moviesAPI.getVideos(movieId),
    ])
      .then(([movieRes, creditsRes, videosRes]) => {
        console.log("Movie response:", movieRes);
        console.log("Credits response:", creditsRes);
        console.log("Videos response:", videosRes);

        if (movieRes.data.success && movieRes.data.data.movie) {
          const movieData = movieRes.data.data.movie;
          setMovie(movieData);

          // Set user interaction state if available
          if (movieData.userInteraction) {
            setUserInteraction({
              watchlist: movieData.userInteraction.watchlist || false,
              watched: movieData.userInteraction.watched || false,
              favorite: movieData.userInteraction.favorite || false,
              rating: movieData.userInteraction.rating || 0,
            });
          }
        } else {
          console.error("Invalid movie response structure:", movieRes);
          setMovie(null);
        }

        if (creditsRes.data.success && creditsRes.data.data.cast) {
          setCast(creditsRes.data.data.cast.slice(0, 12));
        } else {
          console.error("Invalid credits response structure:", creditsRes);
          setCast([]);
        }

        if (videosRes.data.success && videosRes.data.data.videos) {
          const trailerVideo = videosRes.data.data.videos.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          setTrailer(trailerVideo);
        } else {
          console.error("Invalid videos response structure:", videosRes);
          setTrailer(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        console.error("Error response:", error.response);
        setMovie(null);
        setCast([]);
        setTrailer(null);
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spinner />
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
        Movie not found
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleSurpriseMe = () => {
    // Navigate to recommendations page for personalized suggestions
    navigate("/recommendations");
  };

  const handleAction = async (action, value) => {
    if (!isAuthenticated) {
      toast.error("Please log in to use this feature");
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {};
      updateData[action] = value;

      await moviesAPI.rateMovie(movieId, updateData);

      setUserInteraction((prev) => ({
        ...prev,
        [action]: value,
      }));

      const actionMessages = {
        watchlist: value ? "Added to watchlist" : "Removed from watchlist",
        watched: value ? "Marked as watched" : "Removed from watched",
        favorite: value ? "Added to favorites" : "Removed from favorites",
      };

      toast.success(actionMessages[action]);
    } catch (error) {
      console.error(`Error updating ${action}:`, error);
      toast.error(`Failed to update ${action}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MovieContainer>
      <Row>
        <Poster
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <Info>
          <MovieHeader>
            <MovieTitle>{movie.title}</MovieTitle>

            <MovieMeta>
              {movie.vote_average > 0 && (
                <RatingBadge>
                  <Star size={16} />
                  {movie.vote_average.toFixed(1)}
                </RatingBadge>
              )}
              {movie.release_date && (
                <MetaInfo>
                  <Calendar size={14} />
                  {formatDate(movie.release_date)}
                </MetaInfo>
              )}
              {movie.runtime && (
                <MetaInfo>
                  <Clock size={14} />
                  {formatRuntime(movie.runtime)}
                </MetaInfo>
              )}
              {movie.vote_count > 0 && (
                <MetaInfo>
                  <Users size={14} />
                  {movie.vote_count.toLocaleString()} votes
                </MetaInfo>
              )}
            </MovieMeta>

            <GenreTags>
              {movie.genres?.map((genre) => (
                <GenreTag key={genre.id}>{genre.name}</GenreTag>
              ))}
            </GenreTags>

            <StatsGrid>
              {movie.budget > 0 && (
                <StatItem>
                  <StatIcon>
                    <span>💰</span>
                  </StatIcon>
                  <StatContent>
                    <StatValue>
                      ${(movie.budget / 1000000).toFixed(1)}M
                    </StatValue>
                    <StatLabel>Budget</StatLabel>
                  </StatContent>
                </StatItem>
              )}
              {movie.revenue > 0 && (
                <StatItem>
                  <StatIcon>
                    <span>📈</span>
                  </StatIcon>
                  <StatContent>
                    <StatValue>
                      ${(movie.revenue / 1000000).toFixed(1)}M
                    </StatValue>
                    <StatLabel>Revenue</StatLabel>
                  </StatContent>
                </StatItem>
              )}
              {movie.popularity && (
                <StatItem>
                  <StatIcon>
                    <span>🔥</span>
                  </StatIcon>
                  <StatContent>
                    <StatValue>{movie.popularity.toFixed(0)}</StatValue>
                    <StatLabel>Popularity</StatLabel>
                  </StatContent>
                </StatItem>
              )}
              {movie.status && (
                <StatItem>
                  <StatIcon>
                    <span>📺</span>
                  </StatIcon>
                  <StatContent>
                    <StatValue>{movie.status}</StatValue>
                    <StatLabel>Status</StatLabel>
                  </StatContent>
                </StatItem>
              )}
            </StatsGrid>

            {movie.overview && <Overview>{movie.overview}</Overview>}

            {/* Action Buttons */}
            <ActionButtons>
              <ActionButton
                variant={userInteraction.watchlist ? "primary" : "secondary"}
                onClick={() =>
                  handleAction("watchlist", !userInteraction.watchlist)
                }
                disabled={isLoading}
              >
                {userInteraction.watchlist ? (
                  <>
                    <Bookmark size={16} fill="currentColor" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    Add to Watchlist
                  </>
                )}
              </ActionButton>

              <ActionButton
                variant={userInteraction.watched ? "primary" : "secondary"}
                onClick={() =>
                  handleAction("watched", !userInteraction.watched)
                }
                disabled={isLoading}
              >
                {userInteraction.watched ? (
                  <>
                    <Eye size={16} />
                    Watched
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    Mark as Watched
                  </>
                )}
              </ActionButton>

              <ActionButton
                variant={userInteraction.favorite ? "primary" : "secondary"}
                onClick={() =>
                  handleAction("favorite", !userInteraction.favorite)
                }
                disabled={isLoading}
              >
                {userInteraction.favorite ? (
                  <>
                    <Heart size={16} fill="currentColor" />
                    Favorited
                  </>
                ) : (
                  <>
                    <Heart size={16} />
                    Add to Favorites
                  </>
                )}
              </ActionButton>
            </ActionButtons>
          </MovieHeader>
        </Info>
      </Row>

      {cast.length > 0 && (
        <Section>
          <SectionTitle>Cast</SectionTitle>
          <CastList>
            {cast.map((person) => (
              <CastItem key={person.id} whileHover={{ scale: 1.05 }}>
                <CastImg
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                      : "/placeholder-avatar.png"
                  }
                  alt={person.name}
                />
                <CastName>{person.name}</CastName>
              </CastItem>
            ))}
          </CastList>
        </Section>
      )}

      {trailer && (
        <Section>
          <SectionTitle>Trailer</SectionTitle>
          <TrailerContainer>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </TrailerContainer>
        </Section>
      )}

      <Section>
        <SurpriseButton onClick={handleSurpriseMe}>
          <Sparkles size={20} />
          Find Similar Movies
        </SurpriseButton>
      </Section>
    </MovieContainer>
  );
}

export default MovieDetails;
