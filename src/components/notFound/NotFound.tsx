import { Link } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { theme } from "../../theme/theme";

const Wrapper = styled.div`
  text-align: center;
  padding: ${theme.spacing[60]} 0;
`;

const Title = styled.h2`
  font-size: ${theme.fontSizes.xxl};
  margin-bottom: ${theme.spacing[12]};
`;

const StyledLink = styled(Link)`
  color: ${theme.colors.accent};
  font-weight: ${theme.fontWeights.semibold};
`;

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Title>{t("notFound.title")}</Title>
      <StyledLink to="/flights">{t("notFound.back")}</StyledLink>
    </Wrapper>
  );
};
