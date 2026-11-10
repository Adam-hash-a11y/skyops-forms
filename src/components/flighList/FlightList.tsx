import styled from "styled-components";
import { FlightStatus, type Flight } from "../../types/flightTypes";
import { FligthCard } from "../flightCard/FlightCard";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuPlus } from "react-icons/lu";
import { useCallback, useEffect, useReducer, useState } from "react";
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
import { toast } from "react-toastify";
import { EntityName } from "../../types/entityTypes";
import { theme } from "../../theme/theme";

const Title = styled.h2`
  font-size: ${theme.fontSizes.title};
  font-weight: ${theme.fontWeights.semibold};
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[20]} 2%;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[20]};
  align-items: flex-end;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[10]};
`;

const Subtitle = styled.div`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.secondary};
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
        toast.error((error as Error).message);
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

  const handleOpenFlightCreateModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

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
    status: FlightStatus,
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
      toast.success(flightToEdit ? "Flight updated" : "Flight created");
    } catch (error) {
      toast.error((error as Error).message);
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
      toast.success("Flight deleted");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: FlightFilterActionType.SET_FILTER,
        payload: { value: e.target.value, name: e.target.name },
      });
    },
    [],
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({
        type: FlightFilterActionType.SET_FILTER,
        payload: { value: e.target.value, name: e.target.name },
      });
    },
    [],
  );

  const handleResetFilter = async () => {
    dispatch({ type: FlightFilterActionType.RESET_FILTERS });
    try {
      const flights = await getFlights();
      setAllFlights(flights);
    } catch (error) {
      toast.error((error as Error).message);
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
      toast.error((error as Error).message);
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
      toast.success("Ticket booked");
    } catch (error) {
      toast.error((error as Error).message);
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
          entityName={EntityName.FLIGHT}
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
            flight.status === FlightStatus.SCHEDULED ||
            flight.status === FlightStatus.DELAYED;
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
