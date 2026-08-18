import React, { useState } from "react";
import styled from "styled-components";
import { Button, ButtonVariant } from "../button/Button";
import { FormInput } from "../formInput/FlightFormInput";
import { FormInputError } from "../formInputError/FormInputError";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { FormType } from "../../flightForm/types";
import type { Flight } from "../../../data/flightData";
import {
  isValidAirline,
  isValidOrigin,
  isValidDestination,
  isValidDepartureTime,
  isValidArrivalTime,
  isValidStatus,
  isValidTotalSeats,
  isValidBookedSeats,
  isSameOriginDestination,
  isDepartureBeforeArrival,
  isBookedWithinTotal,
} from "../../../validators/flightForm.validator";

interface Props {
  isOpen: boolean;
  flight: Flight;
  handleClose: () => void;
  handleSave: (updatedFlight: Flight) => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.section`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h3`
  margin: 0 0 16px 0;
`;

const getErrors = (form: {
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  totalSeats: string;
  bookedSeats: string;
}) => {
  const errors = {
    airline: isValidAirline(form.airline),
    origin: isValidOrigin(form.origin),
    destination: isValidDestination(form.destination),
    departureTime: isValidDepartureTime(form.departureTime),
    arrivalTime: isValidArrivalTime(form.arrivalTime),
    status: isValidStatus(form.status),
    totalSeats: isValidTotalSeats(Number(form.totalSeats)),
    bookedSeats: isValidBookedSeats(Number(form.bookedSeats)),
  };

  if (isSameOriginDestination(form.origin, form.destination)) {
    errors.origin = "Origin and destination can't be the same";
    errors.destination = "Origin and destination can't be the same";
  }

  if (!isDepartureBeforeArrival(form.departureTime, form.arrivalTime)) {
    errors.departureTime = "departure time must be before arrival time";
    errors.arrivalTime = "departure time must be before arrival time";
  }

  if (!isBookedWithinTotal(Number(form.bookedSeats), Number(form.totalSeats))) {
    errors.bookedSeats = "Booked seats can't exceed total seats";
    errors.totalSeats = "Booked seats can't exceed total seats";
  }

  return errors;
};

export const EditModal: React.FunctionComponent<Props> = ({
  isOpen,
  flight,
  handleClose,
  handleSave,
}) => {
  const [form, setForm] = useState({
    ...flight,
    totalSeats: String(flight.totalSeats),
    bookedSeats: String(flight.bookedSeats),
  });
  const [errors, setErrors] = useState(getErrors(form));

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    setErrors(getErrors(newForm));
  };

  const noop = () => {};

  const hasErrors = Object.values(errors).some((error) => error !== "");

  const handleSaveClick = () => {
    if (hasErrors) return;

    handleSave({
      ...form,
      totalSeats: Number(form.totalSeats),
      bookedSeats: Number(form.bookedSeats),
    });
  };

  return (
    <Overlay>
      <ModalBox>
        <Title>Edit {flight.flightNumber}</Title>

        <FormInput
          name="airline"
          type={FormType.TEXT}
          value={form.airline}
          placeholder="Airline"
          id="editAirline"
          label="Airline"
          handleChange={handleChange}
          handleBlur={noop}
          error={errors.airline}
          touched={true}
        />
        {errors.airline && <FormInputError error={errors.airline} />}

        <FormInput
          name="origin"
          type={FormType.TEXT}
          value={form.origin}
          placeholder="Origin"
          id="editOrigin"
          label="Origin"
          handleChange={handleChange}
          handleBlur={noop}
          error={errors.origin}
          touched={true}
        />
        {errors.origin && <FormInputError error={errors.origin} />}

        <FormInput
          name="destination"
          type={FormType.TEXT}
          value={form.destination}
          placeholder="Destination"
          id="editDestination"
          label="Destination"
          handleChange={handleChange}
          handleBlur={noop}
          error={errors.destination}
          touched={true}
        />
        {errors.destination && <FormInputError error={errors.destination} />}

        <FormInput
          name="departureTime"
          type={FormType.DATE_TIME_LOCAL}
          value={form.departureTime}
          placeholder="Departure Time"
          id="editDepartureTime"
          label="Departure Time"
          handleChange={handleChange}
          handleBlur={noop}
          error={errors.departureTime}
          touched={true}
        />
        {errors.departureTime && (
          <FormInputError error={errors.departureTime} />
        )}

        <FormInput
          name="arrivalTime"
          type={FormType.DATE_TIME_LOCAL}
          value={form.arrivalTime}
          placeholder="Arrival Time"
          id="editArrivalTime"
          label="Arrival Time"
          handleChange={handleChange}
          handleBlur={noop}
          error={errors.arrivalTime}
          touched={true}
        />
        {errors.arrivalTime && <FormInputError error={errors.arrivalTime} />}

        <FormInput
          name="status"
          type={FormType.SELECT}
          value={form.status}
          placeholder="Status"
          id="editStatus"
          label="Status"
          handleChange={handleChange}
          handleBlur={noop}
          error={errors.status}
          touched={true}
        />
        {errors.status && <FormInputError error={errors.status} />}

        <FormInput
          name="totalSeats"
          type={FormType.NUMBER}
          value={form.totalSeats}
          placeholder="Total Seats"
          id="editTotalSeats"
          label="Total Seats"
          handleChange={handleChange}
          handleBlur={noop}
          error={errors.totalSeats}
          touched={true}
        />
        {errors.totalSeats && <FormInputError error={errors.totalSeats} />}

        <FormInput
          name="bookedSeats"
          type={FormType.NUMBER}
          value={form.bookedSeats}
          placeholder="Booked Seats"
          id="editBookedSeats"
          label="Booked Seats"
          handleChange={handleChange}
          handleBlur={noop}
          error={errors.bookedSeats}
          touched={true}
        />
        {errors.bookedSeats && <FormInputError error={errors.bookedSeats} />}

        <Button
          handleButton={handleSaveClick}
          label="Save"
          variant={ButtonVariant.PRIMARY}
          disabled={hasErrors}
        >
          <FaCheck />
        </Button>
        <Button
          handleButton={handleClose}
          label="Cancel"
          variant={ButtonVariant.SECONDARY}
        >
          <FaXmark />
        </Button>
      </ModalBox>
    </Overlay>
  );
};
