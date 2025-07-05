const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  tmdbId: {
    type: Number,
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
    required: true,
    maxlength: 2000
  },
  title: {
    type: String,
    maxlength: 100
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dislikes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: String
}, {
  timestamps: true
});

// Indexes for efficient queries
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });
reviewSchema.index({ movie: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ 'likes.length': -1 });

// Virtual for like count
reviewSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for dislike count
reviewSchema.virtual('dislikeCount').get(function() {
  return this.dislikes.length;
});

// Virtual for comment count
reviewSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Method to check if user has liked/disliked
reviewSchema.methods.hasUserLiked = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

reviewSchema.methods.hasUserDisliked = function(userId) {
  return this.dislikes.some(dislike => dislike.user.toString() === userId.toString());
};

// Method to toggle like
reviewSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.findIndex(like => like.user.toString() === userId.toString());
  const dislikeIndex = this.dislikes.findIndex(dislike => dislike.user.toString() === userId.toString());
  
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
  } else {
    this.likes.push({ user: userId });
    if (dislikeIndex > -1) {
      this.dislikes.splice(dislikeIndex, 1);
    }
  }
};

// Method to toggle dislike
reviewSchema.methods.toggleDislike = function(userId) {
  const dislikeIndex = this.dislikes.findIndex(dislike => dislike.user.toString() === userId.toString());
  const likeIndex = this.likes.findIndex(like => like.user.toString() === userId.toString());
  
  if (dislikeIndex > -1) {
    this.dislikes.splice(dislikeIndex, 1);
  } else {
    this.dislikes.push({ user: userId });
    if (likeIndex > -1) {
      this.likes.splice(likeIndex, 1);
    }
  }
};

// Ensure virtual fields are serialized
reviewSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Review', reviewSchema); 