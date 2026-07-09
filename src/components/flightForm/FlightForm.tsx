import React, { useReducer } from "react";
import styled from "styled-components";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { Button, ButtonVariant } from "../shared/button/Button";
import { FaBeer } from "react-icons/fa";
import { FormInputError } from "../shared/formInputError/FormInputError";
import { FormType } from "./types";
import { flightReducer, initialState } from "./reducer";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { RESET, SET_ERROR, SET_FIELD, SUBMIT } from "./action";

const FormWrapper = styled.div`
  max-width: 400px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const ButtonRow = styled.div`
  margin-top: 16px;
`;

export const FlightForm = () => {
  const [state, dispatch] = useReducer(flightReducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: SET_FIELD, field: e.target.name, value: e.target.value });
  };

  const handleValidation = () => {
    dispatch({ type: SET_ERROR });
  };

  const handleSend = () => {
    try {
      // throw new Error("Something went wrong!");
      dispatch({ type: SUBMIT });
      toast.success("🦄 Flight  Added", {
        style: { backgroundColor: "#4CAF50", color: "#fff" },
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (err) {
      toast.error("Flight was not added", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleReset = () => {
    dispatch({ type: RESET });
  };

  return (
    <FormWrapper>
      <Title>Flight Form</Title>
      <FormInput
        name="flightNumber"
        type={FormType.TEXT}
        value={state.flightNumber}
        placeholder="Flight Number e.g SKYOPS-101"
        id="FlightNumberInput"
        handleChange={handleChange}
      />
      {state.errors.flightNumber && (
        <FormInputError error={state.errors.flightNumber} />
      )}

      <FormInput
        name="airline"
        type={FormType.TEXT}
        value={state.airline}
        placeholder="Airline"
        id="FlightAirlineInput"
        handleChange={handleChange}
      />
      {state.errors.airline && <FormInputError error={state.errors.airline} />}

      <FormInput
        name="origin"
        type={FormType.TEXT}
        value={state.origin}
        placeholder="Origin"
        id="FlightOriginInput"
        handleChange={handleChange}
      />
      {state.errors.origin && <FormInputError error={state.errors.origin} />}

      <FormInput
        name="destination"
        type={FormType.TEXT}
        value={state.destination}
        placeholder="Destination"
        id="FlightDestinationInput"
        handleChange={handleChange}
      />
      {state.errors.destination && (
        <FormInputError error={state.errors.destination} />
      )}

      <FormInput
        name="departureTime"
        type={FormType.DATE_TIME_LOCAL}
        value={state.departureTime}
        placeholder="Departure Time"
        id="DepartureTimeInput"
        handleChange={handleChange}
      />
      {state.errors.departureTime && (
        <FormInputError error={state.errors.departureTime} />
      )}

      <FormInput
        name="arrivalTime"
        type={FormType.DATE_TIME_LOCAL}
        value={state.arrivalTime}
        placeholder="Arrival Time"
        id="ArrivalTimeInput"
        handleChange={handleChange}
      />
      {state.errors.arrivalTime && (
        <FormInputError error={state.errors.arrivalTime} />
      )}

      <FormInput
        name="status"
        type={FormType.SELECT}
        value={state.status}
        placeholder="Status"
        id="StatusInput"
        handleChange={handleChange}
      />

      <FormInput
        name="totalSeats"
        type={FormType.NUMBER}
        value={state.totalSeats}
        placeholder="Total Seats"
        id="TotalSeatsInput"
        handleChange={handleChange}
      />
      {state.errors.totalSeats && (
        <FormInputError error={state.errors.totalSeats} />
      )}

      <FormInput
        name="bookedSeats"
        type={FormType.NUMBER}
        value={state.bookedSeats}
        placeholder="Booked Seats"
        id="BookedSeatsInput"
        handleChange={handleChange}
      />
      {state.errors.bookedSeats && (
        <FormInputError error={state.errors.bookedSeats} />
      )}

      <ButtonRow>
        <Button
          handleButton={handleValidation}
          label="Validate"
          variant={ButtonVariant.SECONDARY}
        >
          <FaBeer />
        </Button>
        <Button
          disabled={state.disabled}
          label="Send"
          handleButton={handleSend}
          variant={ButtonVariant.PRIMARY}
        />
        <ToastContainer stacked />
        <Button
          handleButton={handleReset}
          label="Reset"
          variant={ButtonVariant.DANGER}
        />
      </ButtonRow>
    </FormWrapper>
  );
};
