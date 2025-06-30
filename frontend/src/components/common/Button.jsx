import React from 'react';
import styled from '@emotion/styled';

const StyledButton = styled.button`
  padding: 0.6em 1.5em;
  border-radius: 999px;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  background: linear-gradient(90deg, #06b6d4 0%, #2563eb 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(22, 78, 99, 0.08);
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, opacity 0.2s;
  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #2563eb 0%, #06b6d4 100%);
    box-shadow: 0 4px 16px rgba(22, 78, 99, 0.12);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button = ({ children, ...props }) => <StyledButton {...props}>{children}</StyledButton>;

export default Button; 