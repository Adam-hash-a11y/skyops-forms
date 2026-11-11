import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { LuPlane } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { GB, FR, DE } from "country-flag-icons/react/3x2";
import { theme } from "../../theme/theme";

const languages = [
  { code: "en", Flag: GB },
  { code: "fr", Flag: FR },
  { code: "de", Flag: DE },
];

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

const LanguageWrapper = styled.div`
  position: relative;
  margin-left: auto;
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[8]};
  height: 32px;
  padding: 0 ${theme.spacing[10]};
  border: 1px solid ${theme.colors.header.link};
  border-radius: ${theme.borderRadius.sm};
  background-color: transparent;
  color: ${theme.colors.background.paper};
  font-family: inherit;
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;

  svg {
    width: 20px;
    height: 13px;
  }

  &:hover {
    border-color: ${theme.colors.header.linkActive};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${theme.spacing[6]};
  width: 110px;
  padding: ${theme.spacing[4]};
  background-color: ${theme.colors.background.paper};
  border: 1px solid ${theme.colors.border.main};
  border-radius: ${theme.borderRadius.sm};
  z-index: ${theme.zIndex.modal};
`;

const LanguageOption = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[8]};
  width: 100%;
  height: 30px;
  padding: 0 ${theme.spacing[8]};
  border: none;
  border-radius: ${theme.borderRadius.xs};
  background-color: transparent;
  color: ${theme.colors.text.secondary};
  font-family: inherit;
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;

  svg {
    width: 20px;
    height: 13px;
  }

  &:hover {
    background-color: ${theme.colors.background.subtle};
  }

  &.active {
    background-color: ${theme.colors.status.info.background};
    color: ${theme.colors.primary.main};
  }
`;

export const Header = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage =
    languages.find((language) => language.code === i18n.language) ??
    languages[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

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
            {t("header.flights")}
          </StyledLink>
          <StyledLink
            to="/passengers"
            className={
              location.pathname.startsWith("/passengers") ? "active" : ""
            }
          >
            {t("header.passengers")}
          </StyledLink>
          <StyledLink
            to="/tickets"
            className={location.pathname.startsWith("/tickets") ? "active" : ""}
          >
            {t("header.tickets")}
          </StyledLink>
        </LinkGroup>

        <LanguageWrapper>
          <LanguageButton
            type="button"
            aria-label={t("header.language")}
            onClick={() => setIsOpen(!isOpen)}
          >
            <currentLanguage.Flag />
            {currentLanguage.code.toUpperCase()}
          </LanguageButton>

          {isOpen && (
            <Dropdown>
              {languages.map(({ code, Flag }) => (
                <LanguageOption
                  key={code}
                  type="button"
                  className={code === currentLanguage.code ? "active" : ""}
                  onClick={() => handleLanguageChange(code)}
                >
                  <Flag />
                  {code.toUpperCase()}
                </LanguageOption>
              ))}
            </Dropdown>
          )}
        </LanguageWrapper>
      </NavBar>
    </HeaderWrapper>
  );
};
