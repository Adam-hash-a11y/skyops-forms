import styled from "styled-components";
import { IconButton } from "../iconButton/IconButton";
import { LuX } from "react-icons/lu";
import { Button, ButtonVariant } from "../button/Button";
import { FormInput } from "../formInput/FlightFormInput";
import { FormType } from "../flightFormModal/types";
import type { Flight } from "../../../types/flightTypes";
import type { Passenger } from "../../../types/passengerTypes";
import { formatUtcDate, formatUtcTime } from "../../../utils/formatDateTime";
import { initialState, ticketReducer } from "./reducer";
import { useEffect, useReducer, useState } from "react";
import { SET_FIELD } from "./action";
import { getFlights, getFreeSeats } from "../../../service/flightService";
import { getPassengers } from "../../../service/passengerService";

interface Props {
  handleClose: () => void;
  handleSave: (
    flightId: string,
    passengerId: string,
    seatNumber: string,
    ticketClass: string,
  ) => void;
  flightNumber?: string;
  passportNumber?: string;
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
  width: 620px;
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
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 550px) {
    flex-direction: column;
  }
`;

const PriceBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #f2f4f8;
  border: 1px solid #dce2eb;
  border-radius: 10px;
  padding: 14px 16px;
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PriceTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #162033;
`;

const PriceNote = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #566377;
`;

const PriceValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #162033;
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

export const TicketFormModal: React.FunctionComponent<Props> = ({
  handleClose,
  handleSave,
  flightNumber = "",
  passportNumber = "",
}) => {
  const [state, dispatch] = useReducer(ticketReducer, {
    ...initialState,
    flightNumber: flightNumber,
    passportNumber: passportNumber,
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [freeSeats, setFreeSeats] = useState<{ seat: string; class: string }[]>(
    [],
  );
  const [counts, setCounts] = useState({ first: 0, business: 0, economy: 0 });
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const loadedFlights = await getFlights();
        setFlights(loadedFlights);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFlights();
  }, []);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const loadedPassengers = await getPassengers();
        setPassengers(loadedPassengers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPassengers();
  }, []);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const data = await getFreeSeats(state.flightNumber);
        setFreeSeats(data.seats);
        setCounts(data.counts);
        setPrices(data.prices);
      } catch (error) {
        console.error(error);
      }
    };
    if (state.flightNumber !== "") {
      fetchSeats();
    }
  }, [state.flightNumber]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch({
      type: SET_FIELD,
      field: e.target.name,
      value: e.target.value,
    });

    if (e.target.name === "flightNumber" && e.target.value === "") {
      setFreeSeats([]);
      setCounts({ first: 0, business: 0, economy: 0 });
      setPrices({});
    }
  };

  const bookableFlights = flights.filter(
    (flight) => flight.status === "Scheduled" || flight.status === "Delayed",
  );
  const flightOptions = [
    { value: "", label: "Select a flight..." },
    ...bookableFlights.map((flight) => ({
      value: flight.flightNumber,
      label:
        flight.flightNumber +
        " · " +
        flight.origin +
        " → " +
        flight.destination +
        " · " +
        formatUtcDate(flight.departureTime) +
        ", " +
        formatUtcTime(flight.departureTime),
    })),
  ];

  const passengerOptions = [
    { value: "", label: "Select a passenger..." },
    ...passengers.map((passenger) => ({
      value: passenger.passportNumber,
      label:
        passenger.lastName +
        ", " +
        passenger.firstName +
        " · " +
        passenger.passportNumber,
    })),
  ];

  const classOptions = [
    { value: "", label: "Select a class...", disabled: false },
  ];

  if (counts.economy > 0) {
    classOptions.push({
      value: "Economy",
      label: "Economy (" + counts.economy + " free)",
      disabled: false,
    });
  }

  if (counts.business > 0) {
    classOptions.push({
      value: "Business",
      label: "Business (" + counts.business + " free)",
      disabled: false,
    });
  }

  if (counts.first > 0) {
    classOptions.push({
      value: "First",
      label: "First (" + counts.first + " free)",
      disabled: false,
    });
  }

  const classSeats = freeSeats.filter(
    (seat) => seat.class === state.ticketClass.toLowerCase(),
  );

  const seatOptions = [
    { value: "", label: "Select a seat..." },
    ...classSeats.map((seat) => ({
      value: seat.seat,
      label: seat.seat,
    })),
  ];

  const classPrice = prices[state.ticketClass.toLowerCase()];

  const handleSubmit = () => {
    const selectedFlight = flights.find(
      (flight) => flight.flightNumber === state.flightNumber,
    );
    const selectedPassenger = passengers.find(
      (passenger) => passenger.passportNumber === state.passportNumber,
    );

    if (selectedFlight && selectedPassenger) {
      handleSave(
        selectedFlight.id,
        selectedPassenger.id,
        state.seatNumber,
        state.ticketClass,
      );
    }
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>
          <HeaderTitle>Book ticket</HeaderTitle>
          <IconButton handleButton={handleClose}>
            <LuX />
          </IconButton>
        </ModalHeader>
        <ModalBody>
          <FormRow>
            <FormInput
              name="flightNumber"
              type={FormType.SELECT}
              value={state.flightNumber}
              id="TicketFlightInput"
              label="Flight"
              handleChange={handleChange}
              options={flightOptions}
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="passportNumber"
              type={FormType.SELECT}
              value={state.passportNumber}
              id="TicketPassengerInput"
              label="Passenger"
              handleChange={handleChange}
              options={passengerOptions}
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="ticketClass"
              type={FormType.SELECT}
              value={state.ticketClass}
              id="TicketClassInput"
              label="Class"
              handleChange={handleChange}
              options={classOptions}
              disabled={
                state.flightNumber === "" || state.passportNumber === ""
              }
            />
            <FormInput
              name="seatNumber"
              type={FormType.SELECT}
              value={state.seatNumber}
              id="SeatNumberInput"
              label="Seat"
              handleChange={handleChange}
              disabled={state.ticketClass === ""}
              options={seatOptions}
            />
          </FormRow>
          <PriceBox>
            <PriceInfo>
              <PriceTitle>Ticket price</PriceTitle>
              <PriceNote>Set by ticket class, fixed per tier</PriceNote>
            </PriceInfo>
            <PriceValue>
              {classPrice === undefined ? "-" : classPrice + " EUR"}
            </PriceValue>
          </PriceBox>
        </ModalBody>
        <ModalFooter>
          <Button label="Cancel" handleButton={handleClose} />
          <Button
            label="Book ticket"
            variant={ButtonVariant.PRIMARY}
            disabled={state.disabled}
            handleButton={handleSubmit}
          />
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};
