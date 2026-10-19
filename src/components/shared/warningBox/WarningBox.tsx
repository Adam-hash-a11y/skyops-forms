import type React from "react";
import styled from "styled-components";
import { LuCircleAlert } from "react-icons/lu";

interface Props {
  children: React.ReactNode;
}

const WarningWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  background-color: #fff1d6;
  color: #8a4b00;
  font-size: 13px;
`;

const WarningIcon = styled.span`
  font-size: 16px;
`;

export const WarningBox: React.FunctionComponent<Props> = ({ children }) => {
  return (
    <WarningWrapper>
      <WarningIcon>
        <LuCircleAlert />
      </WarningIcon>
      <div>{children}</div>
    </WarningWrapper>
  );
};
