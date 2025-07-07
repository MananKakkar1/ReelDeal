const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateMovieRating, validateSearch, validateMovieId } = require('../middleware/validation');

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Check if TMDB API key is configured
if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
  console.error('❌ TMDB_API_KEY is not configured! Please set it in your .env file.');
  console.error('   Get your API key from: https://www.themoviedb.org/settings/api');
}

// Helper function to fetch movie from TMDB
const fetchMovieFromTMDB = async (movieId) => {
  try {
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
      throw new Error('TMDB API key is not configured');
    }
    
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits,videos,images,similar,recommendations'
      }
    });
    return response.data;
  } catch (error) {
    if (error.message === 'TMDB API key is not configured') {
      throw new Error('TMDB API key is not configured. Please set TMDB_API_KEY in your .env file');
    }
    if (error.response?.status === 404) {
      throw new Error('Movie not found');
    }
    if (error.response?.status === 401) {
      throw new Error('Invalid TMDB API key');
    }
    throw new Error(`Failed to fetch movie: ${error.message}`);
  }
};

// Helper function to save/update movie in database
const saveMovieToDB = async (tmdbMovie) => {
  const movieData = {
    tmdbId: tmdbMovie.id,
    title: tmdbMovie.title,
    originalTitle: tmdbMovie.original_title,
    overview: tmdbMovie.overview,
    posterPath: tmdbMovie.poster_path,
    backdropPath: tmdbMovie.backdrop_path,
    releaseDate: tmdbMovie.release_date,
    runtime: tmdbMovie.runtime,
    genres: tmdbMovie.genres?.map(g => g.name) || [],
    language: tmdbMovie.original_language,
    voteAverage: tmdbMovie.vote_average,
    voteCount: tmdbMovie.vote_count,
    popularity: tmdbMovie.popularity,
    budget: tmdbMovie.budget,
    revenue: tmdbMovie.revenue,
    status: tmdbMovie.status,
    tagline: tmdbMovie.tagline,
    productionCompanies: tmdbMovie.production_companies?.map(c => c.name) || [],
    productionCountries: tmdbMovie.production_countries?.map(c => c.name) || [],
    spokenLanguages: tmdbMovie.spoken_languages?.map(l => l.name) || [],
    homepage: tmdbMovie.homepage,
    imdbId: tmdbMovie.imdb_id
  };

  let movie = await Movie.findOne({ tmdbId: tmdbMovie.id });
  if (movie) {
    Object.assign(movie, movieData);
  } else {
    movie = new Movie(movieData);
  }
  
  await movie.save();
  return movie;
};

// Get trending movies
router.get('/trending', optionalAuth, async (req, res) => {
  try {
    // Check if TMDB API key is configured
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
      return res.status(500).json({
        success: false,
        message: 'TMDB API key is not configured. Please set TMDB_API_KEY in your .env file'
      });
    }
    
    const { time_window = 'week', page = 1 } = req.query;
    
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/${time_window}`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    const movies = response.data.results;
    
    // Add user interaction data if authenticated
    if (req.user) {
      const movieIds = movies.map(m => m.id);
      const userMovies = await Movie.find({
        tmdbId: { $in: movieIds },
        'userRatings.user': req.user._id
      });

      movies.forEach(movie => {
        const userMovie = userMovies.find(um => um.tmdbId === movie.id);
        if (userMovie) {
          const userRating = userMovie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
          movie.userInteraction = {
            rating: userRating?.rating,
            watched: userRating?.watched,
            watchlist: userRating?.watchlist,
            favorite: userRating?.favorite
          };
        }
      });
    }

    res.json({
      success: true,
      data: {
        movies,
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results
      }
    });
  } catch (error) {
    console.error('Trending movies error:', error);
    
    if (error.response?.status === 401) {
      res.status(500).json({
        success: false,
        message: 'Invalid TMDB API key'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trending movies'
      });
    }
  }
});

// Get popular movies
router.get('/popular', optionalAuth, async (req, res) => {
  try {
    // Check if TMDB API key is configured
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
      return res.status(500).json({
        success: false,
        message: 'TMDB API key is not configured. Please set TMDB_API_KEY in your .env file'
      });
    }
    
    const { page = 1 } = req.query;
    
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    const movies = response.data.results;
    
    // Add user interaction data if authenticated
    if (req.user) {
      const movieIds = movies.map(m => m.id);
      const userMovies = await Movie.find({
        tmdbId: { $in: movieIds },
        'userRatings.user': req.user._id
      });

      movies.forEach(movie => {
        const userMovie = userMovies.find(um => um.tmdbId === movie.id);
        if (userMovie) {
          const userRating = userMovie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
          movie.userInteraction = {
            rating: userRating?.rating,
            watched: userRating?.watched,
            watchlist: userRating?.watchlist,
            favorite: userRating?.favorite
          };
        }
      });
    }

    res.json({
      success: true,
      data: {
        movies,
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results
      }
    });
  } catch (error) {
    console.error('Popular movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular movies'
    });
  }
});

// Get top rated movies
router.get('/top-rated', optionalAuth, async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    const movies = response.data.results;
    
    // Add user interaction data if authenticated
    if (req.user) {
      const movieIds = movies.map(m => m.id);
      const userMovies = await Movie.find({
        tmdbId: { $in: movieIds },
        'userRatings.user': req.user._id
      });

      movies.forEach(movie => {
        const userMovie = userMovies.find(um => um.tmdbId === movie.id);
        if (userMovie) {
          const userRating = userMovie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
          movie.userInteraction = {
            rating: userRating?.rating,
            watched: userRating?.watched,
            watchlist: userRating?.watchlist,
            favorite: userRating?.favorite
          };
        }
      });
    }

    res.json({
      success: true,
      data: {
        movies,
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results
      }
    });
  } catch (error) {
    console.error('Top rated movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top rated movies'
    });
  }
});

// Get upcoming movies
router.get('/upcoming', optionalAuth, async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    const movies = response.data.results;
    
    // Add user interaction data if authenticated
    if (req.user) {
      const movieIds = movies.map(m => m.id);
      const userMovies = await Movie.find({
        tmdbId: { $in: movieIds },
        'userRatings.user': req.user._id
      });

      movies.forEach(movie => {
        const userMovie = userMovies.find(um => um.tmdbId === movie.id);
        if (userMovie) {
          const userRating = userMovie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
          movie.userInteraction = {
            rating: userRating?.rating,
            watched: userRating?.watched,
            watchlist: userRating?.watchlist,
            favorite: userRating?.favorite
          };
        }
      });
    }

    res.json({
      success: true,
      data: {
        movies,
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results
      }
    });
  } catch (error) {
    console.error('Upcoming movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming movies'
    });
  }
});

// Get all movies with pagination
router.get('/all', optionalAuth, async (req, res) => {
  try {
    // Check if TMDB API key is configured
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
      return res.status(500).json({
        success: false,
        message: 'TMDB API key is not configured. Please set TMDB_API_KEY in your .env file'
      });
    }
    
    const { 
      page = 1, 
      sort_by = 'popularity.desc',
      year,
      rating,
      genre,
      include_adult = false 
    } = req.query;
    
    // Build TMDB discover parameters
    const discoverParams = {
      api_key: TMDB_API_KEY,
      page,
      sort_by,
      include_adult
    };

    // Add filters if provided
    if (year) {
      discoverParams.primary_release_year = year;
    }
    if (rating) {
      discoverParams['vote_average.gte'] = rating.replace('+', '');
    }
    if (genre) {
      discoverParams.with_genres = genre;
    }

    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: discoverParams
    });

    const movies = response.data.results;
    
    // Add user interaction data if authenticated
    if (req.user) {
      const movieIds = movies.map(m => m.id);
      const userMovies = await Movie.find({
        tmdbId: { $in: movieIds },
        'userRatings.user': req.user._id
      });

      movies.forEach(movie => {
        const userMovie = userMovies.find(um => um.tmdbId === movie.id);
        if (userMovie) {
          const userRating = userMovie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
          movie.userInteraction = {
            rating: userRating?.rating,
            watched: userRating?.watched,
            watchlist: userRating?.watchlist,
            favorite: userRating?.favorite
          };
        }
      });
    }

    res.json({
      success: true,
      data: {
        movies,
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results
      }
    });
  } catch (error) {
    console.error('Get all movies error:', error);
    
    if (error.response?.status === 401) {
      res.status(500).json({
        success: false,
        message: 'Invalid TMDB API key'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch movies'
      });
    }
  }
});

// Search movies
router.get('/search', validateSearch, optionalAuth, async (req, res) => {
  try {
    const { query, page = 1, include_adult = false, sort_by, year, rating, genre } = req.query;
    
    // If no query provided, return all movies (same as /all endpoint)
    if (!query || !query.trim()) {
      // Build TMDB discover parameters
      const discoverParams = {
        api_key: TMDB_API_KEY,
        page,
        sort_by: sort_by || 'popularity.desc',
        include_adult
      };

      // Add filters if provided
      if (year) {
        discoverParams.primary_release_year = year;
      }
      if (rating) {
        discoverParams['vote_average.gte'] = rating.replace('+', '');
      }
      if (genre) {
        discoverParams.with_genres = genre;
      }

      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: discoverParams
      });

      const movies = response.data.results;
      
      // Add user interaction data if authenticated
      if (req.user) {
        const movieIds = movies.map(m => m.id);
        const userMovies = await Movie.find({
          tmdbId: { $in: movieIds },
          'userRatings.user': req.user._id
        });

        movies.forEach(movie => {
          const userMovie = userMovies.find(um => um.tmdbId === movie.id);
          if (userMovie) {
            const userRating = userMovie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
            movie.userInteraction = {
              rating: userRating?.rating,
              watched: userRating?.watched,
              watchlist: userRating?.watchlist,
              favorite: userRating?.favorite
            };
          }
        });
      }

      return res.json({
        success: true,
        data: {
          movies,
          page: response.data.page,
          totalPages: response.data.total_pages,
          totalResults: response.data.total_results
        }
      });
    }

    // If query provided, perform search
    const searchParams = {
      api_key: TMDB_API_KEY,
      query,
      page,
      include_adult
    };

    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: searchParams
    });

    const movies = response.data.results;
    
    // Add user interaction data if authenticated
    if (req.user) {
      const movieIds = movies.map(m => m.id);
      const userMovies = await Movie.find({
        tmdbId: { $in: movieIds },
        'userRatings.user': req.user._id
      });

      movies.forEach(movie => {
        const userMovie = userMovies.find(um => um.tmdbId === movie.id);
        if (userMovie) {
          const userRating = userMovie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
          movie.userInteraction = {
            rating: userRating?.rating,
            watched: userRating?.watched,
            watchlist: userRating?.watchlist,
            favorite: userRating?.favorite
          };
        }
      });
    }

    res.json({
      success: true,
      data: {
        movies,
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results
      }
    });
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search movies'
    });
  }
});

// Get movie genres
router.get('/genres', async (req, res) => {
  try {
    // Check if TMDB API key is configured
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
      return res.status(500).json({
        success: false,
        message: 'TMDB API key is not configured. Please set TMDB_API_KEY in your .env file'
      });
    }
    
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });

    res.json({
      success: true,
      data: {
        genres: response.data.genres
      }
    });
  } catch (error) {
    console.error('Genres error:', error);
    
    if (error.response?.status === 401) {
      res.status(500).json({
        success: false,
        message: 'Invalid TMDB API key'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch genres'
      });
    }
  }
});

// Get movie details
router.get('/:movieId', validateMovieId, optionalAuth, async (req, res) => {
  try {
    const { movieId } = req.params;
    
    // Check if TMDB API key is configured
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
      return res.status(500).json({
        success: false,
        message: 'TMDB API key is not configured. Please set TMDB_API_KEY in your .env file'
      });
    }
    
    // Fetch from TMDB
    const tmdbMovie = await fetchMovieFromTMDB(movieId);
    
    // Save/update in database
    const movie = await saveMovieToDB(tmdbMovie);
    
    // Get user interaction if authenticated
    let userInteraction = null;
    if (req.user) {
      const userRating = movie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
      if (userRating) {
        userInteraction = {
          rating: userRating.rating,
          review: userRating.review,
          watched: userRating.watched,
          watchlist: userRating.watchlist,
          favorite: userRating.favorite,
          watchedDate: userRating.watchedDate
        };
      }
    }

    // Get recent reviews
    const reviews = await Review.find({ tmdbId: parseInt(movieId) })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        movie: {
          ...tmdbMovie,
          userInteraction,
          reviews: reviews.length > 0 ? reviews : [],
          stats: movie.stats
        }
      }
    });
  } catch (error) {
    console.error('Movie details error:', error);
    
    if (error.message.includes('TMDB API key')) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    } else if (error.message.includes('Movie not found')) {
      res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch movie details'
      });
    }
  }
});

// Rate/Review movie
router.post('/:movieId/rate', authenticateToken, validateMovieRating, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, review, watched, watchlist, favorite, watchedDate, title, poster_path, release_date, vote_average, genres } = req.body;

    console.log('Rate movie request:', { movieId, rating, review, watched, watchlist, favorite });

    // Try to fetch movie from TMDB, fallback to request body
    let tmdbMovie;
    try {
      tmdbMovie = await fetchMovieFromTMDB(movieId);
    } catch (error) {
      console.error('Error fetching movie from TMDB:', error);
      // Fallback: use movie info from request body
      if (title && poster_path && release_date) {
        tmdbMovie = {
          id: parseInt(movieId),
          title,
          original_title: title,
          overview: '',
          poster_path,
          backdrop_path: '',
          release_date,
          runtime: 0,
          genres: (genres || []).map(g => ({ name: g })),
          original_language: 'en',
          vote_average: vote_average || 0,
          vote_count: 0,
          popularity: 0,
          budget: 0,
          revenue: 0,
          status: 'Released',
          tagline: '',
          production_companies: [],
          production_countries: [],
          spoken_languages: [],
          homepage: '',
          imdb_id: ''
        };
      } else {
        return res.status(404).json({
          success: false,
          message: 'Movie not found in TMDB and insufficient data provided.'
        });
      }
    }

    let movie;
    try {
      movie = await saveMovieToDB(tmdbMovie);
    } catch (error) {
      console.error('Error saving movie to DB:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to save movie to database'
      });
    }

    // Find existing user rating
    const existingRatingIndex = movie.userRatings.findIndex(
      ur => ur.user.toString() === req.user._id.toString()
    );

    const ratingData = {
      user: req.user._id,
      rating: rating || 0,
      review: review || '',
      watched: watched || false,
      watchlist: watchlist || false,
      favorite: favorite || false,
      watchedDate: watchedDate ? new Date(watchedDate) : (watched ? new Date() : null)
    };

    if (existingRatingIndex > -1) {
      // Update existing rating
      movie.userRatings[existingRatingIndex] = {
        ...movie.userRatings[existingRatingIndex],
        ...ratingData
      };
    } else {
      // Add new rating
      movie.userRatings.push(ratingData);
    }

    try {
      await movie.save();
      console.log('Movie saved successfully');
    } catch (error) {
      console.error('Error saving movie with user rating:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to save user rating'
      });
    }

    // Create/update review if review text is provided AND rating is provided
    if (review && review.trim() && rating && rating > 0) {
      try {
        const existingReview = await Review.findOne({
          user: req.user._id,
          tmdbId: parseInt(movieId)
        });

        if (existingReview) {
          existingReview.rating = rating;
          existingReview.review = review;
          existingReview.isEdited = true;
          existingReview.editedAt = new Date();
          await existingReview.save();
        } else {
          await Review.create({
            user: req.user._id,
            movie: movie._id,
            tmdbId: parseInt(movieId),
            rating: rating,
            review
          });
        }
        console.log('Review saved successfully');
      } catch (error) {
        console.error('Error saving review:', error);
        // Don't fail the entire request if review saving fails
      }
    }

    res.json({
      success: true,
      message: 'Movie rated successfully',
      data: {
        rating: ratingData
      }
    });
  } catch (error) {
    console.error('Rate movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate movie'
    });
  }
});

// Get movie recommendations
router.get('/:movieId/recommendations', optionalAuth, async (req, res) => {
  try {
    // Check if TMDB API key is configured
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
      return res.status(500).json({
        success: false,
        message: 'TMDB API key is not configured. Please set TMDB_API_KEY in your .env file'
      });
    }
    
    const { movieId } = req.params;
    const { page = 1 } = req.query;

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/recommendations`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    const movies = response.data.results;
    
    // Add user interaction data if authenticated
    if (req.user) {
      const movieIds = movies.map(m => m.id);
      const userMovies = await Movie.find({
        tmdbId: { $in: movieIds },
        'userRatings.user': req.user._id
      });

      movies.forEach(movie => {
        const userMovie = userMovies.find(um => um.tmdbId === movie.id);
        if (userMovie) {
          const userRating = userMovie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
          movie.userInteraction = {
            rating: userRating?.rating,
            watched: userRating?.watched,
            watchlist: userRating?.watchlist,
            favorite: userRating?.favorite
          };
        }
      });
    }

    res.json({
      success: true,
      data: {
        movies,
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results
      }
    });
  } catch (error) {
    console.error('Movie recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations'
    });
  }
});

// Get movie credits
router.get('/:movieId/credits', validateMovieId, async (req, res) => {
  try {
    // Check if TMDB API key is configured
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
      return res.status(500).json({
        success: false,
        message: 'TMDB API key is not configured. Please set TMDB_API_KEY in your .env file'
      });
    }
    
    const { movieId } = req.params;

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });

    res.json({
      success: true,
      data: {
        cast: response.data.cast.slice(0, 20), // Top 20 cast members
        crew: response.data.crew.filter(c => ['Director', 'Producer', 'Writer'].includes(c.job)).slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Movie credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movie credits'
    });
  }
});

// Get movie videos
router.get('/:movieId/videos', validateMovieId, async (req, res) => {
  try {
    // Check if TMDB API key is configured
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
      return res.status(500).json({
        success: false,
        message: 'TMDB API key is not configured. Please set TMDB_API_KEY in your .env file'
      });
    }
    
    const { movieId } = req.params;

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });

    // Filter for trailers and teasers
    const videos = response.data.results.filter(video => 
      video.type === 'Trailer' || video.type === 'Teaser'
    );

    res.json({
      success: true,
      data: {
        videos
      }
    });
  } catch (error) {
    console.error('Movie videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movie videos'
    });
  }
});

// Get movies by genre
router.get('/genre/:genreId', optionalAuth, async (req, res) => {
  try {
    // Check if TMDB API key is configured
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
      return res.status(500).json({
        success: false,
        message: 'TMDB API key is not configured. Please set TMDB_API_KEY in your .env file'
      });
    }
    
    const { genreId } = req.params;
    const { page = 1 } = req.query;

    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc'
      }
    });

    const movies = response.data.results;
    
    // Add user interaction data if authenticated
    if (req.user) {
      const movieIds = movies.map(m => m.id);
      const userMovies = await Movie.find({
        tmdbId: { $in: movieIds },
        'userRatings.user': req.user._id
      });

      movies.forEach(movie => {
        const userMovie = userMovies.find(um => um.tmdbId === movie.id);
        if (userMovie) {
          const userRating = userMovie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
          movie.userInteraction = {
            rating: userRating?.rating,
            watched: userRating?.watched,
            watchlist: userRating?.watchlist,
            favorite: userRating?.favorite
          };
        }
      });
    }

    res.json({
      success: true,
      data: {
        movies,
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results
      }
    });
  } catch (error) {
    console.error('Genre movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies by genre'
    });
  }
});

module.exports = router; 