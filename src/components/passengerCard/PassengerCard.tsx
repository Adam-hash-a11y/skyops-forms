import styled from "styled-components";
import { IconButton, IconButtonVariant } from "../shared/iconButton/IconButton";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuArrowRight, LuPencil, LuTicket, LuTrash2 } from "react-icons/lu";
import type { FunctionComponent } from "react";
import { formatUtcDate } from "../../utils/formatDateTime";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { theme } from "../../theme/theme";

interface Props {
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  handleBook?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
}

const PassengerCardContainer = styled.div`
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.main};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[18]};
  width: 32%;
  padding: ${theme.spacing[20]};
  background-color: ${theme.colors.background.paper};

  @media (max-width: ${theme.breakpoints.desktop}) {
    width: 49%;
  }
  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PassengerInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing[12]};
`;

const Avatar = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${theme.borderRadius.round};
  background-color: ${theme.colors.status.info.background};
  color: ${theme.colors.primary.main};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  flex: none;
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const PassengerName = styled.p`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
`;

const PassportNumber = styled.p`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.secondary};
`;

const NationalityBadge = styled.span`
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 ${theme.spacing[10]};
  border-radius: ${theme.borderRadius.pill};
  background-color: ${theme.colors.background.subtle};
  color: ${theme.colors.text.badge};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[8]};
  font-size: ${theme.fontSizes.sm};
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: ${theme.spacing[12]};
`;

const DetailLabel = styled.span`
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.secondary};
`;

const DetailValue = styled.span`
  font-weight: ${theme.fontWeights.medium};
  text-align: right;
`;

const CardDivider = styled.div`
  height: 1px;
  background-color: ${theme.colors.border.light};
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TicketsLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing[5]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.primary.main};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const FooterActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing[5]};
`;

export const PassengerCard: FunctionComponent<Props> = ({
  firstName,
  lastName,
  passportNumber,
  nationality,
  dateOfBirth,
  email,
  phoneNumber,
  handleBook,
  handleEdit,
  handleDelete,
}) => {
  const { t } = useTranslation();

  return (
    <PassengerCardContainer>
      <CardHeader>
        <PassengerInfo>
          <Avatar>
            {firstName[0]}
            {lastName[0]}
          </Avatar>
          <NameBlock>
            <PassengerName>
              {firstName} {lastName}
            </PassengerName>
            <PassportNumber>{passportNumber}</PassportNumber>
          </NameBlock>
        </PassengerInfo>
        <NationalityBadge>{nationality}</NationalityBadge>
      </CardHeader>

      <Details>
        <DetailRow>
          <DetailLabel>{t("passengerCard.dateOfBirth")}</DetailLabel>
          <DetailValue>{formatUtcDate(dateOfBirth)}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>{t("passengerCard.email")}</DetailLabel>
          <DetailValue>{email}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>{t("passengerCard.phone")}</DetailLabel>
          <DetailValue>{phoneNumber}</DetailValue>
        </DetailRow>
      </Details>

      <CardDivider></CardDivider>
      <CardFooter>
        <TicketsLink to={"/passengers/" + passportNumber}>
          {t("passengerCard.viewTickets")}
          <LuArrowRight />
        </TicketsLink>
        <FooterActions>
          <Button
            label={t("passengerCard.book")}
            handleButton={handleBook}
            variant={ButtonVariant.OUTLINE_SMALL}
          >
            <LuTicket />
          </Button>
          <IconButton handleButton={handleEdit}>
            <LuPencil />
          </IconButton>
          <IconButton
            handleButton={handleDelete}
            variant={IconButtonVariant.DANGER}
          >
            <LuTrash2 />
          </IconButton>
        </FooterActions>
      </CardFooter>
    </PassengerCardContainer>
  );
};
