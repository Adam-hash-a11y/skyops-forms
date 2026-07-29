import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  background-color: white;
  border-top: 1px solid #e2e2ea;
  margin-top: 40px;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 40px;
  max-width: 1140px;
  margin: 0 auto;
  padding: 48px 24px 32px;
`;

const BrandColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 280px;
`;

const BrandName = styled.h3`
  color: #1e1b2e;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

const BrandBlurb = styled.p`
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 4px;
`;

const SocialLink = styled.a`
  color: #64748b;
  font-size: 18px;
  transition: color 0.15s ease;

  &:hover {
    color: #6d5ef8;
  }
`;

const LinksColumn = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ColumnTitle = styled.h4`
  color: #1e1b2e;
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const FooterLink = styled(NavLink)`
  color: #64748b;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    color: #6d5ef8;
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid #e2e2ea;
  padding: 16px 24px;
  text-align: center;
`;

const Copyright = styled.p`
  color: #94a3b8;
  font-size: 13px;
  margin: 0;
`;

export const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <BrandColumn>
          <BrandName>SkyOps</BrandName>
          <BrandBlurb>
            Flight and passenger management, built for operations teams that
            need clarity and speed.
          </BrandBlurb>
          <SocialRow>
            <SocialLink
              href="https://github.com/Adam-hash-a11y"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/adam-hamdi/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </SocialLink>
            <SocialLink
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaXTwitter />
            </SocialLink>
          </SocialRow>
        </BrandColumn>

        <LinksColumn aria-label="Footer navigation">
          <ColumnTitle>Product</ColumnTitle>
          <FooterLink to="/flight">Flight Form</FooterLink>
          <FooterLink to="/flights">Flights List</FooterLink>
          <FooterLink to="/passenger">Passenger Form</FooterLink>
          <FooterLink to="/passengers">Passengers List</FooterLink>
        </LinksColumn>
      </FooterContent>

      <BottomBar>
        <Copyright>&copy; 2026 SkyOps. All rights reserved.</Copyright>
      </BottomBar>
    </FooterWrapper>
  );
};
