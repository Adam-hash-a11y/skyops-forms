import React, { useState } from "react";
import validator from "validator";
import { Button } from "../shared/button/Button";
import { FaBeer } from "react-icons/fa";
import { FormInputError } from "../shared/formInputError/FormInputError";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { Link } from "react-router-dom";
import { FormType } from "../flightForm/types";

export const PassengerForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    passportNumber: "",
    nationality: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
  });

  const handleValidation = () => {
    if (firstName.length >= 3) {
      setErrors((prev) => ({ ...prev, firstName: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        firstName: "First name must be at least 3 characters",
      }));
    }

    if (lastName.length >= 3) {
      setErrors((prev) => ({ ...prev, lastName: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        lastName: "Last name must be at least 3 characters",
      }));
    }

    if (passportNumber.length >= 6) {
      setErrors((prev) => ({ ...prev, passportNumber: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        passportNumber: "Passport number must be at least 6 characters",
      }));
    }

    if (nationality.length > 0) {
      setErrors((prev) => ({ ...prev, nationality: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        nationality: "Nationality is required",
      }));
    }

    if (
      validator.isISO8601(dateOfBirth) &&
      new Date(dateOfBirth) < new Date()
    ) {
      setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        dateOfBirth: "Date of birth must be a valid past date",
      }));
    }

    if (validator.isEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "Email must be valid",
      }));
    }

    if (phoneNumber.length >= 8) {
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Phone number must be at least 8 characters",
      }));
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handlePassportNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPassportNumber(e.target.value);
  };

  const handleNationalityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNationality(e.target.value);
  };

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfBirth(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const isButtonDisabled = () => {
    return (
      firstName.length === 0 ||
      lastName.length === 0 ||
      passportNumber.length === 0 ||
      nationality.length === 0 ||
      dateOfBirth.length === 0 ||
      email.length === 0 ||
      phoneNumber.length === 0
    );
  };

  return (
    <>
      <h2>Passenger Form</h2>
      <FormInput
        name="First Name"
        type={FormType.TEXT}
        value={firstName}
        placeholder="First Name"
        id="FirstNameInput"
        handleChange={handleFirstNameChange}
      />
      <FormInputError error={errors.firstName} />

      <FormInput
        name="Last Name"
        type={FormType.TEXT}
        value={lastName}
        placeholder="Last Name"
        id="LastNameInput"
        handleChange={handleLastNameChange}
      />
      <FormInputError error={errors.lastName} />

      <FormInput
        name="Passport Number"
        type={FormType.TEXT}
        value={passportNumber}
        placeholder="Passport Number"
        id="PassportNumberInput"
        handleChange={handlePassportNumberChange}
      />
      <FormInputError error={errors.passportNumber} />

      <FormInput
        name="Nationality"
        type={FormType.TEXT}
        value={nationality}
        placeholder="Nationality"
        id="NationalityInput"
        handleChange={handleNationalityChange}
      />
      <FormInputError error={errors.nationality} />

      <FormInput
        name="Date of Birth"
        type={FormType.DATE_TIME_LOCAL}
        value={dateOfBirth}
        placeholder="Date of Birth"
        id="DateOfBirthInput"
        handleChange={handleDateOfBirthChange}
      />
      <FormInputError error={errors.dateOfBirth} />

      <FormInput
        name="Email"
        type={FormType.TEXT}
        value={email}
        placeholder="Email"
        id="EmailInput"
        handleChange={handleEmailChange}
      />
      <FormInputError error={errors.email} />

      <FormInput
        name="Phone Number"
        type={FormType.TEXT}
        value={phoneNumber}
        placeholder="Phone Number"
        id="PhoneNumberInput"
        handleChange={handlePhoneNumberChange}
      />
      <FormInputError error={errors.phoneNumber} />

      <Button handleButton={handleValidation} label="Validate">
        <FaBeer />
      </Button>
      <Button disabled={isButtonDisabled()} label="Send" />
      <Link to="/flight">Go to Flight Form</Link>
    </>
  );
};
