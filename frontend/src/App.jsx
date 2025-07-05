import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";
import WatchedMovies from "./pages/WatchedMovies";
import Recommendations from "./pages/Recommendations";

// Stores
import useAuthStore from "./stores/authStore";

// Styles
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { initialize, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
    
    // Test backend connectivity
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        const data = await response.json();
        console.log('Backend health check:', data);
      } catch (error) {
        console.error('Backend not accessible:', error);
        console.log('Please make sure the backend server is running on http://localhost:5000');
      }
    };
    
    testBackend();
  }, [initialize]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <Login />
                }
              />
              <Route
                path="/register"
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <Register />
                }
              />
              <Route path="/movie/:movieId" element={<MovieDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/user/:userId" element={<Profile />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <ProtectedRoute>
                    <Watchlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/watched"
                element={
                  <ProtectedRoute>
                    <WatchedMovies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute>
                    <Recommendations />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-300 mb-4">
                        404
                      </h1>
                      <p className="text-xl text-gray-600 mb-8">
                        Page not found
                      </p>
                      <a
                        href="/"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
