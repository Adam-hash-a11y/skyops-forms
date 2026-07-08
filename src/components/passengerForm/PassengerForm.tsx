import React, { useReducer } from "react";
import { Button } from "../shared/button/Button";
import { FaBeer } from "react-icons/fa";
import { FormInputError } from "../shared/formInputError/FormInputError";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { FormType } from "../flightForm/types";
import { passengerReducer, initialState } from "./reducer";
import { SET_ERROR, SET_FIELD } from "./action";

export const PassengerForm = () => {
  const [state, dispatch] = useReducer(passengerReducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: SET_FIELD, field: e.target.name, value: e.target.value });
  };

  const handleValidation = () => {
    dispatch({ type: SET_ERROR });
  };

  return (
    <>
      <h2>Passenger Form</h2>
      <FormInput
        name="firstName"
        type={FormType.TEXT}
        value={state.firstName}
        placeholder="First Name"
        id="FirstNameInput"
        handleChange={handleChange}
      />
      {state.errors.firstName && (
        <FormInputError error={state.errors.firstName} />
      )}

      <FormInput
        name="lastName"
        type={FormType.TEXT}
        value={state.lastName}
        placeholder="Last Name"
        id="LastNameInput"
        handleChange={handleChange}
      />
      {state.errors.lastName && (
        <FormInputError error={state.errors.lastName} />
      )}

      <FormInput
        name="passportNumber"
        type={FormType.TEXT}
        value={state.passportNumber}
        placeholder="Passport Number"
        id="PassportNumberInput"
        handleChange={handleChange}
      />
      {state.errors.passportNumber && (
        <FormInputError error={state.errors.passportNumber} />
      )}

      <FormInput
        name="nationality"
        type={FormType.TEXT}
        value={state.nationality}
        placeholder="Nationality"
        id="NationalityInput"
        handleChange={handleChange}
      />
      {state.errors.nationality && (
        <FormInputError error={state.errors.nationality} />
      )}

      <FormInput
        name="dateOfBirth"
        type={FormType.DATE_TIME_LOCAL}
        value={state.dateOfBirth}
        placeholder="Date of Birth"
        id="DateOfBirthInput"
        handleChange={handleChange}
      />
      {state.errors.dateOfBirth && (
        <FormInputError error={state.errors.dateOfBirth} />
      )}

      <FormInput
        name="email"
        type={FormType.TEXT}
        value={state.email}
        placeholder="Email"
        id="EmailInput"
        handleChange={handleChange}
      />
      {state.errors.email && <FormInputError error={state.errors.email} />}

      <FormInput
        name="phoneNumber"
        type={FormType.TEXT}
        value={state.phoneNumber}
        placeholder="Phone Number"
        id="PhoneNumberInput"
        handleChange={handleChange}
      />
      {state.errors.phoneNumber && (
        <FormInputError error={state.errors.phoneNumber} />
      )}

      <Button handleButton={handleValidation} label="Validate">
        <FaBeer />
      </Button>
      <Button disabled={state.disabled} label="Send" />
    </>
  );
};
