import styled from "styled-components";
import { flights } from "../../data/flightData";
import { FligthCard } from "../flightCard/FlightCard";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuPlus } from "react-icons/lu";
import { useState } from "react";
import { FlightFormModal } from "../shared/flightFormModal/FlightFormModal";

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: flex-end;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Subtitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #566377;
`;
export const FlightsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenFlightCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseFlightModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <PageHeader>
        <TitleBlock>
          <Title>Flights</Title>
          <Subtitle>9 flights · all times in UTC, 24-hour</Subtitle>
        </TitleBlock>
        <Button
          label="New flight"
          variant={ButtonVariant.PRIMARY}
          handleButton={handleOpenFlightCreateModal}
        >
          <LuPlus />
        </Button>
      </PageHeader>

      {isModalOpen && <FlightFormModal handleClose={handleCloseFlightModal} />}

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
