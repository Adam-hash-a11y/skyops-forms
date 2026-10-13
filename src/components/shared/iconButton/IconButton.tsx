import type { ReactNode } from "react";
import styled, { css } from "styled-components";

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
  border-radius: 6px;
  background-color: transparent;
  color: #566377;
  font-size: 16px;
  cursor: pointer;
`;

const DefaultIconButton = styled.button`
  ${baseIconButtonStyles}

  &:hover {
    background-color: #eef2f7;
    color: #162033;
  }
`;

const DangerIconButton = styled.button`
  ${baseIconButtonStyles}

  &:hover {
    background-color: #fde8e8;
    color: #a4202a;
  }
`;

const variants = {
  [IconButtonVariant.DEFAULT]: DefaultIconButton,
  [IconButtonVariant.DANGER]: DangerIconButton,
};

export const IconButton: React.FunctionComponent<Props> = (p) => {
  const StyledIconButton = variants[p.variant ?? IconButtonVariant.DEFAULT];

  return (
    <StyledIconButton onClick={p.handleButton}>{p.children}</StyledIconButton>
  );
};
