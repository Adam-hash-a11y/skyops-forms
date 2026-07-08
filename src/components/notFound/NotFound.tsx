import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  text-align: center;
  padding: 60px 0;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 12px;
`;

const StyledLink = styled(Link)`
  color: #2563eb;
  font-weight: 600;
`;

export const NotFound = () => {
  return (
    <Wrapper>
      <Title>404 - Page Not Found</Title>
      <StyledLink to="/">Back to Home</StyledLink>
    </Wrapper>
  );
};
