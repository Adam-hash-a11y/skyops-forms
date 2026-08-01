import type React from "react";
import styled from "styled-components";
import { Button, ButtonVariant } from "../button/Button";
import { FaTrash, FaXmark } from "react-icons/fa6";

interface Props {
  label: string;
  isOpen: boolean;
  handleClose?: () => void;
  handleDelete: (key: number) => void;
  itemKey: number;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.section`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 400px;
`;

export const DeleteModal: React.FunctionComponent<Props> = ({
  label,
  isOpen,
  handleClose,
  handleDelete,
  itemKey,
}) => {
  if (!isOpen) {
    return null;
  } else {
    return (
      <Overlay>
        <ModalBox>
          <p>Are you sure you want to delete this {label}?</p>
          <Button
            handleButton={() => handleDelete(itemKey)}
            label="Confirm"
            variant={ButtonVariant.DANGER}
          >
            <FaTrash />
          </Button>
          <Button
            handleButton={handleClose}
            label="Cancel"
            variant={ButtonVariant.SECONDARY}
          >
            <FaXmark />
          </Button>
        </ModalBox>
      </Overlay>
    );
  }
};
