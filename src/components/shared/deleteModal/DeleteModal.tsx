import type React from "react";
import { Button, ButtonVariant } from "../button/Button";
import styled from "styled-components";
import { IconButton } from "../iconButton/IconButton";
import { LuX } from "react-icons/lu";
import { WarningBox } from "../warningBox/WarningBox";

interface Props {
  title: string;
  action: string;
  itemName: string;
  handleClose: () => void;
  ticketCount?: number;
  deleteButtonLabel: string;
  handleDelete: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  border-radius: 12px;
  width: 440px;
  background-color: white;

  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 24px;
  align-items: center;
  border-bottom: 1px solid #dce2eb;
`;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  flex: 1;
`;
const ModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: #f2f4f8;
  border-top: 1px solid #dce2eb;
  padding: 16px 24px;
  border-radius: 0 0 12px 12px;
  gap: 10px;
`;

export const DeleteModal: React.FunctionComponent<Props> = ({
  title,
  handleClose,
  action,
  itemName,
  ticketCount,
  deleteButtonLabel,
  handleDelete,
}) => {
  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>
          <HeaderTitle>{title}</HeaderTitle>
          <IconButton handleButton={handleClose}>
            <LuX />
          </IconButton>
        </ModalHeader>
        <ModalBody>
          <div>
            {action} <b>{itemName}</b> ? This cannot be undone.
          </div>
          <WarningBox>
            {ticketCount} tickets reference this flight. The API does not remove
            them; they will show as deleted.
          </WarningBox>
        </ModalBody>
        <ModalFooter>
          <Button label="Cancel" handleButton={handleClose} />
          <Button
            label={deleteButtonLabel}
            variant={ButtonVariant.DANGER}
            handleButton={handleDelete}
          />
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};
