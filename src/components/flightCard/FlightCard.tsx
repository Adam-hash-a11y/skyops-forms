import styled from "styled-components";
import { FlightIcon } from "../shared/fligthIcon/FlightIcon";
import { IconButton, IconButtonVariant } from "../shared/iconButton/IconButton";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuArrowRight, LuPencil, LuTicket, LuTrash2 } from "react-icons/lu";
import type { FunctionComponent } from "react";

interface Props {
  flightNumber: string;
  airline: string;
  status: string;
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
  border-radius: 10px;
  border: 1px solid #dce2eb;
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 340px;
  flex: 1;
  padding: 20px;
  background-color: #fff;
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
  font-size: 15px;
  font-weight: 600;
`;

const FlightNumber = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #566377;
`;
const StatusBadge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  background-color: #d3e3fb;
  color: #144aa0;
  gap: 5px;
`;

const Status = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #144aa0;
`;

const Route = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
`;

const CityIATA = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #0b2545;
`;

const City = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #566377;
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
  font-size: 13px;
  font-weight: 600;
`;

const FlightDate = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #566377;
`;

const FlightSeats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SeatsLabel = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: #566377;
`;

const SeatsCount = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

const BookedSeatsCount = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SeatProgressBar = styled.div<{ $widthPercent: number }>`
  height: 6px;
  border-radius: 3px;
  width: ${(props) => props.$widthPercent}%;
  background-color: ${(props) => {
    if (props.$widthPercent >= 100) {
      return "#c0262d";
    }
    if (props.$widthPercent >= 90) {
      return "#d98a00";
    }
    return "#1b63d6";
  }};
`;

const SeatsProgressBarConatiner = styled.div`
  height: 6px;
  border-radius: 3px;
  background-color: #edf0f5;
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

const FlightDetails = styled.a`
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
        <StatusBadge>
          <Dot />
          <Status>{status}</Status>
        </StatusBadge>
      </CardHeader>

      <Route>
        <RouteStart>
          <CityIATA>{origin}</CityIATA>
          <City>{origin}</City>
        </RouteStart>
        <FlightIcon />
        <RouteEnd>
          <CityIATA>{destination}</CityIATA>
          <City>{destination}</City>
        </RouteEnd>
      </Route>

      <FlightTimes>
        <FlightTimeDateBlockDeparture>
          <FlightTime>{departureTime} </FlightTime>
          <FlightDate>{departureDate}</FlightDate>
        </FlightTimeDateBlockDeparture>
        <FlightTimeDateBlockArrival>
          <FlightTime>{arrivalTime} </FlightTime>
          <FlightDate>{arrivalDate}</FlightDate>
        </FlightTimeDateBlockArrival>
      </FlightTimes>

      <FlightSeats>
        <BookedSeatsCount>
          <SeatsLabel>Seats booked</SeatsLabel>
          <SeatsCount>
            {bookedSeats} / {totalSeats}
          </SeatsCount>
        </BookedSeatsCount>

        <SeatsProgressBarConatiner>
          <SeatProgressBar $widthPercent={(bookedSeats / totalSeats) * 100} />
        </SeatsProgressBarConatiner>
      </FlightSeats>
      <CardDivider></CardDivider>
      <CardFooter>
        <FlightDetails>
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
