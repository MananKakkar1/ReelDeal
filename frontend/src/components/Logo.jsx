import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.5rem;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
`;

const LogoIcon = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(6, 182, 212, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.9);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
  }
`;

const LogoText = styled.span`
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  letter-spacing: -0.5px;
`;

const DealBadge = styled.span`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  margin-left: 0.5rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
`;

function Logo({ onClick, showBadge = true }) {
  return (
    <LogoContainer
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <LogoIcon />
      <LogoText>Reel</LogoText>
      {showBadge && <DealBadge>DEAL</DealBadge>}
    </LogoContainer>
  );
}

export default Logo; 