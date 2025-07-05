const express = require('express');
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');

const router = express.Router();

// Get reviews for a movie
router.get('/movie/:movieId', optionalAuth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { page = 1, limit = 10, sort = 'recent' } = req.query;

    const skip = (page - 1) * limit;

    let sortOption = {};
    switch (sort) {
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case 'helpful':
        sortOption = { likeCount: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find({ tmdbId: parseInt(movieId) })
      .populate('user', 'username avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ tmdbId: parseInt(movieId) });

    // Add user interaction data if authenticated
    if (req.user) {
      reviews.forEach(review => {
        review.userHasLiked = review.hasUserLiked(req.user._id);
        review.userHasDisliked = review.hasUserDisliked(req.user._id);
      });
    }

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
    console.error('Get movie reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Create a review
router.post('/movie/:movieId', authenticateToken, validateReview, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, review, title, isPublic = true } = req.body;

    // Check if user already has a review for this movie
    const existingReview = await Review.findOne({
      user: req.user._id,
      tmdbId: parseInt(movieId)
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this movie'
      });
    }

    // Get or create movie in database
    const movie = await Movie.findOne({ tmdbId: parseInt(movieId) });
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Create review
    const newReview = new Review({
      user: req.user._id,
      movie: movie._id,
      tmdbId: parseInt(movieId),
      rating,
      review,
      title,
      isPublic
    });

    await newReview.save();

    // Update movie rating
    const existingRatingIndex = movie.userRatings.findIndex(
      ur => ur.user.toString() === req.user._id.toString()
    );

    if (existingRatingIndex > -1) {
      movie.userRatings[existingRatingIndex].review = review;
    } else {
      movie.userRatings.push({
        user: req.user._id,
        rating,
        review,
        watched: true,
        watchlist: false,
        favorite: false,
        watchedDate: new Date()
      });
    }

    await movie.save();

    // Populate user data for response
    await newReview.populate('user', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        review: newReview
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review'
    });
  }
});

// Update a review
router.put('/:reviewId', authenticateToken, validateReview, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, review, title, isPublic } = req.body;

    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (existingReview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own reviews'
      });
    }

    // Update review
    existingReview.rating = rating;
    existingReview.review = review;
    if (title !== undefined) existingReview.title = title;
    if (isPublic !== undefined) existingReview.isPublic = isPublic;
    existingReview.isEdited = true;
    existingReview.editedAt = new Date();

    await existingReview.save();

    // Update movie rating
    const movie = await Movie.findOne({ tmdbId: existingReview.tmdbId });
    if (movie) {
      const ratingIndex = movie.userRatings.findIndex(
        ur => ur.user.toString() === req.user._id.toString()
      );
      if (ratingIndex > -1) {
        movie.userRatings[ratingIndex].rating = rating;
        movie.userRatings[ratingIndex].review = review;
      }
      await movie.save();
    }

    await existingReview.populate('user', 'username avatar');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: {
        review: existingReview
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
});

// Delete a review
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    // Remove review from movie
    const movie = await Movie.findOne({ tmdbId: review.tmdbId });
    if (movie) {
      const ratingIndex = movie.userRatings.findIndex(
        ur => ur.user.toString() === req.user._id.toString()
      );
      if (ratingIndex > -1) {
        movie.userRatings[ratingIndex].review = '';
      }
      await movie.save();
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

// Like a review
router.post('/:reviewId/like', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Can't like your own review
    if (review.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot like your own review'
      });
    }

    review.toggleLike(req.user._id);
    await review.save();

    res.json({
      success: true,
      message: 'Review liked successfully',
      data: {
        likeCount: review.likeCount,
        dislikeCount: review.dislikeCount,
        userHasLiked: review.hasUserLiked(req.user._id),
        userHasDisliked: review.hasUserDisliked(req.user._id)
      }
    });
  } catch (error) {
    console.error('Like review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like review'
    });
  }
});

// Dislike a review
router.post('/:reviewId/dislike', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Can't dislike your own review
    if (review.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot dislike your own review'
      });
    }

    review.toggleDislike(req.user._id);
    await review.save();

    res.json({
      success: true,
      message: 'Review disliked successfully',
      data: {
        likeCount: review.likeCount,
        dislikeCount: review.dislikeCount,
        userHasLiked: review.hasUserLiked(req.user._id),
        userHasDisliked: review.hasUserDisliked(req.user._id)
      }
    });
  } catch (error) {
    console.error('Dislike review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to dislike review'
    });
  }
});

// Add comment to review
router.post('/:reviewId/comments', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required'
      });
    }

    if (comment.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be less than 500 characters'
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Add comment
    review.comments.push({
      user: req.user._id,
      comment: comment.trim()
    });

    await review.save();
    await review.populate('comments.user', 'username avatar');

    const newComment = review.comments[review.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: newComment
      }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
});

// Get recent reviews (for activity feed)
router.get('/recent', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ isPublic: true })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ isPublic: true });

    // Add user interaction data if authenticated
    if (req.user) {
      reviews.forEach(review => {
        review.userHasLiked = review.hasUserLiked(req.user._id);
        review.userHasDisliked = review.hasUserDisliked(req.user._id);
      });
    }

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
    console.error('Get recent reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent reviews'
    });
  }
});

// Get reviews from followed users
router.get('/following', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    // Get user's following list
    const user = await User.findById(req.user._id).populate('following');
    const followingIds = user.following.map(u => u._id);

    if (followingIds.length === 0) {
      return res.json({
        success: true,
        data: {
          reviews: [],
          page: parseInt(page),
          totalPages: 0,
          totalResults: 0
        }
      });
    }

    const reviews = await Review.find({
      user: { $in: followingIds },
      isPublic: true
    })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Review.countDocuments({
      user: { $in: followingIds },
      isPublic: true
    });

    // Add user interaction data
    reviews.forEach(review => {
      review.userHasLiked = review.hasUserLiked(req.user._id);
      review.userHasDisliked = review.hasUserDisliked(req.user._id);
    });

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
    console.error('Get following reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch following reviews'
    });
  }
});

module.exports = router; 