import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { LuPlane } from "react-icons/lu";

const HeaderWrapper = styled.header`
  background-color: #0b2545;
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
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

const StyledLink = styled(Link)`
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
  const location = useLocation();

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
          <StyledLink
            to="/flights"
            className={location.pathname.startsWith("/flights") ? "active" : ""}
          >
            Flights
          </StyledLink>
          <StyledLink
            to="/passengers"
            className={
              location.pathname.startsWith("/passengers") ? "active" : ""
            }
          >
            Passengers
          </StyledLink>
          <StyledLink
            to="/tickets"
            className={location.pathname.startsWith("/tickets") ? "active" : ""}
          >
            Tickets
          </StyledLink>
        </LinkGroup>
      </NavBar>
    </HeaderWrapper>
  );
};
