import React, { useReducer } from "react";
import styled from "styled-components";
import { Button, ButtonVariant } from "../shared/button/Button";
import { FormInputError } from "../shared/formInputError/FormInputError";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { FormType } from "../flightForm/types";
import { passengerReducer, initialState } from "./reducer";
import {
  RESET_PASSENGER,
  SET_FIELD,
  SET_PASSENGER_TOUCHED,
  SUMBIT_PASSENGER,
} from "./action";
import { Bounce, toast, ToastContainer } from "react-toastify";

const FormWrapper = styled.div`
  max-width: 400px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const ButtonRow = styled.div`
  margin-top: 16px;
`;

export const PassengerForm = () => {
  const [state, dispatch] = useReducer(passengerReducer, initialState);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch({ type: SET_FIELD, field: e.target.name, value: e.target.value });
  };

  const handleReset = () => {
    dispatch({ type: RESET_PASSENGER });
  };

  const handleBlur = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch({ type: SET_PASSENGER_TOUCHED, field: e.target.name });
  };

  const handleSend = () => {
    dispatch({ type: SUMBIT_PASSENGER });
    toast.success("🦄 Passenger Added", {
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
  };

  return (
    <FormWrapper>
      <ToastContainer stacked />

      <Title>Passenger Form</Title>
      <FormInput
        name="firstName"
        type={FormType.TEXT}
        value={state.firstName}
        placeholder="First Name"
        id="FirstNameInput"
        handleChange={handleChange}
        label="First Name"
        handleBlur={handleBlur}
        error={state.errors.firstName}
        touched={state.touched.firstName}
      />
      {state.touched.firstName && state.errors.firstName && (
        <FormInputError error={state.errors.firstName} />
      )}

      <FormInput
        name="lastName"
        type={FormType.TEXT}
        value={state.lastName}
        placeholder="Last Name"
        id="LastNameInput"
        handleChange={handleChange}
        label="Last Name"
        handleBlur={handleBlur}
        error={state.errors.lastName}
        touched={state.touched.lastName}
      />
      {state.touched.lastName && state.errors.lastName && (
        <FormInputError error={state.errors.lastName} />
      )}

      <FormInput
        name="passportNumber"
        type={FormType.TEXT}
        value={state.passportNumber}
        placeholder="Passport Number"
        id="PassportNumberInput"
        handleChange={handleChange}
        handleBlur={handleBlur}
        label="Passport Number "
        error={state.errors.passportNumber}
        touched={state.touched.passportNumber}
      />
      {state.touched.passportNumber && state.errors.passportNumber && (
        <FormInputError error={state.errors.passportNumber} />
      )}

      <FormInput
        name="nationality"
        type={FormType.TEXT}
        value={state.nationality}
        placeholder="Nationality"
        id="NationalityInput"
        handleBlur={handleBlur}
        handleChange={handleChange}
        label="Nationality"
        error={state.errors.nationality}
        touched={state.touched.nationality}
      />
      {state.touched.nationality && state.errors.nationality && (
        <FormInputError error={state.errors.nationality} />
      )}

      <FormInput
        name="dateOfBirth"
        type={FormType.DATE_TIME_LOCAL}
        value={state.dateOfBirth}
        placeholder="Date of Birth"
        id="DateOfBirthInput"
        handleChange={handleChange}
        handleBlur={handleBlur}
        label="Date of birth"
        error={state.errors.dateOfBirth}
        touched={state.touched.dateOfBirth}
      />
      {state.touched.dateOfBirth && state.errors.dateOfBirth && (
        <FormInputError error={state.errors.dateOfBirth} />
      )}

      <FormInput
        name="email"
        type={FormType.TEXT}
        value={state.email}
        placeholder="Email"
        id="EmailInput"
        handleChange={handleChange}
        handleBlur={handleBlur}
        label="Email"
        error={state.errors.email}
        touched={state.touched.email}
      />
      {state.touched.email && state.errors.email && (
        <FormInputError error={state.errors.email} />
      )}

      <FormInput
        name="phoneNumber"
        type={FormType.TEXT}
        value={state.phoneNumber}
        placeholder="Phone Number"
        id="PhoneNumberInput"
        handleChange={handleChange}
        handleBlur={handleBlur}
        label="Phone Number"
        error={state.errors.phoneNumber}
        touched={state.touched.phoneNumber}
      />
      {state.touched.phoneNumber && state.errors.phoneNumber && (
        <FormInputError error={state.errors.phoneNumber} />
      )}

      <ButtonRow>
        <Button
          handleButton={handleSend}
          disabled={state.disabled}
          label="Send"
          variant={ButtonVariant.PRIMARY}
        />
        <Button
          handleButton={handleReset}
          label="Reset"
          variant={ButtonVariant.DANGER}
        />
      </ButtonRow>
    </FormWrapper>
  );
};
