import type { ReactNode } from "react";
import styled, { css } from "styled-components";
import { theme } from "../../../theme/theme";

export enum ButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  DANGER = "danger",
  DANGER_OUTLINE = "dangerOutline",
  DANGER_OUTLINE_SMALL = "dangerOutlineSmall",
  OUTLINE_SMALL = "outlineSmall",
  FILTER = "filter",
}

interface Props {
  label: string;
  handleButton?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  variant?: ButtonVariant;
}

const baseButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[8]};
  height: 38px;
  padding: 0 ${theme.spacing[16]};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-family: inherit;
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

const PrimaryButton = styled.button`
  ${baseButtonStyles}
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.background.paper};

  &:hover:not(:disabled) {
    background-color: ${theme.colors.primary.dark};
  }
`;

const SecondaryButton = styled.button`
  ${baseButtonStyles}
  background-color: ${theme.colors.background.paper};
  border: 1px solid ${theme.colors.border.dashed};
  color: ${theme.colors.text.primary};

  &:hover:not(:disabled) {
    background-color: ${theme.colors.background.subtle};
  }
`;

const DangerButton = styled.button`
  ${baseButtonStyles}
  background-color: ${theme.colors.status.error.main};
  color: ${theme.colors.background.paper};
`;

const DangerOutlineButton = styled.button`
  ${baseButtonStyles}
  background-color: ${theme.colors.background.paper};
  border: 1px solid ${theme.colors.status.error.main};
  color: ${theme.colors.status.error.text};

  &:hover:not(:disabled) {
    background-color: ${theme.colors.status.error.background};
  }
`;

const DangerOutlineSmallButton = styled.button`
  ${baseButtonStyles}
  gap: ${theme.spacing[6]};
  height: 32px;
  padding: 0 ${theme.spacing[12]};
  font-size: ${theme.fontSizes.sm};
  background-color: ${theme.colors.background.paper};
  border: 1px solid ${theme.colors.status.error.main};
  color: ${theme.colors.status.error.text};

  &:hover:not(:disabled) {
    background-color: ${theme.colors.status.error.background};
  }

  &:disabled {
    border-color: ${theme.colors.status.error.main};
    color: ${theme.colors.status.error.text};
    background-color: ${theme.colors.background.main};
    cursor: not-allowed;
  }
`;

const OutlineSmallButton = styled.button`
  ${baseButtonStyles}
  gap: ${theme.spacing[6]};
  height: 32px;
  padding: 0 ${theme.spacing[12]};
  font-size: ${theme.fontSizes.sm};
  background-color: ${theme.colors.background.paper};
  border: 1px solid ${theme.colors.primary.main};
  color: ${theme.colors.primary.main};

  &:hover:not(:disabled) {
    background-color: ${theme.colors.status.info.background};
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 ${theme.spacing[12]};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  background-color: transparent;
  color: ${theme.colors.primary.main};
  font-family: inherit;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.status.info.background};
  }
`;

const variants = {
  [ButtonVariant.PRIMARY]: PrimaryButton,
  [ButtonVariant.SECONDARY]: SecondaryButton,
  [ButtonVariant.DANGER]: DangerButton,
  [ButtonVariant.DANGER_OUTLINE]: DangerOutlineButton,
  [ButtonVariant.DANGER_OUTLINE_SMALL]: DangerOutlineSmallButton,
  [ButtonVariant.OUTLINE_SMALL]: OutlineSmallButton,
  [ButtonVariant.FILTER]: FilterButton,
};

export const Button: React.FunctionComponent<Props> = ({
  disabled,
  handleButton,
  children,
  label,
  variant,
}) => {
  const StyledButton = variants[variant ?? ButtonVariant.SECONDARY];

  return (
    <StyledButton disabled={disabled} onClick={handleButton}>
      {children}
      {label}
    </StyledButton>
  );
};
