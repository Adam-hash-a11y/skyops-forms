import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background-color: #0f172a;
`;

const Title = styled.h2`
  color: white;
  margin: 0;
  margin-right: 20px;
  font-size: 18px;
`;

const StyledLink = styled(Link)`
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    color: white;
  }
`;

export const Header = () => {
  return (
    <Nav>
      <Title>SkyOps</Title>
      <StyledLink to="/">Home</StyledLink>
      <StyledLink to="/flight">Flight Form</StyledLink>
      <StyledLink to="/passenger">Passenger Form</StyledLink>
      <StyledLink to="/flights">Flights List</StyledLink>
      <StyledLink to="/counter">Counter</StyledLink>
    </Nav>
  );
};
