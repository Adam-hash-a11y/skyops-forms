import React from "react";

interface Props {
  error: string;
}

export const FormInputError: React.FunctionComponent<Props> = ({ error }) => {
  return <div>{error}</div>;
};
