import styled from "@emotion/styled";
import React from "react";

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #06b6d4;
  letter-spacing: -0.01em;
  width: 100%;
  text-align: center;

  @media (max-width: 640px) {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }
`;

const SectionTitle = ({ children, ...props }) => (
  <Title {...props}>{children}</Title>
);

export default SectionTitle;
