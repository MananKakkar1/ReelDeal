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
  max-width: 7xl;
  margin: 0 auto;
  padding: 3rem 1rem;

  @media (min-width: 640px) {
    padding: 3rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 3rem 2rem;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 3rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 4rem;
  }
`;

const BrandSection = styled(motion.div)`
  @media (min-width: 768px) {
    grid-column: span 1;
  }
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
  font-size: 2rem;
  filter: drop-shadow(0 4px 8px rgba(6, 182, 212, 0.3));
`;

const LogoText = styled.span`
  font-size: 1.75rem;
  font-weight: 900;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BrandDescription = styled.p`
  color: #94a3b8;
  margin-bottom: 1.5rem;
  max-width: 24rem;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  transition: all 0.3s ease;
  border: 1px solid rgba(148, 163, 184, 0.2);

  &:hover {
    background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.25rem;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 2rem;
    height: 2px;
    background: linear-gradient(90deg, #06b6d4, #2563eb);
    border-radius: 1px;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLink = styled(Link)`
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  padding: 0.25rem 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, #06b6d4, #2563eb);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #06b6d4;
    transform: translateX(4px);

    &::before {
      width: 100%;
    }
  }
`;

const ExternalLink = styled.a`
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  padding: 0.25rem 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, #06b6d4, #2563eb);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #06b6d4;
    transform: translateX(4px);

    &::before {
      width: 100%;
    }
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
`;

const PoweredBy = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "⚡";
    font-size: 1rem;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
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
            <SocialLinks>
              <SocialLink
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </SocialLink>
              <SocialLink
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </SocialLink>
              <SocialLink
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </SocialLink>
            </SocialLinks>
          </BrandSection>

          {/* Quick Links */}
          <FooterSection
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
          </FooterSection>

          {/* Support */}
          <FooterSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <SectionTitle>Support</SectionTitle>
            <FooterLinks>
              <li>
                <ExternalLink href="#">Help Center</ExternalLink>
              </li>
              <li>
                <ExternalLink href="#">Contact Us</ExternalLink>
              </li>
              <li>
                <ExternalLink href="#">Privacy Policy</ExternalLink>
              </li>
              <li>
                <ExternalLink href="#">Terms of Service</ExternalLink>
              </li>
              <li>
                <ExternalLink href="#">FAQ</ExternalLink>
              </li>
            </FooterLinks>
          </FooterSection>

          {/* Community */}
          <FooterSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <SectionTitle>Community</SectionTitle>
            <FooterLinks>
              <li>
                <ExternalLink href="#">Discord</ExternalLink>
              </li>
              <li>
                <ExternalLink href="#">Reddit</ExternalLink>
              </li>
              <li>
                <ExternalLink href="#">Blog</ExternalLink>
              </li>
              <li>
                <ExternalLink href="#">Newsletter</ExternalLink>
              </li>
              <li>
                <ExternalLink href="#">Feedback</ExternalLink>
              </li>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <FooterBottom
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Copyright>© 2024 ReelDeal. All rights reserved.</Copyright>
          <PoweredBy>Powered by TMDB API</PoweredBy>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
