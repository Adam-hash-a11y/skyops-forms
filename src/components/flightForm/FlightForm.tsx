import React, { useReducer } from "react";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { Button } from "../shared/button/Button";
import { FaBeer } from "react-icons/fa";
import { FormInputError } from "../shared/formInputError/FormInputError";
import { Link } from "react-router-dom";
import { FormType } from "./types";
import { flightReducer, intialState } from "./reducer";
import { CREATE_FLIGHT, SET_ERROR, SET_FIELD } from "./action";
import { flightArray } from "../data/flightData";

export const FlightForm = () => {
  const [state, dispatch] = useReducer(flightReducer, intialState);

  const handleSetField = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: SET_FIELD,
      payload: {
        value: e.target.value,
        name: e.target.name,
      },
    });
  };

  const handleErrors = () => {
    dispatch({ type: SET_ERROR });
  };

  const flightCreation = () => {
    dispatch({ type: CREATE_FLIGHT });
  };

  return (
    <>
      <h2>Flight Form </h2>
      <FormInput
        name="flightNumber"
        type={FormType.TEXT}
        value={state.flightNumber}
        placeholder="Flight Number e.g SKYOPS-101"
        id="FlightNumberInput"
        handleChange={handleSetField}
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
        handleChange={handleSetField}
      />
      {state.errors.airline && <FormInputError error={state.errors.airline} />}

      <FormInput
        name="origin"
        type={FormType.TEXT}
        value={state.origin}
        placeholder="Origin"
        id="FlightOriginInput"
        handleChange={handleSetField}
      />
      {state.errors.origin && <FormInputError error={state.errors.origin} />}

      <FormInput
        name="destination"
        type={FormType.TEXT}
        value={state.destination}
        placeholder="Destination"
        id="FlightDestinationInput"
        handleChange={handleSetField}
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
        handleChange={handleSetField}
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
        handleChange={handleSetField}
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
        handleChange={handleSetField}
      />

      <FormInput
        name="totalSeats"
        type={FormType.NUMBER}
        value={state.totalSeats}
        placeholder="Total Seats"
        id="TotalSeatsInput"
        handleChange={handleSetField}
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
        handleChange={handleSetField}
      />
      {state.errors.bookedSeats && (
        <FormInputError error={state.errors.bookedSeats} />
      )}
      <Button handleButton={handleErrors} label="Validate">
        <FaBeer />
      </Button>
      <Button
        handleButton={flightCreation}
        disabled={state.isDisabled}
        label="Send"
      />
      <Link to="/passenger">Go to Passenger Form</Link>
      <Link to="/flightlist">View Flights</Link>
    </>
  );
};
