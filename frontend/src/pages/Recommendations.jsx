import React, { useState } from 'react';
import Section from '../components/common/Section';
import SectionTitle from '../components/common/SectionTitle';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:5000/api/recommend';

function Recommendations() {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  const getRecommendation = () => {
    setLoading(true);
    setEmpty(false);
    fetch(API_BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      .then(res => res.json())
      .then(data => {
        if (data.movie) {
          setRecommendation(data.movie);
          setEmpty(false);
        } else {
          setRecommendation(null);
          setEmpty(true);
        }
      })
      .catch(() => {
        setRecommendation(null);
        setEmpty(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Section>
        <SectionTitle>Get a Movie Recommendation</SectionTitle>
        <Button onClick={getRecommendation} disabled={loading} style={{ marginBottom: 32 }}>
          Recommend Me a Movie
        </Button>
        {loading && <Spinner />}
        {recommendation && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
            <MovieCard movie={recommendation} />
          </motion.div>
        )}
        {empty && !loading && (
          <div style={{ textAlign: 'center', color: '#888', padding: '2rem 0', fontSize: '1.2rem' }}>
            No recommendation found. Try again!
          </div>
        )}
      </Section>
    </motion.div>
  );
}

export default Recommendations; 