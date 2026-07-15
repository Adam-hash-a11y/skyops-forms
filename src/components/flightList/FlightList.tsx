import { useState } from "react";
import { flightArray, type FlightData } from "../data/flightData";

export const FlightList = () => {
  const [flights, setFlights] = useState<FlightData[]>([...flightArray]);
  return (
    <>
      {console.log("here array", flightArray)}
      {console.log("state", flights)}
      {flights.map((flight, index) => (
        <ul key={index}>
          <li>{flight.flightNumber}</li>
          <li>{flight.airline}</li>
          <li>{flight.arrivalTime}</li>
          <li>{flight.departureTime}</li>
          <li>{flight.origin}</li>
          <li>{flight.destination}</li>
          <li>{flight.status}</li>
          <li>{flight.bookedSeats}</li>
          <li>{flight.totalSeats}</li>
        </ul>
      ))}
    </>
  );
};
