import styled from "styled-components";
import { flights, type Flight } from "../../data/flightData";
import { Button, ButtonVariant } from "../shared/button/Button";
import { useState } from "react";
import { DeleteModal } from "../shared/deleteModal/DeleteModal";

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
  const [allFlights, setAllFlights] = useState<Flight[]>([...flights]);
  const [filter, setFilter] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleModalOpen = (index: number) => {
    setOpenIndex(index);
  };

  const handleModalClose = () => {
    setOpenIndex(null);
  };

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterText = e.target.value;
    setFilter(filterText);
  };

  const displayedFlights = allFlights.filter((item) =>
    filter === "" ? true : item.flightNumber.includes(filter),
  );
  const handleDelete = (index: number) => {
    setAllFlights((prev) => prev.filter((_item, i) => i !== index));
    setOpenIndex(null);
  };
  return (
    <>
      <Title>Flights List</Title>
      <pre>State :{JSON.stringify(allFlights)}</pre>
      <pre>variable : {JSON.stringify(flights)}</pre>
      <input
        type="text"
        placeholder="filter by"
        value={filter}
        onChange={handleChangeFilter}
      />
      {displayedFlights.map((flight, index) => {
        const currentIndex = allFlights.indexOf(flight);
        return (
          <Card key={flight.flightNumber}>
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
            <Button
              handleButton={() => handleModalOpen(index)}
              label="DELETE"
              variant={ButtonVariant.DANGER}
            />
            {openIndex === index && (
              <DeleteModal
                itemKey={currentIndex}
                label="Flight"
                isOpen={true}
                handleClose={handleModalClose}
                handleDelete={() => handleDelete(currentIndex)}
              />
            )}
          </Card>
        );
      })}
    </>
  );
};
