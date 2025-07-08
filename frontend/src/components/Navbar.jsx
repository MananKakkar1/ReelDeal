import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Settings, Heart, Bookmark } from "lucide-react";
import Logo from "./Logo";
import SmartSearch from "./SmartSearch";
import useAuthStore from "../stores/authStore";

const Nav = styled.nav`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  position: sticky;
  top: 0;
  z: 50;
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 2rem;
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (min-width: 768px) {
    gap: 3rem;
  }
`;

const NavLinks = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
`;

const NavLink = styled(Link)`
  color: ${(props) => (props.active === "true" ? "#06b6d4" : "#94a3b8")};
  text-decoration: none;
  font-weight: ${(props) => (props.active === "true" ? "600" : "500")};
  transition: all 0.3s ease;
  position: relative;
  font-size: 0.9rem;

  &:hover {
    color: #06b6d4;
  }

  ${(props) =>
    props.active === "true" &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
      border-radius: 1px;
    }
  `}
`;

const SearchContainer = styled.div`
  display: none;
  flex: 1;
  max-width: 400px;
  margin: 0 1rem;

  @media (min-width: 768px) {
    display: block;
    margin: 0 2rem;
  }
`;

const MobileSearchContainer = styled.div`
  display: block;
  width: 100%;
  margin: 1rem 0;

  @media (min-width: 768px) {
    display: none;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 640px) {
    gap: 1rem;
  }
`;

const AuthButtons = styled.div`
  display: none;
  align-items: center;
  gap: 1rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const LoginButton = styled(Link)`
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    color: #06b6d4;
  }
`;

const SignUpButton = styled(Link)`
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  color: white;
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: #06b6d4;
    background: rgba(6, 182, 212, 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1rem;
  padding: 0.5rem;
  min-width: 200px;
  z-index: 50;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: rgba(6, 182, 212, 0.1);
    color: #06b6d4;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #94a3b8;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #fca5a5;
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: #06b6d4;
    background: rgba(6, 182, 212, 0.1);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  z-index: 40;
  padding: 2rem 1rem;
  overflow-y: auto;

  @media (min-width: 768px) {
    display: none;
  }

  /* Ensure proper scrolling on mobile */
  -webkit-overflow-scrolling: touch;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MobileNavLink = styled(Link)`
  color: ${(props) => (props.active === "true" ? "#06b6d4" : "#94a3b8")};
  text-decoration: none;
  font-weight: ${(props) => (props.active === "true" ? "600" : "500")};
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1.1rem;

  &:hover {
    color: #06b6d4;
    background: rgba(6, 182, 212, 0.1);
  }
`;

const MobileAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const MobileLoginButton = styled(Link)`
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 1.1rem;

  &:hover {
    color: #06b6d4;
    background: rgba(6, 182, 212, 0.1);
  }
`;

const MobileSignUpButton = styled(Link)`
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  color: white;
  text-decoration: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 1.1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
  }
`;

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const handleSmartSearchSelect = (movie) => {
    navigate(`/movie/${movie.id}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <Nav>
      <NavContainer>
        <NavContent>
          <NavLeft>
            <Logo />
            <NavLinks>
              <NavLink to="/" className={isActive("/") ? "active" : ""}>
                Home
              </NavLink>
              <NavLink
                to="/search"
                className={isActive("/search") ? "active" : ""}
              >
                Search
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink
                    to="/watchlist"
                    className={isActive("/watchlist") ? "active" : ""}
                  >
                    Watchlist
                  </NavLink>
                  <NavLink
                    to="/watched"
                    className={isActive("/watched") ? "active" : ""}
                  >
                    Watched
                  </NavLink>
                  <NavLink
                    to="/recommendations"
                    className={isActive("/recommendations") ? "active" : ""}
                  >
                    Recommendations
                  </NavLink>
                </>
              )}
            </NavLinks>
          </NavLeft>

          <SearchContainer>
            <SmartSearch
              placeholder="Search movies..."
              onSelect={handleSmartSearchSelect}
            />
          </SearchContainer>

          <NavRight>
            {isAuthenticated ? (
              <UserMenu>
                <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <UserAvatar>
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </UserAvatar>
                </UserButton>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <UserDropdown
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DropdownItem to="/profile?tab=profile">
                        <User size={16} />
                        Profile
                      </DropdownItem>
                      <DropdownItem to="/watchlist">
                        <Bookmark size={16} />
                        Watchlist
                      </DropdownItem>
                      <DropdownItem to="/recommendations">
                        <Heart size={16} />
                        Recommendations
                      </DropdownItem>
                      <DropdownItem to="/profile?tab=settings">
                        <Settings size={16} />
                        Settings
                      </DropdownItem>
                      <DropdownButton onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                      </DropdownButton>
                    </UserDropdown>
                  )}
                </AnimatePresence>
              </UserMenu>
            ) : (
              <AuthButtons>
                <LoginButton to="/login">Login</LoginButton>
                <SignUpButton to="/register">Sign Up</SignUpButton>
              </AuthButtons>
            )}

            <MobileMenuButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </MobileMenuButton>
          </NavRight>
        </NavContent>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <MobileMenu
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
            >
              <MobileSearchContainer>
                <SmartSearch
                  placeholder="Search movies..."
                  onSelect={handleSmartSearchSelect}
                />
              </MobileSearchContainer>

              <MobileNavLinks>
                <MobileNavLink 
                  to="/" 
                  className={isActive("/") ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </MobileNavLink>
                <MobileNavLink
                  to="/search"
                  className={isActive("/search") ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Search
                </MobileNavLink>
                {isAuthenticated && (
                  <>
                    <MobileNavLink
                      to="/watchlist"
                      className={isActive("/watchlist") ? "active" : ""}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Watchlist
                    </MobileNavLink>
                    <MobileNavLink
                      to="/watched"
                      className={isActive("/watched") ? "active" : ""}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Watched
                    </MobileNavLink>
                    <MobileNavLink
                      to="/recommendations"
                      className={isActive("/recommendations") ? "active" : ""}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Recommendations
                    </MobileNavLink>
                    <MobileNavLink
                      to="/profile?tab=profile"
                      className={isActive("/profile") ? "active" : ""}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </MobileNavLink>
                    <MobileNavLink
                      to="/profile?tab=settings"
                      className={isActive("/profile") ? "active" : ""}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Settings
                    </MobileNavLink>
                  </>
                )}
              </MobileNavLinks>

              {!isAuthenticated && (
                <MobileAuthButtons>
                  <MobileLoginButton to="/login">Login</MobileLoginButton>
                  <MobileSignUpButton to="/register">
                    Sign Up
                  </MobileSignUpButton>
                </MobileAuthButtons>
              )}

              {isAuthenticated && (
                <MobileAuthButtons>
                  <DropdownButton onClick={handleLogout}>
                    <LogOut size={20} />
                    Logout
                  </DropdownButton>
                </MobileAuthButtons>
              )}
            </MobileMenu>
          )}
        </AnimatePresence>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
