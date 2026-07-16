import { useState } from "react";
import { flightArray, type FlightData } from "../data/flightData";
import styled from "styled-components";

const FlightCard = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  justify-content: space-between;
`;

const FlightItem = styled.li`
  font-size: 0.85rem;
  color: #334155;
  background-color: #f1f5f9;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  white-space: nowrap;
`;

export const FlightList = () => {
  const [flights, setFlights] = useState<FlightData[]>([...flightArray]);
  return (
    <>
      {console.log("here array", flightArray)}
      {console.log("state", flights)}
      {flights.map((flight, index) => (
        <FlightCard key={index}>
          <FlightItem>Number: {flight.flightNumber}</FlightItem>
          <FlightItem>Airline: {flight.airline}</FlightItem>
          <FlightItem>Arrival: {flight.arrivalTime}</FlightItem>
          <FlightItem>Departure: {flight.departureTime}</FlightItem>
          <FlightItem>Origin: {flight.origin}</FlightItem>
          <FlightItem>Destination: {flight.destination}</FlightItem>
          <FlightItem>Status: {flight.status}</FlightItem>
          <FlightItem>Booked: {flight.bookedSeats}</FlightItem>
          <FlightItem>Total: {flight.totalSeats}</FlightItem>
        </FlightCard>
      ))}
    </>
  );
};
