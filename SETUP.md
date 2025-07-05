# ReelDeal Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- TMDB API key (free)

## Quick Setup

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Copy the example file
   cp env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database (use your MongoDB connection string)
   MONGODB_URI=mongodb://localhost:27017/reeldeal

   # JWT Secret (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # TMDB API (get from https://www.themoviedb.org/settings/api)
   TMDB_API_KEY=your-tmdb-api-key-here

   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Getting Your TMDB API Key

1. Go to [The Movie Database](https://www.themoviedb.org/)
2. Create a free account
3. Go to [Settings > API](https://www.themoviedb.org/settings/api)
4. Request an API key for "Developer" use
5. Copy the API key and add it to your `.env` file

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/reeldeal`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env` with your Atlas connection string

## Troubleshooting

### Registration Issues
- **400 Bad Request**: Check that your password meets requirements:
  - At least 6 characters
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one number
- **Email already registered**: Use a different email address

### API Issues
- **TMDB API errors**: Ensure your TMDB_API_KEY is correct and active
- **Genres not loading**: The app will use fallback genres if API fails
- **Movie details not loading**: Check TMDB API key and internet connection

### Database Issues
- **Connection failed**: Check your MongoDB connection string
- **Authentication failed**: Ensure MongoDB credentials are correct

## Features

✅ **Movie Discovery**: Browse trending, popular, and top-rated movies  
✅ **Smart Search**: Search movies, actors, and genres with autocomplete  
✅ **Movie Details**: View comprehensive movie information, cast, and trailers  
✅ **User Authentication**: Register, login, and profile management  
✅ **Watched Movies**: Track movies you've watched with ratings  
✅ **Personalized Recommendations**: Get movie suggestions based on your taste  
✅ **Surprise Me**: Discover random movies  
✅ **Responsive Design**: Works on desktop and mobile  

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/movies/trending` - Trending movies
- `GET /api/movies/popular` - Popular movies
- `GET /api/movies/genres` - Movie genres
- `GET /api/movies/:id` - Movie details
- `GET /api/movies/:id/credits` - Movie cast
- `GET /api/movies/:id/videos` - Movie trailers

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **External APIs**: TMDB (The Movie Database)
- **Styling**: Emotion (styled-components), TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios 