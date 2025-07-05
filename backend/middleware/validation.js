const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Movie rating validation
const validateMovieRating = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('review')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Review must be less than 2000 characters'),
  
  body('watched')
    .optional()
    .isBoolean()
    .withMessage('Watched must be a boolean value'),
  
  body('watchlist')
    .optional()
    .isBoolean()
    .withMessage('Watchlist must be a boolean value'),
  
  body('favorite')
    .optional()
    .isBoolean()
    .withMessage('Favorite must be a boolean value'),
  
  body('watchedDate')
    .optional()
    .isISO8601()
    .withMessage('Watched date must be a valid ISO 8601 date string'),
  
  // Custom validation to ensure at least one field is provided
  body()
    .custom((value) => {
      const hasRating = value.rating !== undefined;
      const hasReview = value.review !== undefined;
      const hasWatched = value.watched !== undefined;
      const hasWatchlist = value.watchlist !== undefined;
      const hasFavorite = value.favorite !== undefined;
      const hasWatchedDate = value.watchedDate !== undefined;
      
      if (!hasRating && !hasReview && !hasWatched && !hasWatchlist && !hasFavorite && !hasWatchedDate) {
        throw new Error('At least one field (rating, review, watched, watchlist, favorite, or watchedDate) must be provided');
      }
      
      return true;
    }),
  
  handleValidationErrors
];

// Review validation
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('review')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Review must be between 10 and 2000 characters'),
  
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Review title must be less than 100 characters'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value'),
  
  handleValidationErrors
];

// User profile update validation
const validateProfileUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  
  body('preferences.favoriteGenres')
    .optional()
    .isArray()
    .withMessage('Favorite genres must be an array'),
  
  body('preferences.language')
    .optional()
    .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'])
    .withMessage('Invalid language preference'),
  
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Theme must be either light or dark'),
  
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('query')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('genre')
    .optional()
    .isString()
    .withMessage('Genre must be a string'),
  
  query('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 10 })
    .withMessage('Year must be a valid year'),
  
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  
  handleValidationErrors
];

// Movie ID validation
const validateMovieId = [
  param('movieId')
    .isInt({ min: 1 })
    .withMessage('Movie ID must be a positive integer'),
  
  handleValidationErrors
];

// User ID validation
const validateUserId = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateMovieRating,
  validateReview,
  validateProfileUpdate,
  validateSearch,
  validateMovieId,
  validateUserId
}; 