import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { ThemeProvider, useThemeContext } from './ThemeProvider';
import { useTheme } from '@emotion/react';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Recommendations from './pages/Recommendations';

const AppBg = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const Navbar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${({ theme }) => theme.nav};
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(6,182,212,0.08);
  padding: 1.1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Logo = styled(Link)`
  font-size: 2.1rem;
  font-weight: 900;
  color: ${({ theme }) => theme.accent};
  letter-spacing: -0.03em;
  text-decoration: none;
  text-shadow: 0 2px 12px #0e7490;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.2rem;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.navText};
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.18s;
  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const Main = styled.main`
  padding: 2.5rem 1.2rem 1.2rem 1.2rem;
  min-height: 80vh;
  width: 100vw;
  box-sizing: border-box;
  @media (max-width: 600px) {
    padding: 1.2rem 0.5rem;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.accent};
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 1.5rem;
  transition: color 0.18s;
  &:hover {
    color: #2563eb;
  }
`;

function AppContent() {
  const { isDark, toggleTheme } = useThemeContext();
  const theme = useTheme();
  return (
    <AppBg>
      <Navbar>
        <Logo to="/">🎬 ReelDeal</Logo>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/recommendations">Recommendations</NavLink>
          <ThemeToggle onClick={toggleTheme} title="Toggle theme">
            {isDark ? '🌙' : '☀️'}
          </ThemeToggle>
        </NavLinks>
      </Navbar>
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </Main>
    </AppBg>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
