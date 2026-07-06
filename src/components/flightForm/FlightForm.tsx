import React, { useState } from "react";
import { FormInput } from "../shared/formInput/FlightFormInput";
import validator from "validator";
import { Button } from "../shared/button/Button";
import { FaBeer } from "react-icons/fa";
import { FormInputError } from "../shared/formInputError/FormInputError";
import { FormType } from "./types";

export const FlightForm = () => {
  console.log("re-render");
  const [flightNumber, setFlightNumber] = useState("");
  const [airline, setAirline] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [totalSeats, setTotalSeats] = useState("");
  const [bookedSeats, setBookedSeats] = useState("");
  const [errors, setErrors] = useState({
    flightNumber: "",
    airline: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    status: "",
    totalSeats: "",
    bookedSeats: "",
  });

  const handleValidation = () => {
    if (/^SKYOPS-\d{3,}$/.test(flightNumber)) {
      setErrors((prev) => ({
        ...prev,
        flightNumber: "",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        flightNumber: "Flight number must start with SKYOPS-",
      }));
    }
    if (airline.length < 5) {
      setErrors((prev) => ({
        ...prev,
        airline: "Airline must be of length 5",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        airline: "",
      }));
    }
    if (origin.length == 3 && origin == origin.toUpperCase()) {
      setErrors((prev) => ({ ...prev, origin: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        origin: "Origin must be of length 3 and upper case",
      }));
    }
    if (destination.length == 3 && destination == destination.toUpperCase()) {
      setErrors((prev) => ({ ...prev, destination: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        destination: "Destination must be of length 3 and upper case",
      }));
    }
    if (
      destination.length == 3 &&
      destination == destination.toUpperCase() &&
      origin.length == 3 &&
      origin == origin.toUpperCase() &&
      destination === origin
    ) {
      setErrors((prev) => ({
        ...prev,
        destination: "Origin and desination can't be the same",
        origin: "Origin and desination can't be the same",
      }));
    }
    if (validator.isISO8601(departureTime)) {
      console.log("1");
      setErrors((prev) => ({ ...prev, departureTime: "" }));
    } else {
      console.log("2");
      setErrors((prev) => ({
        ...prev,
        departureTime: "departure time must be a valid date",
      }));
    }
    if (validator.isISO8601(arrivalTime)) {
      console.log("3");
      setErrors((prev) => ({ ...prev, arrivalTime: "" }));
    } else {
      console.log("4");
      setErrors((prev) => ({
        ...prev,
        arrivalTime: "arrival time must be a valid date",
      }));
    }
    const dep = new Date(departureTime).getTime();
    const arr = new Date(arrivalTime).getTime();

    if (!Number.isNaN(dep) && !Number.isNaN(arr) && dep >= arr) {
      setErrors((prev) => ({
        ...prev,
        departureTime: "departure time must be before arrival time",
        arrivalTime: "departure time must be before arrival time",
      }));
    }
    if (validator.isInt(totalSeats, { min: 1 })) {
      setErrors((prev) => ({ ...prev, totalSeats: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        totalSeats: "Total seats must be a positive number",
      }));
    }

    if (validator.isInt(bookedSeats, { min: 0 })) {
      setErrors((prev) => ({ ...prev, bookedSeats: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        bookedSeats: "Booked seats must be a valid number",
      }));
    }

    if (
      validator.isInt(totalSeats, { min: 1 }) &&
      validator.isInt(bookedSeats, { min: 0 }) &&
      Number.parseInt(bookedSeats) > Number.parseInt(totalSeats)
    ) {
      setErrors((prev) => ({
        ...prev,
        bookedSeats: "Booked seats can't exceed total seats",
        totalSeats: "Booked seats can't exceed total seats",
      }));
    }
  };

  const handleFligthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlightNumber(e.target.value);
  };

  const handleAirlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAirline(e.target.value);
  };

  const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrigin(e.target.value);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
  };

  const handleDepartureTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDepartureTime(e.target.value);
  };

  const handelArrivalTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArrivalTime(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleTotalSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalSeats(e.target.value);
  };

  const handleBookedSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookedSeats(e.target.value);
  };

  const isButtonDisabled = () => {
    return (
      flightNumber.length == 0 ||
      airline.length == 0 ||
      origin.length == 0 ||
      destination.length == 0 ||
      departureTime.length == 0 ||
      arrivalTime.length == 0 ||
      status.length == 0 ||
      bookedSeats.length == 0 ||
      totalSeats.length == 0
    );
  };

  return (
    <>
      <h2>Flight Form </h2>
      <FormInput
        name="Flight Number"
        type={FormType.TEXT}
        value={flightNumber}
        placeholder="Flight Number e.g SKYOPS-101"
        id="FlightNumberInput"
        handleChange={handleFligthNumberChange}
      />

      {errors.flightNumber && <FormInputError error={errors.flightNumber} />}

      <FormInput
        name="Airline"
        type={FormType.TEXT}
        value={airline}
        placeholder="Airline"
        id="FlightAirlineInput"
        handleChange={handleAirlineChange}
      />
      <FormInputError error={errors.airline} />

      <FormInput
        name="Origin"
        type={FormType.TEXT}
        value={origin}
        placeholder="Origin"
        id="FlightOriginInput"
        handleChange={handleOriginChange}
      />
      <FormInputError error={errors.origin} />

      <FormInput
        name="Destination"
        type={FormType.TEXT}
        value={destination}
        placeholder="Destination"
        id="FlightDestinationInput"
        handleChange={handleDestinationChange}
      />
      <FormInputError error={errors.destination} />

      <FormInput
        name="Departure Time"
        type={FormType.DATE_TIME_LOCAL}
        value={departureTime}
        placeholder="Departure Time"
        id="DepartureTimeInput"
        handleChange={handleDepartureTimeChange}
      />
      <FormInputError error={errors.departureTime} />

      <FormInput
        name="Arrival Time"
        type={FormType.DATE_TIME_LOCAL}
        value={arrivalTime}
        placeholder="Arrival Time"
        id="ArrivalTimeInput"
        handleChange={handelArrivalTimeChange}
      />
      <FormInputError error={errors.arrivalTime} />

      <FormInput
        name="Status"
        type={FormType.SELECT}
        value={status}
        placeholder="Status"
        id="StatusInput"
        handleChange={handleStatusChange}
      />

      <FormInput
        name="Total Seats"
        type={FormType.NUMBER}
        value={totalSeats}
        placeholder="Total Seats"
        id="TotalSeatsInput"
        handleChange={handleTotalSeatsChange}
      />
      <FormInputError error={errors.totalSeats} />

      <FormInput
        name="Booked Seats"
        type={FormType.NUMBER}
        value={bookedSeats}
        placeholder="Booked Seats"
        id="BookedSeatsInput"
        handleChange={handleBookedSeatsChange}
      />
      <FormInputError error={errors.bookedSeats} />
      <Button handleButton={handleValidation} label="Validate">
        <FaBeer />
      </Button>
      <Button disabled={isButtonDisabled()} label="Send" />
    </>
  );
};
