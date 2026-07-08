import styled from "styled-components";
import { flights } from "../../data/flightData";

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Card = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background: white;
`;

const FlightHeader = styled.p`
  font-weight: 700;
  margin: 0 0 6px 0;
`;

const Route = styled.p`
  color: #475569;
  margin: 0 0 6px 0;
`;

const Meta = styled.p`
  color: #64748b;
  font-size: 13px;
  margin: 0;
`;

export const FlightsList = () => {
  return (
    <>
      <Title>Flights List</Title>
      {flights.map((flight, index) => (
        <Card key={index}>
          <FlightHeader>
            {flight.flightNumber} — {flight.airline}
          </FlightHeader>
          <Route>
            {flight.origin} → {flight.destination}
          </Route>
          <Meta>Status: {flight.status}</Meta>
          <Meta>
            Seats: {flight.bookedSeats}/{flight.totalSeats}
          </Meta>
        </Card>
      ))}
    </>
  );
};
