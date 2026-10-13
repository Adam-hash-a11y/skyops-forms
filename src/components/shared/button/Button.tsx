import type { ReactNode } from "react";
import styled, { css } from "styled-components";

export enum ButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  DANGER = "danger",
  DANGER_OUTLINE = "dangerOutline",
  OUTLINE_SMALL = "outlineSmall",
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
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  border: none;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

const PrimaryButton = styled.button`
  ${baseButtonStyles}
  background-color: #1b63d6;
  color: #ffffff;

  &:hover:not(:disabled) {
    background-color: #1553b5;
  }
`;

const SecondaryButton = styled.button`
  ${baseButtonStyles}
  background-color: #ffffff;
  border: 1px solid #c9d2df;
  color: #162033;

  &:hover:not(:disabled) {
    background-color: #eef2f7;
  }
`;

const DangerButton = styled.button`
  ${baseButtonStyles}
  background-color: #c0262d;
  color: #ffffff;
`;

const DangerOutlineButton = styled.button`
  ${baseButtonStyles}
  background-color: #ffffff;
  border: 1px solid #c0262d;
  color: #a4202a;

  &:hover:not(:disabled) {
    background-color: #fde8e8;
  }
`;

const OutlineSmallButton = styled.button`
  ${baseButtonStyles}
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  background-color: #ffffff;
  border: 1px solid #1b63d6;
  color: #1b63d6;

  &:hover:not(:disabled) {
    background-color: #e7f0fd;
  }
`;

const variants = {
  [ButtonVariant.PRIMARY]: PrimaryButton,
  [ButtonVariant.SECONDARY]: SecondaryButton,
  [ButtonVariant.DANGER]: DangerButton,
  [ButtonVariant.DANGER_OUTLINE]: DangerOutlineButton,
  [ButtonVariant.OUTLINE_SMALL]: OutlineSmallButton,
};

export const Button: React.FunctionComponent<Props> = (p) => {
  const StyledButton = variants[p.variant ?? ButtonVariant.SECONDARY];

  return (
    <StyledButton disabled={p.disabled} onClick={p.handleButton}>
      {p.children}
      {p.label}
    </StyledButton>
  );
};
