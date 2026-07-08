import styled from "styled-components";

const FooterWrapper = styled.footer`
  padding: 16px 24px;
  background-color: #0f172a;
  color: #94a3b8;
  text-align: center;
  font-size: 13px;
  margin-top: 40px;
`;

export const Footer = () => {
  return <FooterWrapper>© 2026 SkyOps</FooterWrapper>;
};
