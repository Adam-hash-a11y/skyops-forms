import styled from "styled-components";
import { LuTriangleAlert } from "react-icons/lu";
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
  return (
    <ErrorText>
      <LuTriangleAlert />
      {message}
    </ErrorText>
  );
};
