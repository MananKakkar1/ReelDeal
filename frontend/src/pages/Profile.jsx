import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Section from "../components/common/Section";
import SectionTitle from "../components/common/SectionTitle";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import MovieCard from "../components/MovieCard";
import { usersAPI } from "../services/api";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  User,
  Edit,
  Settings,
  LogOut,
  Calendar,
  MapPin,
  Mail,
} from "lucide-react";
import MovieList from "../components/MovieList";
import SettingsForm from "../components/SettingsForm";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileContainer = styled.div`
  width: 100%;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const ProfileTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ProfileSubtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProfileSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ProfileCard = styled.div`
  background: rgba(30, 41, 59, 0.3);
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid rgba(148, 163, 184, 0.1);
  text-align: center;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 3rem;
  color: white;
  font-weight: 700;
  box-shadow: 0 8px 32px rgba(6, 182, 212, 0.3);
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #06b6d4;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 0.25rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(6, 182, 212, 0.1);
    border-color: #06b6d4;
    color: #06b6d4;
  }
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContentSection = styled.div`
  background: rgba(30, 41, 59, 0.3);
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid rgba(148, 163, 184, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
`;

const SectionTitleStyled = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MoviesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #94a3b8;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
  color: #64748b;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #94a3b8;
`;

const InfoIcon = styled.div`
  width: 20px;
  color: #06b6d4;
`;

const TabsBar = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  color: ${({ active }) => (active ? "#06b6d4" : "#94a3b8")};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.75rem 0;
  border-bottom: 2.5px solid
    ${({ active }) => (active ? "#06b6d4" : "transparent")};
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;

  &:hover {
    color: #06b6d4;
  }
`;

function ProfileAbout({ user }) {
  return (
    <ContentSection>
      <SectionHeader>
        <SectionTitleStyled>
          <User size={20} />
          About
        </SectionTitleStyled>
      </SectionHeader>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        <Avatar>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <User size={48} />
          )}
        </Avatar>
        <div>
          <UserName>{user.username}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </div>
      </div>
      {user.bio && (
        <div style={{ color: "#94a3b8", marginBottom: "1rem" }}>{user.bio}</div>
      )}
      <UserStats>
        <Stat>
          <StatNumber>{user.stats?.moviesWatched || 0}</StatNumber>
          <StatLabel>Watched</StatLabel>
        </Stat>
        <Stat>
          <StatNumber>{user.stats?.reviewsWritten || 0}</StatNumber>
          <StatLabel>Reviews</StatLabel>
        </Stat>
        <Stat>
          <StatNumber>{user.followers || 0}</StatNumber>
          <StatLabel>Followers</StatLabel>
        </Stat>
      </UserStats>
    </ContentSection>
  );
}

function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryTab = new URLSearchParams(location.search).get("tab");
  const validTabs = ["profile", "watchlist", "recommendations", "settings"];
  const initialTab = validTabs.includes(queryTab) ? queryTab : "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [user, setUser] = useState(null);
  const [recentMovies, setRecentMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (activeTab === "watchlist") fetchWatchlist();
    if (activeTab === "recommendations") fetchRecommendations();
  }, [activeTab]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const response = await usersAPI.getCurrentUserWatchlist();
      setWatchlist(response.data.data || []);
    } catch (error) {
      setWatchlist([]);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await usersAPI.getRecommendations();
      setRecommendations(response.data.data || []);
    } catch (error) {
      setRecommendations([]);
    }
  };

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log("Edit profile clicked");
  };

  const handleSettings = () => {
    // TODO: Implement settings functionality
    console.log("Settings clicked");
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logout clicked");
  };

  const handleSaveSettings = async (formData) => {
    try {
      await api.put("/users/profile", formData);
      setSettingsSaved(true);
      fetchCurrentUser();
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (error) {
      // handle error
    }
  };

  // When tab changes, update the URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/profile?tab=${tab}`);
  };

  if (loading) return <Spinner />;

  if (!user) {
    return (
      <EmptyState>
        <EmptyIcon>👤</EmptyIcon>
        <EmptyTitle>User not found</EmptyTitle>
        <EmptyText>Please log in to view your profile</EmptyText>
      </EmptyState>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>Profile</ProfileTitle>
        <ProfileSubtitle>Your movie journey</ProfileSubtitle>
      </ProfileHeader>

      <Section>
        <ProfileGrid>
          <ProfileSidebar>
            <ProfileCard>
              <Avatar>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <User size={48} />
                )}
              </Avatar>
              <UserName>{user.username}</UserName>
              <UserEmail>{user.email}</UserEmail>

              <UserStats>
                <Stat>
                  <StatNumber>{user.stats.moviesWatched}</StatNumber>
                  <StatLabel>Watched</StatLabel>
                </Stat>
                <Stat>
                  <StatNumber>{user.stats.reviewsWritten}</StatNumber>
                  <StatLabel>Reviews</StatLabel>
                </Stat>
                <Stat>
                  <StatNumber>{user.stats.followers}</StatNumber>
                  <StatLabel>Followers</StatLabel>
                </Stat>
              </UserStats>

              <ActionButtons>
                <ActionButton onClick={handleEditProfile}>
                  <Edit size={16} />
                  Edit Profile
                </ActionButton>
                <ActionButton onClick={handleSettings}>
                  <Settings size={16} />
                  Settings
                </ActionButton>
                <ActionButton onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </ActionButton>
              </ActionButtons>
            </ProfileCard>
          </ProfileSidebar>

          <ProfileContent>
            <TabsBar>
              <TabButton
                active={activeTab === "profile"}
                onClick={() => handleTabChange("profile")}
              >
                Profile
              </TabButton>
              <TabButton
                active={activeTab === "watchlist"}
                onClick={() => handleTabChange("watchlist")}
              >
                Watchlist
              </TabButton>
              <TabButton
                active={activeTab === "recommendations"}
                onClick={() => handleTabChange("recommendations")}
              >
                Recommendations
              </TabButton>
              <TabButton
                active={activeTab === "settings"}
                onClick={() => handleTabChange("settings")}
              >
                Settings
              </TabButton>
            </TabsBar>
            {activeTab === "profile" && user && (
              <>
                <ProfileAbout user={user} />
                <ContentSection>
                  <SectionHeader>
                    <SectionTitleStyled>🎬 Recent Activity</SectionTitleStyled>
                  </SectionHeader>
                  {recentMovies.length > 0 ? (
                    <MoviesGrid
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {recentMovies.map((movie, index) => (
                        <motion.div
                          key={movie.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <MovieCard movie={movie} />
                        </motion.div>
                      ))}
                    </MoviesGrid>
                  ) : (
                    <EmptyState>
                      <EmptyIcon>🎬</EmptyIcon>
                      <EmptyTitle>No recent activity</EmptyTitle>
                      <EmptyText>
                        Start watching movies to see them here
                      </EmptyText>
                    </EmptyState>
                  )}
                </ContentSection>
              </>
            )}
            {activeTab === "watchlist" && (
              <ContentSection>
                <SectionHeader>
                  <SectionTitleStyled>📺 Watchlist</SectionTitleStyled>
                </SectionHeader>
                <MovieList
                  movies={watchlist}
                  emptyIcon="📺"
                  emptyTitle="No movies in your watchlist"
                  emptyText="Add movies to your watchlist to see them here"
                />
              </ContentSection>
            )}
            {activeTab === "recommendations" && (
              <ContentSection>
                <SectionHeader>
                  <SectionTitleStyled>✨ Recommendations</SectionTitleStyled>
                </SectionHeader>
                <MovieList
                  movies={recommendations}
                  emptyIcon="✨"
                  emptyTitle="No recommendations yet"
                  emptyText="Get recommendations by watching and rating movies"
                />
              </ContentSection>
            )}
            {activeTab === "settings" && user && (
              <ContentSection>
                <SectionHeader>
                  <SectionTitleStyled>
                    <Settings size={20} />
                    Settings
                  </SectionTitleStyled>
                </SectionHeader>
                <SettingsForm user={user} onSave={handleSaveSettings} />
                {settingsSaved && (
                  <div style={{ color: "#06b6d4", marginTop: "1rem" }}>
                    Settings saved!
                  </div>
                )}
              </ContentSection>
            )}
          </ProfileContent>
        </ProfileGrid>
      </Section>
    </ProfileContainer>
  );
}

export default Profile;
