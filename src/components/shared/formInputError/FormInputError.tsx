import styled from "styled-components";
import { LuTriangleAlert } from "react-icons/lu";

interface Props {
  error: string;
}

const ErrorText = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #a4202a;
`;

export const FormInputError: React.FunctionComponent<Props> = ({ error }) => {
  return (
    <ErrorText>
      <LuTriangleAlert />
      {error}
    </ErrorText>
  );
};
