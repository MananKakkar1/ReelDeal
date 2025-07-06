import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #06b6d4, transparent);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;

  @media (min-width: 640px) {
    padding: 3rem 2rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem 2rem;
  }
`;

const FooterMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 3rem;
  }
`;

const BrandSection = styled(motion.div)`
  flex: 1;
  max-width: 400px;
`;

const BrandLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LogoIcon = styled.div`
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 12px rgba(6, 182, 212, 0.4));
`;

const LogoText = styled.span`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BrandDescription = styled.p`
  color: #94a3b8;
  margin-bottom: 2rem;
  line-height: 1.7;
  font-size: 1rem;
  font-weight: 400;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.08);
  color: #94a3b8;
  transition: all 0.3s ease;
  border: 1px solid rgba(148, 163, 184, 0.15);
  backdrop-filter: blur(10px);

  &:hover {
    background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(6, 182, 212, 0.3);
    border-color: transparent;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const QuickLinksSection = styled(motion.div)`
  flex: 1;
  max-width: 500px;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 1.5rem;
  position: relative;
  letter-spacing: 0.025em;

  &::after {
    content: "";
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 3rem;
    height: 3px;
    background: linear-gradient(90deg, #06b6d4, #2563eb);
    border-radius: 2px;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
`;

const FooterLink = styled(Link)`
  color: #94a3b8;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  position: relative;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  background: rgba(148, 163, 184, 0.05);
  border: 1px solid transparent;

  &:hover {
    color: #06b6d4;
    background: rgba(6, 182, 212, 0.1);
    border-color: rgba(6, 182, 212, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.15);
  }
`;

const FooterBottom = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`;

const Copyright = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  font-weight: 400;
`;

const PoweredBy = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 400;

  &::before {
    content: "⚡";
    font-size: 1rem;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterMain>
          {/* Brand Section */}
          <BrandSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <BrandLink to="/">
              <LogoIcon>🎬</LogoIcon>
              <LogoText>ReelDeal</LogoText>
            </BrandLink>
            <BrandDescription>
              Discover, rate, and review your favorite movies. Join our
              community of film enthusiasts and never run out of great movies to
              watch. Your ultimate destination for cinematic exploration.
            </BrandDescription>
          </BrandSection>

          {/* Quick Links */}
          <QuickLinksSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <SectionTitle>Quick Links</SectionTitle>
            <FooterLinks>
              <li>
                <FooterLink to="/">Home</FooterLink>
              </li>
              <li>
                <FooterLink to="/search">Search Movies</FooterLink>
              </li>
              <li>
                <FooterLink to="/recommendations">Recommendations</FooterLink>
              </li>
              <li>
                <FooterLink to="/watchlist">Watchlist</FooterLink>
              </li>
              <li>
                <FooterLink to="/profile">Profile</FooterLink>
              </li>
            </FooterLinks>
          </QuickLinksSection>
        </FooterMain>

        <FooterBottom
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Copyright>© 2025 ReelDeal. All rights reserved.</Copyright>
          <PoweredBy>Powered by TMDB API</PoweredBy>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
