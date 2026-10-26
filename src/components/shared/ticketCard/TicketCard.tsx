import type React from "react";
import styled from "styled-components";
import { StatusBadge } from "../statusBadge/StatusBadge";
import { Button, ButtonVariant } from "../button/Button";
import { formatUtcDate, formatUtcTime } from "../../../utils/formatDateTime";
import { priceFormatter } from "../../../utils/priceFormater";

interface Props {
  passengerName: string;
  flightNumber: string;
  origin: string;
  destination: string;
  status: string;
  seatNumber: string;
  ticketClass: string;
  price: number;
  createdAt: string;
  cancelDisabled: boolean;
  isDeletedPassenger: boolean;
  isDeletedFlight: boolean;
  handleCancel: () => void;
}

const TicketCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid #dce2eb;
  gap: 18px;
  width: 32%;
  padding: 20px;
  background-color: #fff;
  @media (max-width: 1220px) {
    width: 49%;
  }
  @media (max-width: 760px) {
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PassengerName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1b63d6;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const DeletedPassengerName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #566377;
`;

const FlightLine = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #566377;
`;

const FlightNumber = styled.span`
  color: #1b63d6;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const DeletedFlightNumber = styled.span`
  color: #566377;
`;

const FlightSeparator = styled.span`
  color: #566377;
`;

const FlightRoute = styled.span`
  color: #566377;
`;

const Details = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: #f2f4f8;
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
`;

const DetailLabel = styled.div`
  font-size: 12px;
  color: #566377;
`;

const DetailValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #162033;
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #edf0f5;
  padding-top: 10px;
`;

const BookedAt = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #566377;
`;

export const TicketCard: React.FunctionComponent<Props> = ({
  passengerName,
  flightNumber,
  origin,
  destination,
  status,
  seatNumber,
  ticketClass,
  price,
  cancelDisabled,
  createdAt,
  isDeletedPassenger,
  isDeletedFlight,
  handleCancel,
}) => {
  return (
    <TicketCardContainer>
      <Header>
        <HeaderInfo>
          {isDeletedPassenger ? (
            <DeletedPassengerName>{passengerName}</DeletedPassengerName>
          ) : (
            <PassengerName>{passengerName}</PassengerName>
          )}
          <FlightLine>
            {isDeletedFlight ? (
              <DeletedFlightNumber>{flightNumber}</DeletedFlightNumber>
            ) : (
              <FlightNumber>{flightNumber}</FlightNumber>
            )}
            <FlightSeparator>·</FlightSeparator>
            <FlightRoute>
              {origin} → {destination}
            </FlightRoute>
          </FlightLine>
        </HeaderInfo>
        <StatusBadge status={status} />
      </Header>
      <Details>
        <DetailBox>
          <DetailLabel>Seat</DetailLabel>
          <DetailValue>{seatNumber}</DetailValue>
        </DetailBox>
        <DetailBox>
          <DetailLabel>Class</DetailLabel>
          <DetailValue>{ticketClass}</DetailValue>
        </DetailBox>
        <DetailBox>
          <DetailLabel>Price</DetailLabel>
          <DetailValue>{priceFormatter.format(price)}</DetailValue>
        </DetailBox>
      </Details>

      <CardFooter>
        <BookedAt>
          Booked {formatUtcDate(createdAt)}, {formatUtcTime(createdAt)}
        </BookedAt>
        <Button
          label="Cancel ticket"
          handleButton={handleCancel}
          variant={ButtonVariant.DANGER_OUTLINE_SMALL}
          disabled={cancelDisabled}
        />
      </CardFooter>
    </TicketCardContainer>
  );
};
