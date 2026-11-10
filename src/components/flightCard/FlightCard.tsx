import styled from "styled-components";
import { FlightIcon } from "../shared/fligthIcon/FlightIcon";
import { IconButton, IconButtonVariant } from "../shared/iconButton/IconButton";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuArrowRight, LuPencil, LuTicket, LuTrash2 } from "react-icons/lu";
import type { FunctionComponent } from "react";
import { StatusBadge } from "../shared/statusBadge/StatusBadge";
import { ProgressBar } from "../shared/progressBar/ProgressBar";
import { formatUtcDate, formatUtcTime } from "../../utils/formatDateTime";
import { getCityName } from "../../utils/cityNames";
import { Link } from "react-router-dom";
import type { FlightStatus } from "../../types/flightTypes";
import { theme } from "../../theme/theme";

interface Props {
  flightNumber: string;
  airline: string;
  status: FlightStatus;
  origin: string;
  destination: string;
  departureTime: string;
  departureDate: string;
  arrivalTime: string;
  arrivalDate: string;
  bookedSeats: number;
  totalSeats: number;
  bookDisabled: boolean;
  handleBook?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
}

const FlightCard = styled.div`
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
const AirlineInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Airline = styled.p`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
`;

const FlightNumber = styled.p`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.secondary};
`;

const Route = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: ${theme.spacing[18]};
  align-items: center;
`;

const CityIATA = styled.div`
  font-size: ${theme.fontSizes.display};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.header.background};
`;

const City = styled.div`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.secondary};
`;

const RouteStart = styled.div`
  text-align: left;
`;
const RouteEnd = styled.div`
  text-align: right;
`;

const FlightTimes = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FlightTimeDateBlockDeparture = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const FlightTimeDateBlockArrival = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
`;
const FlightTime = styled.div`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
`;

const FlightDate = styled.div`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.secondary};
`;

const FlightSeats = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[8]};
`;

const SeatsLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.secondary};
`;

const SeatsCount = styled.div`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
`;

const BookedSeatsCount = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

const FlightDetails = styled(Link)`
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

export const FligthCard: FunctionComponent<Props> = ({
  flightNumber,
  airline,
  status,
  origin,
  destination,
  departureTime,
  departureDate,
  arrivalTime,
  arrivalDate,
  bookedSeats,
  totalSeats,
  bookDisabled,
  handleBook,
  handleEdit,
  handleDelete,
}) => {
  return (
    <FlightCard>
      <CardHeader>
        <AirlineInfo>
          <Airline>{airline}</Airline>
          <FlightNumber>{flightNumber}</FlightNumber>
        </AirlineInfo>
        <StatusBadge status={status} />
      </CardHeader>

      <Route>
        <RouteStart>
          <CityIATA>{origin}</CityIATA>
          <City>{getCityName(origin)}</City>
        </RouteStart>
        <FlightIcon />
        <RouteEnd>
          <CityIATA>{destination}</CityIATA>
          <City>{getCityName(destination)}</City>
        </RouteEnd>
      </Route>

      <FlightTimes>
        <FlightTimeDateBlockDeparture>
          <FlightTime>{formatUtcTime(departureTime)}</FlightTime>
          <FlightDate>{formatUtcDate(departureDate)}</FlightDate>
        </FlightTimeDateBlockDeparture>
        <FlightTimeDateBlockArrival>
          <FlightTime>{formatUtcTime(arrivalTime)}</FlightTime>
          <FlightDate>{formatUtcDate(arrivalDate)}</FlightDate>
        </FlightTimeDateBlockArrival>
      </FlightTimes>

      <FlightSeats>
        <BookedSeatsCount>
          <SeatsLabel>Seats booked</SeatsLabel>
          <SeatsCount>
            {bookedSeats} / {totalSeats}
          </SeatsCount>
        </BookedSeatsCount>

        <ProgressBar value={bookedSeats} max={totalSeats} />
      </FlightSeats>
      <CardDivider></CardDivider>
      <CardFooter>
        <FlightDetails to={"/flights/" + flightNumber}>
          View details
          <LuArrowRight />
        </FlightDetails>

        <FooterActions>
          <Button
            label="Book"
            handleButton={handleBook}
            disabled={bookDisabled}
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
    </FlightCard>
  );
};
