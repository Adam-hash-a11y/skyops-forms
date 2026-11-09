import styled from "styled-components";
import { type Flight } from "../../types/flightTypes";
import { FligthCard } from "../flightCard/FlightCard";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuPlus } from "react-icons/lu";
import { useEffect, useReducer, useState } from "react";
import { FlightFormModal } from "../shared/flightFormModal/FlightFormModal";
import { DeleteModal } from "../shared/deleteModal/DeleteModal";
import { FlightFilters } from "../flightFilters/FlightFilters";
import { flightFilterReducer, initialState } from "./reducer";
import { FlightFilterActionType } from "./action";
import { TicketFormModal } from "../shared/ticketFormModal/TicketFormModal";
import { createTicket } from "../../service/ticketService";
import {
  createFlight,
  deleteFlight,
  getFlights,
  searchFlights,
  updateFlight,
} from "../../service/flightService";

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px 2%;
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
  const [state, dispatch] = useReducer(flightFilterReducer, initialState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [flightToEdit, setFlightToEdit] = useState("");
  const [flightToDelete, setFlightToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [flightToBook, setFlightToBook] = useState("");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const flights = await getFlights();
        setAllFlights(flights);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFlights();
  }, []);

  const handleOpenTicketCreateModal = (flightNumber: string) => {
    setFlightToBook(flightNumber);
    setIsTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalOpen(false);
    setFlightToBook("");
  };

  const handleOpenFlightCreateModal = () => {
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

  const handleSaveFlight = async (
    flightNumber: string,
    airline: string,
    origin: string,
    destination: string,
    departureTime: string,
    arrivalTime: string,
    status: string,
    firstSeats: string,
    businessSeats: string,
    economySeats: string,
  ) => {
    try {
      if (flightToEdit) {
        await updateFlight(
          flightNumber,
          airline,
          origin,
          destination,
          departureTime,
          arrivalTime,
          status,
        );
      } else {
        await createFlight(
          flightNumber,
          airline,
          origin,
          destination,
          departureTime,
          arrivalTime,
          status,
          firstSeats,
          businessSeats,
          economySeats,
        );
      }
      dispatch({ type: FlightFilterActionType.RESET_FILTERS });
      const flights = await getFlights();
      setAllFlights(flights);
      handleCloseFlightModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDeleteModal = (flightNumber: string) => {
    setFlightToDelete(flightNumber);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setFlightToDelete("");
  };

  const handleDeleteFlight = async () => {
    try {
      await deleteFlight(flightToDelete);
      setAllFlights((prev) =>
        prev.filter((flight) => flight.flightNumber !== flightToDelete),
      );
      handleCloseDeleteModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: FlightFilterActionType.SET_FILTER,
      payload: { value: e.target.value, name: e.target.name },
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: FlightFilterActionType.SET_FILTER,
      payload: { value: e.target.value, name: e.target.name },
    });
  };

  const handleResetFilter = async () => {
    dispatch({ type: FlightFilterActionType.RESET_FILTERS });
    try {
      const flights = await getFlights();
      setAllFlights(flights);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      const flights = await searchFlights(
        state.status,
        state.origin,
        state.destination,
        state.sortBy,
      );
      setAllFlights(flights);
    } catch (error) {
      console.error(error);
    }
  };

  const originLength = state.origin.trim().length;
  const destinationLength = state.destination.trim().length;
  const searchDisabled =
    (originLength !== 0 && originLength !== 3) ||
    (destinationLength !== 0 && destinationLength !== 3);

  const handleSaveTicket = async (
    flightId: string,
    passengerId: string,
    seatNumber: string,
    ticketClass: string,
  ) => {
    try {
      await createTicket(flightId, passengerId, seatNumber, ticketClass);
      dispatch({ type: FlightFilterActionType.RESET_FILTERS });
      const flights = await getFlights();
      setAllFlights(flights);
      handleCloseTicketModal();
    } catch (error) {
      console.error(error);
    }
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

      <FlightFilters
        status={state.status}
        origin={state.origin}
        destination={state.destination}
        sortBy={state.sortBy}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleReset={handleResetFilter}
        handleSearch={handleSearch}
        searchDisabled={searchDisabled}
      />

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
          entityName="flight"
        />
      )}

      {isTicketModalOpen && (
        <TicketFormModal
          flightNumber={flightToBook}
          handleClose={handleCloseTicketModal}
          handleSave={handleSaveTicket}
        />
      )}

      <Container>
        {allFlights.map((flight) => {
          const isFull = flight.bookedSeats >= flight.totalSeats;
          const isBookableStatus =
            flight.status === "Scheduled" || flight.status === "Delayed";
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
              bookDisabled={isFull || !isBookableStatus}
              handleEdit={() => handleEditFlight(flight.flightNumber)}
              handleDelete={() => handleOpenDeleteModal(flight.flightNumber)}
              handleBook={() =>
                handleOpenTicketCreateModal(flight.flightNumber)
              }
            />
          );
        })}
      </Container>
    </>
  );
};
