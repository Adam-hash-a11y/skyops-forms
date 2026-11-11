import type React from "react";
import { Button, ButtonVariant } from "../button/Button";
import styled from "styled-components";
import { IconButton } from "../iconButton/IconButton";
import { LuX } from "react-icons/lu";
import { WarningBox } from "../warningBox/WarningBox";
import { useTranslation } from "react-i18next";
import { theme } from "../../../theme/theme";

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
  background-color: ${theme.colors.overlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${theme.zIndex.modal};
`;

const ModalBox = styled.div`
  border-radius: ${theme.borderRadius.xl};
  width: 440px;
  background-color: ${theme.colors.background.paper};
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${theme.spacing[20]} ${theme.spacing[24]};
  align-items: center;
  border-bottom: 1px solid ${theme.colors.border.main};
`;

const HeaderTitle = styled.div`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[24]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[18]};
  overflow-y: auto;
  flex: 1;
`;

const ModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: ${theme.colors.background.main};
  border-top: 1px solid ${theme.colors.border.main};
  padding: ${theme.spacing[16]} ${theme.spacing[24]};
  border-radius: 0 0 ${theme.borderRadius.xl} ${theme.borderRadius.xl};
  gap: ${theme.spacing[10]};
`;

export const TicketCancelModal: React.FunctionComponent<Props> = ({
  seatNumber,
  flightNumber,
  handleClose,
  handleCancel,
}) => {
  const { t } = useTranslation();

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>
          <HeaderTitle>{t("ticketCancelModal.title")}</HeaderTitle>
          <IconButton handleButton={handleClose}>
            <LuX />
          </IconButton>
        </ModalHeader>
        <ModalBody>
          <div>
            {t("ticketCancelModal.cancelSeat")} <b>{seatNumber}</b>{" "}
            {t("ticketCancelModal.on")} <b>{flightNumber}</b>?
          </div>
          <WarningBox>{t("ticketCancelModal.warning")}</WarningBox>
        </ModalBody>
        <ModalFooter>
          <Button
            label={t("ticketCancelModal.keepTicket")}
            handleButton={handleClose}
          />
          <Button
            label={t("ticketCancelModal.title")}
            variant={ButtonVariant.DANGER}
            handleButton={handleCancel}
          />
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};
