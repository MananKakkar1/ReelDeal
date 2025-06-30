import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Section from '../components/common/Section';
import SectionTitle from '../components/common/SectionTitle';
import Spinner from '../components/common/Spinner';
import Card from '../components/common/Card';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:5000/api/tmdb';

const Poster = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 1.25rem;
  background: #23232b;
  box-shadow: 0 4px 32px rgba(6,182,212,0.10);
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 100%;
  @media (min-width: 900px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 3.5rem;
  }
`;

const CastList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CastItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
`;

const CastImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #23232b;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.7rem;
`;

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/movie/${id}`).then(res => res.json()),
      fetch(`${API_BASE}/movie/${id}/credits`).then(res => res.json()),
      fetch(`${API_BASE}/movie/${id}/videos`).then(res => res.json()),
      fetch(`${API_BASE}/movie/${id}/images`).then(res => res.json()),
    ]).then(([movieData, creditsData, videosData, imagesData]) => {
      setMovie(movieData);
      setCast(creditsData.cast ? creditsData.cast.slice(0, 10) : []);
      const trailerVid = (videosData.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
      setTrailer(trailerVid ? trailerVid.key : null);
      setPhotos(imagesData.backdrops ? imagesData.backdrops.slice(0, 8) : []);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading || !movie) return <Spinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Section>
        <Row>
          <Poster
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.png'}
            alt={movie.title}
          />
          <Info>
            <SectionTitle>{movie.title}</SectionTitle>
            <div style={{ color: '#06b6d4', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
              ⭐ {movie.vote_average} &nbsp; <span style={{ color: '#fff', fontWeight: 400, fontSize: '1rem' }}>({movie.vote_count} votes)</span>
            </div>
            <div style={{ color: '#aaa', marginBottom: 16 }}>Release Date: {movie.release_date}</div>
            <div style={{ marginBottom: 18 }}>{movie.overview}</div>
            <div style={{ marginBottom: 18 }}>
              <SectionTitle style={{ fontSize: '1.2rem', marginBottom: 8 }}>Cast</SectionTitle>
              <CastList>
                {cast.map(member => (
                  <CastItem key={member.cast_id}>
                    <CastImg src={member.profile_path ? `https://image.tmdb.org/t/p/w185${member.profile_path}` : '/placeholder.png'} alt={member.name} />
                    <span style={{ fontSize: 12, color: '#eee', marginTop: 4, textAlign: 'center' }}>{member.name}</span>
                  </CastItem>
                ))}
              </CastList>
            </div>
            {trailer && (
              <div style={{ marginBottom: 18 }}>
                <SectionTitle style={{ fontSize: '1.2rem', marginBottom: 8 }}>Trailer</SectionTitle>
                <div style={{ aspectRatio: '16/9', background: '#23232b', borderRadius: 12, overflow: 'hidden' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer}`}
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 0 }}
                  ></iframe>
                </div>
              </div>
            )}
          </Info>
        </Row>
      </Section>
      <Section>
        <SectionTitle>Photos</SectionTitle>
        <PhotoGrid>
          {photos.map(photo => (
            <img
              key={photo.file_path}
              src={`https://image.tmdb.org/t/p/w500${photo.file_path}`}
              alt="Movie still"
              style={{ borderRadius: 10, objectFit: 'cover', width: '100%', height: 90, background: '#23232b' }}
            />
          ))}
        </PhotoGrid>
      </Section>
    </motion.div>
  );
}

export default MovieDetails; 