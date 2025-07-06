const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  originalTitle: String,
  overview: String,
  posterPath: String,
  backdropPath: String,
  releaseDate: Date,
  runtime: Number,
  genres: [String],
  language: String,
  voteAverage: Number,
  voteCount: Number,
  popularity: Number,
  budget: Number,
  revenue: Number,
  status: String,
  tagline: String,
  productionCompanies: [String],
  productionCountries: [String],
  spokenLanguages: [String],
  homepage: String,
  imdbId: String,
  // User interactions
  userRatings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: false,
      min: 0,
      max: 5,
      default: 0
    },
    review: {
      type: String,
      maxlength: 2000
    },
    watched: {
      type: Boolean,
      default: false
    },
    watchlist: {
      type: Boolean,
      default: false
    },
    favorite: {
      type: Boolean,
      default: false
    },
    watchedDate: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Aggregated stats
  stats: {
    averageRating: {
      type: Number,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    totalWatched: {
      type: Number,
      default: 0
    },
    totalWatchlist: {
      type: Number,
      default: 0
    },
    totalFavorites: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries (removed duplicate tmdbId index)
movieSchema.index({ title: 'text', overview: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ 'stats.averageRating': -1 });
movieSchema.index({ popularity: -1 });

// Method to update aggregated stats
movieSchema.methods.updateStats = function() {
  const ratings = this.userRatings.filter(r => r.rating && r.rating > 0);
  const reviews = this.userRatings.filter(r => r.review && r.review.trim());
  const watched = this.userRatings.filter(r => r.watched);
  const watchlist = this.userRatings.filter(r => r.watchlist);
  const favorites = this.userRatings.filter(r => r.favorite);

  this.stats = {
    averageRating: ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0,
    totalRatings: ratings.length,
    totalReviews: reviews.length,
    totalWatched: watched.length,
    totalWatchlist: watchlist.length,
    totalFavorites: favorites.length
  };
};

// Pre-save middleware to update stats
movieSchema.pre('save', function(next) {
  this.updateStats();
  next();
});

module.exports = mongoose.model('Movie', movieSchema); 