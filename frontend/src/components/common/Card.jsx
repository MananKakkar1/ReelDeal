import styled from "@emotion/styled";

const Card = styled.div`
  background: rgba(24, 24, 27, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  box-shadow: 0 2px 16px rgba(30, 41, 59, 0.1);
  border: 1px solid rgba(35, 35, 43, 0.6);
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: rgba(24, 24, 27, 0.4);
    border-color: rgba(6, 182, 212, 0.3);
    box-shadow: 0 8px 32px rgba(6, 182, 212, 0.15);
  }
`;

export default Card;
