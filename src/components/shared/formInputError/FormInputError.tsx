import styled from "styled-components";
import { LuTriangleAlert } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { theme } from "../../../theme/theme";

interface Props {
  message: string;
}

const ErrorText = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[6]};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.status.error.text};
`;

export const FormInputError: React.FunctionComponent<Props> = ({ message }) => {
  const { t } = useTranslation();

  return (
    <ErrorText>
      <LuTriangleAlert />
      {t(message)}
    </ErrorText>
  );
};
