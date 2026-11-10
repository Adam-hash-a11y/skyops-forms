import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { LuPlane } from "react-icons/lu";
import { theme } from "../../theme/theme";

const HeaderWrapper = styled.header`
  background-color: ${theme.colors.header.background};
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[40]};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[24]};
`;

const Skyops = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[10]};
  color: ${theme.colors.background.paper};
  text-decoration: none;
  font-size: ${theme.fontSizes.brand};
  font-weight: ${theme.fontWeights.semibold};
`;

const LogoMark = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.background.paper};
`;

const LinkGroup = styled.div`
  display: flex;
`;

const StyledLink = styled(Link)`
  padding: ${theme.spacing[18]} ${theme.spacing[16]};
  color: ${theme.colors.header.link};
  text-decoration: none;
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
  border-bottom: 3px solid transparent;

  &:hover {
    color: ${theme.colors.background.paper};
  }

  &.active {
    color: ${theme.colors.background.paper};
    border-bottom-color: ${theme.colors.header.linkActive};
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
