import React from "react";
import styled from "@emotion/styled";
import MovieCard from "./MovieCard";

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
`;

function MovieList({
  movies,
  onBookmark,
  onRemove,
  onMarkAsWatched,
  emptyIcon,
  emptyTitle,
  emptyText,
}) {
  if (!movies || movies.length === 0) {
    return (
      <EmptyState>
        {emptyIcon && <EmptyIcon>{emptyIcon}</EmptyIcon>}
        {emptyTitle && <EmptyTitle>{emptyTitle}</EmptyTitle>}
        {emptyText && <EmptyText>{emptyText}</EmptyText>}
      </EmptyState>
    );
  }
  return (
    <MoviesGrid>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onBookmark={onBookmark}
          onRemove={onRemove}
          onMarkAsWatched={onMarkAsWatched}
        />
      ))}
    </MoviesGrid>
  );
}

export default MovieList;
