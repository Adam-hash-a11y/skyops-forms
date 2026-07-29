import { NavLink } from "react-router-dom";
import styled from "styled-components";

const HeaderWrapper = styled.header`
  background-color: white;
  border-bottom: 1px solid #e2e2ea;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  padding: 18px 32px;
  justify-content: space-between;
`;

const Brand = styled.h2`
  color: #1e1b2e;
  margin: 0;
  margin-right: 48px;
  font-size: 19px;
  font-weight: 700;
`;

const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const StyledLink = styled(NavLink)`
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 0;
  border-bottom: 2px solid transparent;

  &:hover {
    color: #1e1b2e;
  }

  &.active {
    color: #6d5ef8;
    border-bottom: 2px solid #6d5ef8;
  }
`;

export const Header = () => {
  return (
    <HeaderWrapper>
      <Nav>
        <Brand>SkyOps</Brand>
        <LinkGroup>
          <StyledLink to="/" end>
            Home
          </StyledLink>
          <StyledLink to="/flight">Flight Form</StyledLink>
          <StyledLink to="/passenger">Passenger Form</StyledLink>
          <StyledLink to="/flights">Flights List</StyledLink>
          <StyledLink to="/passengers">Passengers List</StyledLink>
          <StyledLink to="/counter">Counter</StyledLink>
        </LinkGroup>
      </Nav>
    </HeaderWrapper>
  );
};
