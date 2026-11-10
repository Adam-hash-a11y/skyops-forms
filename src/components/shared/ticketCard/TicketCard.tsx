import type React from "react";
import styled from "styled-components";
import { StatusBadge } from "../statusBadge/StatusBadge";
import { Button, ButtonVariant } from "../button/Button";
import { formatUtcDate, formatUtcTime } from "../../../utils/formatDateTime";
import { priceFormatter } from "../../../utils/priceFormater";
import type { TicketClass, TicketStatus } from "../../../types/ticketTypes";
import { theme } from "../../../theme/theme";

interface Props {
  passengerName: string;
  flightNumber: string;
  origin: string;
  destination: string;
  status: TicketStatus;
  seatNumber: string;
  ticketClass: TicketClass;
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
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.main};
  gap: ${theme.spacing[18]};
  width: 32%;
  padding: ${theme.spacing[20]};
  background-color: ${theme.colors.background.paper};
  @media (max-width: ${theme.breakpoints.ticketTablet}) {
    width: 49%;
  }
  @media (max-width: ${theme.breakpoints.ticketMobile}) {
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: ${theme.spacing[8]};
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PassengerName = styled.div`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.primary.main};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const DeletedPassengerName = styled.div`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.secondary};
`;

const FlightLine = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing[8]};
  margin-top: ${theme.spacing[4]};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.secondary};
`;

const FlightNumber = styled.span`
  color: ${theme.colors.primary.main};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const DeletedFlightNumber = styled.span`
  color: ${theme.colors.text.secondary};
`;

const FlightSeparator = styled.span`
  color: ${theme.colors.text.secondary};
`;

const FlightRoute = styled.span`
  color: ${theme.colors.text.secondary};
`;

const Details = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing[8]};
`;

const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  background-color: ${theme.colors.background.main};
  flex: 1;
  padding: ${theme.spacing[10]} ${theme.spacing[12]};
  border-radius: ${theme.borderRadius.md};
`;

const DetailLabel = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
`;

const DetailValue = styled.div`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${theme.colors.border.light};
  padding-top: ${theme.spacing[10]};
`;

const BookedAt = styled.div`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.secondary};
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
