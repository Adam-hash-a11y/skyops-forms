import styled from "styled-components";
import { flights, type Flight } from "../../data/flightData";
import { FligthCard } from "../flightCard/FlightCard";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuPlus } from "react-icons/lu";
import { useState } from "react";
import { FlightFormModal } from "../shared/flightFormModal/FlightFormModal";
import { DeleteModal } from "../shared/deleteModal/DeleteModal";

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
  const [allFlights, setAllFlights] = useState(flights);
  const [flightToEdit, setFlightToEdit] = useState("");
  const [flightToDelete, setFlightToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenFlightCreateModal = () => {
    setFlightToEdit("");
    setIsModalOpen(true);
  };

  const handleCloseFlightModal = () => {
    setIsModalOpen(false);
    setFlightToEdit("");
  };

  const handleEditFlight = (flightNumber: string) => {
    setFlightToEdit(flightNumber);
    setIsModalOpen(true);
  };

  const editedFlight = allFlights.find(
    (flight) => flight.flightNumber === flightToEdit,
  );

  const handleSaveFlight = (savedFlight: Flight) => {
    const newFlights = [...allFlights];

    if (flightToEdit) {
      const index = newFlights.findIndex(
        (flight) => flight.flightNumber === flightToEdit,
      );
      newFlights[index] = savedFlight;
    } else {
      newFlights.push(savedFlight);
    }

    setAllFlights(newFlights);
    handleCloseFlightModal();
  };

  const handleOpenDeleteModal = (flightNumber: string) => {
    setFlightToDelete(flightNumber);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setFlightToDelete("");
  };

  const handleDeleteFlight = () => {
    const remainingFlights = allFlights.filter(
      (flight) => flight.flightNumber !== flightToDelete,
    );

    setAllFlights(remainingFlights);
    handleCloseDeleteModal();
  };

  return (
    <>
      <PageHeader>
        <TitleBlock>
          <Title>Flights</Title>
          <Subtitle>
            {allFlights.length} flights · all times in UTC, 24-hour
          </Subtitle>
        </TitleBlock>
        <Button
          label="New flight"
          variant={ButtonVariant.PRIMARY}
          handleButton={handleOpenFlightCreateModal}
        >
          <LuPlus />
        </Button>
      </PageHeader>

      {isModalOpen && (
        <FlightFormModal
          flight={editedFlight}
          handleClose={handleCloseFlightModal}
          handleSave={handleSaveFlight}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          handleClose={handleCloseDeleteModal}
          title="Delete flight"
          action="Delete"
          itemName={flightToDelete}
          deleteButtonLabel="Delete flight"
          handleDelete={handleDeleteFlight}
        />
      )}

      <Container>
        {allFlights.map((flight, index) => {
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
              handleEdit={() => handleEditFlight(flight.flightNumber)}
              handleDelete={() => handleOpenDeleteModal(flight.flightNumber)}
              // handleBook={}
            />
          );
        })}
      </Container>
    </>
  );
};
