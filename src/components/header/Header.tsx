import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { LuPlane } from "react-icons/lu";

const HeaderWrapper = styled.header`
  background-color: #0b2545;
  display: flex;
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 0 40px;
`;

const Skyops = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  text-decoration: none;
  font-size: 17px;
  font-weight: 600;
`;

const LogoMark = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #1b63d6;
  color: #ffffff;
`;

const LinkGroup = styled.div`
  display: flex;
`;

const StyledLink = styled(NavLink)`
  padding: 18px 16px;
  color: #a9b8ce;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 3px solid transparent;

  &:hover {
    color: #ffffff;
  }

  &.active {
    color: #ffffff;
    border-bottom-color: #5b9bff;
  }
`;

export const Header = () => {
  return (
    <HeaderWrapper>
      <NavBar>
        <Skyops to="/flights">
          <LogoMark>
            <LuPlane size={20} />
          </LogoMark>
          SkyOps
        </Skyops>
        <LinkGroup>
          <StyledLink to="/flights">Flights</StyledLink>
          <StyledLink to="/passengers">Passengers</StyledLink>
          <StyledLink to="/tickets">Tickets</StyledLink>
        </LinkGroup>
      </NavBar>
    </HeaderWrapper>
  );
};
