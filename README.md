# 🎬 ReelDeal - Modern Movie Discovery Web App

A full-stack movie discovery and recommendation web application inspired by platforms like IMDb and Letterboxd. Built with React, Node.js, and MongoDB, featuring TMDB API integration for comprehensive movie data.

## ✨ Features

### 🎯 Core Features
- **Movie Discovery**: Browse trending, popular, top-rated, and upcoming movies
- **Search & Filter**: Advanced search with autocomplete and filtering by genre, year, rating
- **User Authentication**: JWT-based auth with Google OAuth support
- **Watchlist Management**: Add/remove movies from personal watchlist and favorites
- **Rating System**: 1-10 rating system with detailed reviews
- **Social Features**: Follow users, like/dislike reviews, comment system
- **Personalized Recommendations**: AI-powered recommendations based on watch history

### 🎨 User Experience
- **Responsive Design**: Mobile-first, fully responsive interface
- **Dark/Light Mode**: Theme switching with system preference detection
- **Real-time Updates**: Live notifications and activity feed
- **Infinite Scroll**: Smooth pagination for movie lists
- **Modern UI**: Clean, intuitive interface with smooth animations

### 🔧 Technical Features
- **RESTful API**: Well-structured backend with proper error handling
- **Database Optimization**: Efficient MongoDB queries with indexing
- **Security**: JWT authentication, input validation, rate limiting
- **Performance**: Caching, lazy loading, optimized images
- **SEO Friendly**: Meta tags, structured data, server-side rendering ready

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **React Query** - Server state management and caching
- **React Hook Form** - Form handling and validation
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Rate Limiting** - API protection

### External APIs
- **TMDB API** - Comprehensive movie database
- **Google OAuth** - Social authentication

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- TMDB API key
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MananKakkar1/ReelDeal.git
   cd ReelDeal
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   **Backend (.env)**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/reeldeal
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   TMDB_API_KEY=your-tmdb-api-key
   GOOGLE_CLIENT_ID=your-google-client-id
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Get API Keys**
   - [TMDB API](https://www.themoviedb.org/settings/api) - Free movie database
   - [Google OAuth](https://console.cloud.google.com/) - For social login (optional)

5. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
ReelDeal/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation, etc.
│   ├── index.js         # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── stores/      # State management
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Movies
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/top-rated` - Get top rated movies
- `GET /api/movies/upcoming` - Get upcoming movies
- `GET /api/movies/search` - Search movies
- `GET /api/movies/:movieId` - Get movie details
- `POST /api/movies/:movieId/rate` - Rate a movie

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:userId/watchlist` - Get user watchlist
- `GET /api/users/:userId/watched` - Get watched movies
- `GET /api/users/:userId/favorites` - Get favorite movies
- `POST /api/users/:userId/follow` - Follow user
- `DELETE /api/users/:userId/follow` - Unfollow user

### Reviews
- `GET /api/reviews/movie/:movieId` - Get movie reviews
- `POST /api/reviews/movie/:movieId` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review
- `POST /api/reviews/:reviewId/like` - Like review
- `POST /api/reviews/:reviewId/dislike` - Dislike review

## 🎯 Key Features Explained

### Movie Discovery
- **Trending Movies**: Real-time trending movies from TMDB
- **Advanced Search**: Search by title, genre, year, rating
- **Filtering**: Multiple filter options for refined results
- **Movie Details**: Comprehensive movie information with cast, reviews, trailers

### User Experience
- **Personalized Dashboard**: Custom recommendations based on watch history
- **Watchlist Management**: Easy add/remove from watchlist and favorites
- **Social Interaction**: Follow users, like reviews, comment system
- **Activity Feed**: Real-time updates from followed users

### Technical Excellence
- **Performance**: Optimized queries, lazy loading, image optimization
- **Security**: JWT authentication, input validation, rate limiting
- **Scalability**: Modular architecture, efficient database design
- **Maintainability**: Clean code structure, comprehensive documentation

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Frontend Deployment (Vercel)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
TMDB_API_KEY=your-tmdb-api-key
GOOGLE_CLIENT_ID=your-google-client-id
FRONTEND_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [TailwindCSS](https://tailwindcss.com/) for the amazing CSS framework
- [React](https://reactjs.org/) for the incredible frontend library
- [MongoDB](https://www.mongodb.com/) for the flexible database solution

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact: [Your Email]
- Project Link: https://github.com/MananKakkar1/ReelDeal

---

**Made with ❤️ by [Your Name]**