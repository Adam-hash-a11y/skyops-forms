import styled from "styled-components";
import { IconButton } from "../iconButton/IconButton";
import { LuX } from "react-icons/lu";
import { Button, ButtonVariant } from "../button/Button";
import { FormInput } from "../formInput/FlightFormInput";
import { FormType } from "../flightFormModal/types";
import { flights } from "../../../data/flightData";
import { formatUtcDate, formatUtcTime } from "../../../utils/formatDateTime";
import { passengers } from "../../../data/passengerData";
import { initialState, ticketReducer } from "./reducer";
import { useReducer } from "react";
import { SET_FIELD } from "./action";
import type { Ticket } from "../../../data/ticketData";

interface Props {
  handleClose: () => void;
  handleSave: (ticket: Ticket) => void;
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
  height: 520px;
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

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 550px) {
    flex-direction: column;
  }
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
}) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

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

  const selectedFlight = bookableFlights.find(
    (flight) => flight.flightNumber === state.flightNumber,
  );

  const classOptions = [
    { value: "", label: "Select a class...", disabled: false },
  ];

  const firstClasstakenSeats = selectedFlight
    ? selectedFlight.takenSeats.filter((seat) => seat.startsWith("A")).length
    : 0;

  const bussinessClasstakenSeats = selectedFlight
    ? selectedFlight.takenSeats.filter((seat) => seat.startsWith("B")).length
    : 0;

  const economyClasstakenSeats = selectedFlight
    ? selectedFlight.takenSeats.filter((seat) => seat.startsWith("C")).length
    : 0;

  if (selectedFlight && selectedFlight.economySeats > 0) {
    const isEconomyFull =
      economyClasstakenSeats === selectedFlight.economySeats;
    classOptions.push({
      value: "Economy",
      label: isEconomyFull ? "Economy · full" : "Economy",
      disabled: isEconomyFull,
    });
  }

  if (selectedFlight && selectedFlight.businessSeats > 0) {
    const isBusinessFull =
      bussinessClasstakenSeats === selectedFlight.businessSeats;
    classOptions.push({
      value: "Business",
      label: isBusinessFull ? "Business · full" : "Business",
      disabled: isBusinessFull,
    });
  }

  if (selectedFlight && selectedFlight.firstSeats > 0) {
    const isFirstFull = firstClasstakenSeats === selectedFlight.firstSeats;
    classOptions.push({
      value: "First",
      label: isFirstFull ? "First · full" : "First",
      disabled: isFirstFull,
    });
  }

  let seatLetter = "";
  let seatCount = 0;

  if (selectedFlight && state.ticketClass === "First") {
    seatLetter = "A";
    seatCount = selectedFlight.firstSeats;
  }

  if (selectedFlight && state.ticketClass === "Business") {
    seatLetter = "B";
    seatCount = selectedFlight.businessSeats;
  }

  if (selectedFlight && state.ticketClass === "Economy") {
    seatLetter = "C";
    seatCount = selectedFlight.economySeats;
  }

  const allSeats: string[] = [];

  for (let i = 1; i <= seatCount; i++) {
    allSeats.push(seatLetter + i);
  }

  const freeSeats = selectedFlight
    ? allSeats.filter((seat) => !selectedFlight.takenSeats.includes(seat))
    : allSeats;

  const seatOptions = [
    { value: "", label: "Select a seat..." },
    ...freeSeats.map((seat) => ({
      value: seat,
      label: seat,
    })),
  ];

  const handleSubmit = () => {
    handleSave({
      id: "",
      flightNumber: state.flightNumber,
      passportNumber: state.passportNumber,
      seatNumber: state.seatNumber,
      ticketClass: state.ticketClass,
      price: Number(state.price),
      status: "Confirmed",
      createdAt: "",
    });
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
          <FormRow>
            <FormInput
              name="price"
              type={FormType.TEXT}
              value={state.price}
              id="TicketPriceInput"
              label="Price (EUR)"
              placeholder="Set by class"
              handleChange={handleChange}
              hint="Fixed price per class"
              disabled={true}
            />
          </FormRow>
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
