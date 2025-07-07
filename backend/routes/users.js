const express = require('express');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateProfileUpdate, validateUserId } = require('../middleware/validation');

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Users API is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Users API error',
      error: error.message
    });
  }
});

// Get current user's watchlist
router.get('/user/watchlist', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching watchlist for user:', req.user._id);
    const movies = await Movie.find({
      'userRatings.user': req.user._id,
      'userRatings.watchlist': true
    })
    .select('tmdbId title posterPath releaseDate overview voteAverage genres userRatings')
    .limit(50);

    console.log('Raw movies found for watchlist:', movies.map(m => ({ id: m.tmdbId, userRatings: m.userRatings })));

    // Only include movies where the user's userRatings entry has watchlist:true and watched:false
    const filteredMovies = movies.filter(movie => {
      const userRating = movie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
      return userRating && userRating.watchlist && !userRating.watched;
    });

    console.log('Filtered watchlist movies:', filteredMovies.map(m => ({ id: m.tmdbId, userRatings: m.userRatings })));

    const transformedMovies = filteredMovies.map(movie => {
      try {
        const userRating = movie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
        return {
          id: movie.tmdbId,
          title: movie.title || 'Unknown Title',
          poster_path: movie.posterPath,
          release_date: movie.releaseDate,
          overview: movie.overview || '',
          vote_average: movie.voteAverage || 0,
          genres: movie.genres || [],
          addedDate: userRating?.createdAt,
          userRating: userRating?.rating || 0,
          watched: userRating?.watched || false,
          favorite: userRating?.favorite || false
        };
      } catch (transformError) {
        console.error('Error transforming movie:', movie._id, transformError);
        return null;
      }
    }).filter(movie => movie !== null);

    console.log('Transformed watchlist movies sent to frontend:', transformedMovies);

    res.json({
      success: true,
      data: transformedMovies
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist',
      error: error.message
    });
  }
});

// Get current user's watched movies
router.get('/user/watched', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching watched movies for user:', req.user._id);
    const movies = await Movie.find({
      'userRatings.user': req.user._id,
      'userRatings.watched': true
    })
    .select('tmdbId title posterPath releaseDate overview voteAverage genres runtime userRatings')
    .limit(50);

    console.log('Raw movies found for watched:', movies.map(m => ({ id: m.tmdbId, userRatings: m.userRatings })));

    // Only include movies where the user's userRatings entry has watched:true and watchlist:false
    const filteredMovies = movies.filter(movie => {
      const userRating = movie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
      return userRating && userRating.watched && !userRating.watchlist;
    });

    console.log('Filtered watched movies:', filteredMovies.map(m => ({ id: m.tmdbId, userRatings: m.userRatings })));

    const transformedMovies = filteredMovies.map(movie => {
      try {
        const userRating = movie.userRatings.find(ur => ur.user.toString() === req.user._id.toString());
        return {
          id: movie.tmdbId,
          title: movie.title || 'Unknown Title',
          poster_path: movie.posterPath,
          release_date: movie.releaseDate,
          overview: movie.overview || '',
          vote_average: movie.voteAverage || 0,
          genres: movie.genres || [],
          runtime: movie.runtime || 0,
          watchedDate: userRating?.watchedDate,
          userRating: userRating?.rating || 0,
          review: userRating?.review || '',
          favorite: userRating?.favorite || false
        };
      } catch (transformError) {
        console.error('Error transforming watched movie:', movie._id, transformError);
        return null;
      }
    }).filter(movie => movie !== null);

    console.log('Transformed watched movies sent to frontend:', transformedMovies);

    res.json({
      success: true,
      data: transformedMovies
    });
  } catch (error) {
    console.error('Get watched movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watched movies',
      error: error.message
    });
  }
});

// Get user profile
router.get('/:userId', validateUserId, optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { includeStats = true, includeLists = true } = req.query;

    const user = await User.findById(userId)
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const response = {
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        preferences: user.preferences,
        followers: user.followers,
        following: user.following,
        createdAt: user.createdAt
      }
    };

    // Add stats if requested
    if (includeStats === 'true') {
      response.user.stats = user.stats;
    }

    // Add lists if requested
    if (includeLists === 'true') {
      const watchedMovies = await Movie.find({
        'userRatings.user': userId,
        'userRatings.watched': true
      }).select('tmdbId title posterPath releaseDate');

      const watchlistMovies = await Movie.find({
        'userRatings.user': userId,
        'userRatings.watchlist': true
      }).select('tmdbId title posterPath releaseDate');

      const favoriteMovies = await Movie.find({
        'userRatings.user': userId,
        'userRatings.favorite': true
      }).select('tmdbId title posterPath releaseDate');

      response.lists = {
        watched: watchedMovies.slice(0, 10), // Show first 10
        watchlist: watchlistMovies.slice(0, 10),
        favorites: favoriteMovies.slice(0, 10)
      };
    }

    // Add follow status if authenticated
    if (req.user) {
      response.user.isFollowing = user.followers.some(
        follower => follower._id.toString() === req.user._id.toString()
      );
      response.user.isOwnProfile = req.user._id.toString() === userId;
    }

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, bio, preferences } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (preferences) updateData.preferences = preferences;

    // Check if username is already taken
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user._id } 
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Get user's watchlist
router.get('/:userId/watchlist', validateUserId, optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const movies = await Movie.find({
      'userRatings.user': userId,
      'userRatings.watchlist': true
    })
    .select('tmdbId title posterPath releaseDate overview voteAverage genres')
    .sort({ 'userRatings.createdAt': -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Movie.countDocuments({
      'userRatings.user': userId,
      'userRatings.watchlist': true
    });

    res.json({
      success: true,
      data: {
        movies,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total
      }
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist'
    });
  }
});

// Get user's watched movies
router.get('/:userId/watched', validateUserId, optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const movies = await Movie.find({
      'userRatings.user': userId,
      'userRatings.watched': true
    })
    .select('tmdbId title posterPath releaseDate overview voteAverage genres')
    .sort({ 'userRatings.watchedDate': -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Movie.countDocuments({
      'userRatings.user': userId,
      'userRatings.watched': true
    });

    res.json({
      success: true,
      data: {
        movies,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total
      }
    });
  } catch (error) {
    console.error('Get watched movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watched movies'
    });
  }
});

// Get user's favorite movies
router.get('/:userId/favorites', validateUserId, optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const movies = await Movie.find({
      'userRatings.user': userId,
      'userRatings.favorite': true
    })
    .select('tmdbId title posterPath releaseDate overview voteAverage genres')
    .sort({ 'userRatings.createdAt': -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Movie.countDocuments({
      'userRatings.user': userId,
      'userRatings.favorite': true
    });

    res.json({
      success: true,
      data: {
        movies,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites'
    });
  }
});

// Get user's reviews
router.get('/:userId/reviews', validateUserId, optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: userId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ user: userId });

    res.json({
      success: true,
      data: {
        reviews,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews'
    });
  }
});

// Follow user
router.post('/:userId/follow', authenticateToken, validateUserId, async (req, res) => {
  try {
    const { userId } = req.params;

    // Can't follow yourself
    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentUser = await User.findById(req.user._id);

    // Check if already following
    const isFollowing = currentUser.following.includes(userId);
    if (isFollowing) {
      return res.status(400).json({
        success: false,
        message: 'Already following this user'
      });
    }

    // Add to following
    currentUser.following.push(userId);
    await currentUser.save();

    // Add to followers
    userToFollow.followers.push(req.user._id);
    await userToFollow.save();

    res.json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to follow user'
    });
  }
});

// Unfollow user
router.delete('/:userId/follow', authenticateToken, validateUserId, async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(req.user._id);
    const userToUnfollow = await User.findById(userId);

    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if following
    const isFollowing = currentUser.following.includes(userId);
    if (!isFollowing) {
      return res.status(400).json({
        success: false,
        message: 'Not following this user'
      });
    }

    // Remove from following
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userId
    );
    await currentUser.save();

    // Remove from followers
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await userToUnfollow.save();

    res.json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unfollow user'
    });
  }
});

// Get user's followers
router.get('/:userId/followers', validateUserId, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        select: 'username avatar bio stats',
        options: {
          skip,
          limit: parseInt(limit)
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const total = user.followers.length;

    res.json({
      success: true,
      data: {
        followers: user.followers,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total
      }
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch followers'
    });
  }
});

// Get user's following
router.get('/:userId/following', validateUserId, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const user = await User.findById(userId)
      .populate({
        path: 'following',
        select: 'username avatar bio stats',
        options: {
          skip,
          limit: parseInt(limit)
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const total = user.following.length;

    res.json({
      success: true,
      data: {
        following: user.following,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total
      }
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch following'
    });
  }
});

// Get personalized recommendations
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Get user's watched movies and their genres
    const userMovies = await Movie.find({
      'userRatings.user': req.user._id,
      'userRatings.watched': true
    });

    if (userMovies.length === 0) {
      // If no watched movies, return popular movies
      const popularMovies = await Movie.find()
        .sort({ 'stats.averageRating': -1 })
        .limit(parseInt(limit));
      
      const transformedMovies = popularMovies.map(movie => ({
        id: movie.tmdbId,
        title: movie.title || 'Unknown Title',
        poster_path: movie.posterPath,
        release_date: movie.releaseDate,
        overview: movie.overview || '',
        vote_average: movie.voteAverage || 0,
        genres: movie.genres || [],
        matchScore: Math.floor(Math.random() * 20) + 80, // Random score 80-100
        matchReason: "Popular movie you might enjoy"
      }));
      
      return res.json({
        success: true,
        data: transformedMovies
      });
    }

    // Get user's favorite genres
    const genreCounts = {};
    userMovies.forEach(movie => {
      movie.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    const favoriteGenres = Object.keys(genreCounts)
      .sort((a, b) => genreCounts[b] - genreCounts[a])
      .slice(0, 3);

    // Get movies in favorite genres that user hasn't watched
    const watchedMovieIds = userMovies.map(m => m.tmdbId);
    
    const recommendations = await Movie.find({
      tmdbId: { $nin: watchedMovieIds },
      genres: { $in: favoriteGenres },
      'stats.averageRating': { $gte: 6 }
    })
    .sort({ 'stats.averageRating': -1, popularity: -1 })
    .limit(parseInt(limit));

    const transformedMovies = recommendations.map(movie => {
      const matchScore = Math.floor(Math.random() * 20) + 80; // Random score 80-100
      const matchReason = `Based on your love for ${favoriteGenres[0]} movies`;
      
      return {
        id: movie.tmdbId,
        title: movie.title || 'Unknown Title',
        poster_path: movie.posterPath,
        release_date: movie.releaseDate,
        overview: movie.overview || '',
        vote_average: movie.voteAverage || 0,
        genres: movie.genres || [],
        matchScore,
        matchReason
      };
    });

    res.json({
      success: true,
      data: transformedMovies
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations'
    });
  }
});

module.exports = router; 