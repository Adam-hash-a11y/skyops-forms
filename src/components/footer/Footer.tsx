import styled from "styled-components";

const FooterWrapper = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background-color: #0f172a;
  color: #94a3b8;
`;

const Brand = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: #f8fafc;
`;

const Tagline = styled.p`
  font-size: 0.95rem;
  color: #cbd5e1;
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  color: #94a3b8;
`;

export const Footer = () => {
  return (
    <FooterWrapper>
      <Brand>SkyOps</Brand>
      <Tagline>Flight operations, simplified</Tagline>
      <Copyright>© 2026 SkyOps. All rights reserved.</Copyright>
    </FooterWrapper>
  );
};
