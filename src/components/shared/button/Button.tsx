import type { ReactNode } from "react";
import styled, { css } from "styled-components";

export enum ButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  DANGER = "danger",
}

interface Props {
  label: string;
  handleButton?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  variant?: ButtonVariant;
}

const baseButtonStyles = css`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin: 6px 6px 6px 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.15s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PrimaryButton = styled.button`
  ${baseButtonStyles}
  background-color: #16a34a;
  color: white;

  &:hover:not(:disabled) {
    background-color: #15803d;
  }
`;

const SecondaryButton = styled.button`
  ${baseButtonStyles}
  background-color: #e2e8f0;
  color: #334155;

  &:hover:not(:disabled) {
    background-color: #cbd5e1;
  }
`;

const DangerButton = styled.button`
  ${baseButtonStyles}
  background-color: #dc2626;
  color: white;

  &:hover:not(:disabled) {
    background-color: #b91c1c;
  }
`;

const variants = {
  [ButtonVariant.PRIMARY]: PrimaryButton,
  [ButtonVariant.SECONDARY]: SecondaryButton,
  [ButtonVariant.DANGER]: DangerButton,
};

export const Button: React.FunctionComponent<Props> = (p) => {
  const StyledButton = variants[p.variant ?? ButtonVariant.SECONDARY];

  if (p.children) {
    return (
      <StyledButton disabled={p.disabled} onClick={p.handleButton}>
        {p.children} {p.label}
      </StyledButton>
    );
  }
  return (
    <StyledButton disabled={p.disabled} onClick={p.handleButton}>
      {p.label}
    </StyledButton>
  );
};
