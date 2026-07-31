import React, { useReducer } from "react";
import styled from "styled-components";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { Button, ButtonVariant } from "../shared/button/Button";
import { FormInputError } from "../shared/formInputError/FormInputError";
import { FormType } from "./types";
import { flightReducer, initialState } from "./reducer";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { RESET, SET_FIELD, SET_TOUCHED, SUBMIT } from "./action";
import { FaCheck, FaXmark } from "react-icons/fa6";

const FormWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const ButtonRow = styled.div`
  margin-top: 16px;
`;

export const FlightForm = () => {
  const [state, dispatch] = useReducer(flightReducer, initialState);

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

  const handleSend = () => {
    try {
      // throw new Error("Something went wrong!");
      dispatch({ type: SUBMIT });
      toast.success("🦄 Flight  Added", {
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
        label="Flight Number"
        handleBlur={handleBlur}
        error={state.errors.flightNumber}
        touched={state.touched.flightNumber}
      />
      {state.touched.flightNumber && state.errors.flightNumber && (
        <FormInputError error={state.errors.flightNumber} />
      )}

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
      />
      {state.touched.airline && state.errors.airline && (
        <FormInputError error={state.errors.airline} />
      )}

      <FormInput
        label="Origin"
        name="origin"
        type={FormType.TEXT}
        value={state.origin}
        placeholder="Origin"
        id="FlightOriginInput"
        handleChange={handleChange}
        handleBlur={handleBlur}
        error={state.errors.origin}
        touched={state.touched.origin}
      />
      {state.touched.origin && state.errors.origin && (
        <FormInputError error={state.errors.origin} />
      )}

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
      />
      {state.touched.destination && state.errors.destination && (
        <FormInputError error={state.errors.destination} />
      )}

      <FormInput
        name="departureTime"
        type={FormType.DATE_TIME_LOCAL}
        value={state.departureTime}
        placeholder="Departure Time"
        id="DepartureTimeInput"
        handleChange={handleChange}
        label="Departure Time"
        handleBlur={handleBlur}
        error={state.errors.departureTime}
        touched={state.touched.departureTime}
      />
      {state.touched.departureTime && state.errors.departureTime && (
        <FormInputError error={state.errors.departureTime} />
      )}

      <FormInput
        name="arrivalTime"
        type={FormType.DATE_TIME_LOCAL}
        value={state.arrivalTime}
        placeholder="Arrival Time"
        id="ArrivalTimeInput"
        handleChange={handleChange}
        label="Arrival Time"
        handleBlur={handleBlur}
        error={state.errors.arrivalTime}
        touched={state.touched.arrivalTime}
      />
      {state.touched.arrivalTime && state.errors.arrivalTime && (
        <FormInputError error={state.errors.arrivalTime} />
      )}

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
      />
      {state.touched.status && state.errors.status && (
        <FormInputError error={state.errors.status} />
      )}

      <FormInput
        name="totalSeats"
        type={FormType.NUMBER}
        value={state.totalSeats}
        placeholder="Total Seats"
        id="TotalSeatsInput"
        handleChange={handleChange}
        label="Total Seats"
        handleBlur={handleBlur}
        error={state.errors.totalSeats}
        touched={state.touched.totalSeats}
      />
      {state.touched.totalSeats && state.errors.totalSeats && (
        <FormInputError error={state.errors.totalSeats} />
      )}

      <FormInput
        name="bookedSeats"
        type={FormType.NUMBER}
        value={state.bookedSeats}
        placeholder="Booked Seats"
        id="BookedSeatsInput"
        handleChange={handleChange}
        label="Booked Seats"
        handleBlur={handleBlur}
        error={state.errors.bookedSeats}
        touched={state.touched.bookedSeats}
      />
      {state.touched.bookedSeats && state.errors.bookedSeats && (
        <FormInputError error={state.errors.bookedSeats} />
      )}
      <ToastContainer stacked />
      <ButtonRow>
        <Button
          disabled={state.disabled}
          label="Send"
          handleButton={handleSend}
          variant={ButtonVariant.PRIMARY}
        >
          <FaCheck />
        </Button>

        <Button
          handleButton={handleReset}
          label="Reset"
          variant={ButtonVariant.DANGER}
        >
          <FaXmark />
        </Button>
      </ButtonRow>
    </FormWrapper>
  );
};
