import type { ReactNode } from "react";
import styled, { css } from "styled-components";
import { theme } from "../../../theme/theme";

export enum IconButtonVariant {
  DEFAULT = "default",
  DANGER = "danger",
}

interface Props {
  handleButton?: () => void;
  children?: ReactNode;
  variant?: IconButtonVariant;
}

const baseIconButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  background-color: transparent;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.lg};
  cursor: pointer;
`;

const DefaultIconButton = styled.button`
  ${baseIconButtonStyles}

  &:hover {
    background-color: ${theme.colors.background.subtle};
    color: ${theme.colors.text.primary};
  }
`;

const DangerIconButton = styled.button`
  ${baseIconButtonStyles}

  &:hover {
    background-color: ${theme.colors.status.error.background};
    color: ${theme.colors.status.error.text};
  }
`;

const variants = {
  [IconButtonVariant.DEFAULT]: DefaultIconButton,
  [IconButtonVariant.DANGER]: DangerIconButton,
};

export const IconButton: React.FunctionComponent<Props> = ({
  handleButton,
  children,
  variant,
}) => {
  const StyledIconButton = variants[variant ?? IconButtonVariant.DEFAULT];

  return <StyledIconButton onClick={handleButton}>{children}</StyledIconButton>;
};
