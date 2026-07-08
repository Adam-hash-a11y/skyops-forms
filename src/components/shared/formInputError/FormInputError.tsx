import React from "react";
import styled from "styled-components";

interface Props {
  error: string;
}

const ErrorText = styled.div`
  color: #dc2626;
  font-size: 13px;
  margin: -4px 0 8px 0;
`;

export const FormInputError: React.FunctionComponent<Props> = ({ error }) => {
  return <ErrorText>{error}</ErrorText>;
};
