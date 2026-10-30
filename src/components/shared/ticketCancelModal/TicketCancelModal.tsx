import type React from "react";
import { Button, ButtonVariant } from "../button/Button";
import styled from "styled-components";
import { IconButton } from "../iconButton/IconButton";
import { LuX } from "react-icons/lu";
import { WarningBox } from "../warningBox/WarningBox";

interface Props {
  seatNumber: string;
  flightNumber: string;
  handleClose: () => void;
  handleCancel: () => void;
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
  z-index: 9999;
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

export const TicketCancelModal: React.FunctionComponent<Props> = ({
  seatNumber,
  flightNumber,
  handleClose,
  handleCancel,
}) => {
  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>
          <HeaderTitle>Cancel ticket</HeaderTitle>
          <IconButton handleButton={handleClose}>
            <LuX />
          </IconButton>
        </ModalHeader>
        <ModalBody>
          <div>
            Cancel seat <b>{seatNumber}</b> on <b>{flightNumber}</b>?
          </div>
          <WarningBox>
            The seat stays blocked after cancelling. No seat is released.
          </WarningBox>
        </ModalBody>
        <ModalFooter>
          <Button label="Keep ticket" handleButton={handleClose} />
          <Button
            label="Cancel ticket"
            variant={ButtonVariant.DANGER}
            handleButton={handleCancel}
          />
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};
