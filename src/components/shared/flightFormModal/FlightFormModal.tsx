import styled from "styled-components";
import { IconButton } from "../iconButton/IconButton";
import { useReducer, type FunctionComponent } from "react";
import { LuX } from "react-icons/lu";
import { FormInput } from "../formInput/FlightFormInput";
import { flightReducer, initialState } from "./reducer";
import { SET_FIELD, SET_TOUCHED } from "./action";
import { Button, ButtonVariant } from "../button/Button";
import { FormType, type Status } from "./types";
import { type Flight } from "../../../data/flightData";

interface Props {
  handleClose: () => void;
  handleSave: (flight: Flight) => void;
  flight?: Flight;
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
  height: 665px;
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

const statusOptions = [
  { value: "Scheduled", label: "Scheduled" },
  { value: "Delayed", label: "Delayed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Landed", label: "Landed" },
];

export const FlightFormModal: FunctionComponent<Props> = ({
  handleClose,
  flight,
  handleSave,
}) => {
  const startState = flight
    ? {
        ...initialState,
        ...flight,
        bookedSeats: String(flight.bookedSeats),
        totalSeats: String(flight.totalSeats),
        status: flight.status as Status,
        disabled: false,
      }
    : initialState;
  const [state, dispatch] = useReducer(flightReducer, startState);
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

  const handleBlur = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch({ type: SET_TOUCHED, field: e.target.name });
  };

  const handleSubmit = () => {
    handleSave({
      flightNumber: state.flightNumber,
      airline: state.airline,
      origin: state.origin,
      destination: state.destination,
      departureTime: state.departureTime,
      arrivalTime: state.arrivalTime,
      status: state.status,
      bookedSeats: Number(state.bookedSeats),
      totalSeats: Number(state.totalSeats),
    });
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>
          <HeaderTitle>{flight ? "Edit flight" : "New flight"}</HeaderTitle>
          <IconButton handleButton={handleClose}>
            <LuX />
          </IconButton>
        </ModalHeader>
        <ModalBody>
          <FormRow>
            <FormInput
              name="flightNumber"
              type={FormType.TEXT}
              value={state.flightNumber}
              placeholder="SKYOPS-10042"
              id="FlightNumberInput"
              label="Flight number"
              handleChange={handleChange}
              handleBlur={handleBlur}
              hint="Must start with SKYOPS-"
              error={state.errors.flightNumber}
              touched={state.touched.flightNumber}
              disabled={Boolean(flight)}
            />
          </FormRow>

          <FormRow>
            <FormInput
              name="airline"
              type={FormType.TEXT}
              value={state.airline}
              placeholder="Airline"
              id="FlightAirlineInput"
              handleChange={handleChange}
              label="Airline"
              handleBlur={handleBlur}
              error={state.errors.airline}
              touched={state.touched.airline}
              hint="Letters only, no spaces, min. 5"
            />

            <FormInput
              name="status"
              type={FormType.SELECT}
              value={state.status}
              placeholder="Status"
              id="StatusInput"
              handleChange={handleChange}
              label="Status"
              handleBlur={handleBlur}
              error={state.errors.status}
              touched={state.touched.status}
              options={statusOptions}
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="origin"
              type={FormType.TEXT}
              value={state.origin}
              placeholder="Origin"
              id="FlightOriginInput"
              handleChange={handleChange}
              label="Origin"
              handleBlur={handleBlur}
              error={state.errors.origin}
              touched={state.touched.origin}
              hint="3-letter IATA code"
            />

            <FormInput
              name="destination"
              type={FormType.TEXT}
              value={state.destination}
              placeholder="Destination"
              id="FlightDestinationInput"
              handleChange={handleChange}
              label="Destination"
              handleBlur={handleBlur}
              error={state.errors.destination}
              touched={state.touched.destination}
              hint="3-letter IATA code"
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="departureTime"
              type={FormType.DATE_TIME_LOCAL}
              value={state.departureTime}
              placeholder="Departure Time"
              id="DepartureTimeInput"
              handleChange={handleChange}
              label="Departure (UTC)"
              handleBlur={handleBlur}
              error={state.errors.departureTime}
              touched={state.touched.departureTime}
              hint="YYYY-MM-DD HH:mm, 24-hour"
            />

            <FormInput
              name="arrivalTime"
              type={FormType.DATE_TIME_LOCAL}
              value={state.arrivalTime}
              placeholder="Arrival Time"
              id="ArrivalTimeInput"
              handleChange={handleChange}
              label="Arrival (UTC)"
              handleBlur={handleBlur}
              error={state.errors.arrivalTime}
              touched={state.touched.arrivalTime}
              hint="YYYY-MM-DD HH:mm, 24-hour"
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="totalSeats"
              type={FormType.NUMBER}
              value={state.totalSeats}
              placeholder="Total Seats"
              id="TotalSeatsInput"
              handleChange={handleChange}
              label="Total seats"
              handleBlur={handleBlur}
              error={state.errors.totalSeats}
              touched={state.touched.totalSeats}
            />

            <FormInput
              name="bookedSeats"
              type={FormType.NUMBER}
              value={state.bookedSeats}
              placeholder="Booked Seats"
              id="BookedSeatsInput"
              handleChange={handleChange}
              label="Booked seats"
              handleBlur={handleBlur}
              error={state.errors.bookedSeats}
              touched={state.touched.bookedSeats}
            />
          </FormRow>
        </ModalBody>
        <ModalFooter>
          <Button label="Cancel" handleButton={handleClose} />
          <Button
            label={flight ? "Save changes" : "Create flight"}
            variant={ButtonVariant.PRIMARY}
            disabled={state.disabled}
            handleButton={handleSubmit}
          />
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};
