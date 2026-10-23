import styled from "styled-components";
import { IconButton, IconButtonVariant } from "../shared/iconButton/IconButton";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuArrowRight, LuPencil, LuTicket, LuTrash2 } from "react-icons/lu";
import type { FunctionComponent } from "react";
import { formatUtcDate } from "../../utils/formatDateTime";

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
  border-radius: 10px;
  border: 1px solid #dce2eb;
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 32%;
  padding: 20px;
  background-color: #fff;

  @media (max-width: 1200px) {
    width: 49%;
  }
  @media (max-width: 900px) {
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
  gap: 12px;
`;

const Avatar = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: #e7f0fd;
  color: #1b63d6;
  font-size: 13px;
  font-weight: 600;
  flex: none;
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const PassengerName = styled.p`
  font-size: 15px;
  font-weight: 600;
`;

const PassportNumber = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #566377;
`;

const NationalityBadge = styled.span`
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  background-color: #eef2f7;
  color: #344054;
  font-size: 12px;
  font-weight: 600;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;

const DetailLabel = styled.span`
  font-weight: 400;
  color: #566377;
`;

const DetailValue = styled.span`
  font-weight: 500;
  text-align: right;
`;

const CardDivider = styled.div`
  height: 1px;
  background-color: #edf0f5;
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TicketsLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #1b63d6;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const FooterActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
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
          <DetailLabel>Date of birth</DetailLabel>
          <DetailValue>{formatUtcDate(dateOfBirth)}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Email</DetailLabel>
          <DetailValue>{email}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Phone</DetailLabel>
          <DetailValue>{phoneNumber}</DetailValue>
        </DetailRow>
      </Details>

      <CardDivider></CardDivider>
      <CardFooter>
        <TicketsLink>
          N tickets
          <LuArrowRight />
        </TicketsLink>

        <FooterActions>
          <Button
            label="Book"
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
