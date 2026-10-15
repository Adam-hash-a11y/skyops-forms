import styled from "styled-components";
import { flights } from "../../data/flightData";
import { FligthCard } from "../flightCard/FlightCard";

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

export const FlightsList = () => {
  return (
    <>
      <Title>Flights</Title>

      <Container>
        {flights.map((flight, index) => {
          return (
            <FligthCard
              key={flight.flightNumber}
              flightNumber={flight.flightNumber}
              airline={flight.airline}
              status={flight.status}
              origin={flight.origin}
              destination={flight.destination}
              departureTime={flight.departureTime}
              departureDate={flight.departureTime}
              arrivalTime={flight.arrivalTime}
              arrivalDate={flight.arrivalTime}
              bookedSeats={flight.bookedSeats}
              totalSeats={flight.totalSeats}
              bookDisabled={false}
              // handleBook={}
              // handleEdit={handleUpdate}
              // handleDelete={handleDelete}
            />
          );
        })}
      </Container>
    </>
  );
};
