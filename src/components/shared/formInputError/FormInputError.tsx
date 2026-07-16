import styled from "styled-components";

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin: 0;
`;

interface Props {
  error: string;
}

export const FormInputError: React.FunctionComponent<Props> = ({ error }) => {
  return <ErrorText>{error}</ErrorText>;
};