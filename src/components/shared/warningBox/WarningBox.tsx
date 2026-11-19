import type React from "react";
import styled from "styled-components";
import { LuCircleAlert } from "react-icons/lu";
import { theme } from "../../../theme/theme";

interface Props {
  children: React.ReactNode;
}

const WarningWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing[10]};
  padding: ${theme.spacing[12]} ${theme.spacing[14]};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.status.warning.background};
  color: ${theme.colors.status.warning.text};
  font-size: ${theme.fontSizes.sm};
`;

const WarningIcon = styled.span`
  font-size: ${theme.fontSizes.lg};
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
