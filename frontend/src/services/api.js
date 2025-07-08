import axios from 'axios';

const API_BASE_URL = "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API Base URL:', API_BASE_URL);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API error:', error.message, error.config?.url);
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  googleLogin: (idToken) => api.post('/auth/google', { idToken }),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Movies API
export const moviesAPI = {
  getTrending: (params = {}) => api.get('/movies/trending', { params }),
  getPopular: (params = {}) => api.get('/movies/popular', { params }),
  getTopRated: (params = {}) => api.get('/movies/top-rated', { params }),
  getUpcoming: (params = {}) => api.get('/movies/upcoming', { params }),
  getAllMovies: (params = {}) => api.get('/movies/all', { params }),
  search: (query, params = {}) => api.get('/movies/search', { params: { query, ...params } }),
  getDetails: (movieId) => api.get(`/movies/${movieId}`),
  rateMovie: (movieId, ratingData) => api.post(`/movies/${movieId}/rate`, ratingData),
  getRecommendations: (movieId, params = {}) => api.get(`/movies/${movieId}/recommendations`, { params }),
  getCredits: (movieId) => api.get(`/movies/${movieId}/credits`),
  getVideos: (movieId) => api.get(`/movies/${movieId}/videos`),
  getGenres: () => api.get('/movies/genres'),
  getByGenre: (genreId, params = {}) => api.get(`/movies/genre/${genreId}`, { params }),
};

// Users API
export const usersAPI = {
  getProfile: (userId, params = {}) => api.get(`/users/${userId}`, { params }),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getWatchlist: (userId, params = {}) => api.get(`/users/${userId}/watchlist`, { params }),
  getWatched: (userId, params = {}) => api.get(`/users/${userId}/watched`, { params }),
  getFavorites: (userId, params = {}) => api.get(`/users/${userId}/favorites`, { params }),
  getReviews: (userId, params = {}) => api.get(`/users/${userId}/reviews`, { params }),
  followUser: (userId) => api.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => api.delete(`/users/${userId}/follow`),
  getFollowers: (userId, params = {}) => api.get(`/users/${userId}/followers`, { params }),
  getFollowing: (userId, params = {}) => api.get(`/users/${userId}/following`, { params }),
  getRecommendations: (pageOrParams = 1) => {
    let params = {};
    if (typeof pageOrParams === 'number') {
      params.page = pageOrParams;
    } else if (typeof pageOrParams === 'object' && pageOrParams !== null) {
      params = { ...pageOrParams };
    }
    return api.get('/users/recommendations', { params });
  },
  // Current user endpoints
  getCurrentUserWatchlist: (params = {}) => api.get('/users/user/watchlist', { params }),
  getCurrentUserWatched: (params = {}) => api.get('/users/user/watched', { params }),
};

// Reviews API
export const reviewsAPI = {
  getMovieReviews: (movieId, params = {}) => api.get(`/reviews/movie/${movieId}`, { params }),
  createReview: (movieId, reviewData) => api.post(`/reviews/movie/${movieId}`, reviewData),
  updateReview: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  likeReview: (reviewId) => api.post(`/reviews/${reviewId}/like`),
  dislikeReview: (reviewId) => api.post(`/reviews/${reviewId}/dislike`),
  addComment: (reviewId, comment) => api.post(`/reviews/${reviewId}/comments`, { comment }),
  getRecentReviews: (params = {}) => api.get('/reviews/recent', { params }),
  getFollowingReviews: (params = {}) => api.get('/reviews/following', { params }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 