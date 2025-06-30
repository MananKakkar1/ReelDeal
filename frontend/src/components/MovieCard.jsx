import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Card from './common/Card';
import { motion } from 'framer-motion';

const Poster = styled(motion.img)`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-top-left-radius: 1.25rem;
  border-top-right-radius: 1.25rem;
  background: #23232b;
`;

const CardContent = styled.div`
  padding: 1rem 1.2rem 1.2rem 1.2rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #06b6d4;
  font-weight: 600;
  font-size: 0.95rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

function MovieCard({ movie }) {
  return (
    <StyledLink to={`/movie/${movie.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(6,182,212,0.18)' }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      >
        <Card>
          <Poster
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.png'}
            alt={movie.title}
            whileHover={{ opacity: 0.92 }}
            transition={{ duration: 0.2 }}
          />
          <CardContent>
            <Title>{movie.title}</Title>
            <InfoRow>
              <span>⭐ {movie.vote_average}</span>
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
            </InfoRow>
          </CardContent>
        </Card>
      </motion.div>
    </StyledLink>
  );
}

export default MovieCard; 