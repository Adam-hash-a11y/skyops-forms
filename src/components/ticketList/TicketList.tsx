import { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import type { Ticket } from "../../types/ticketTypes";
import type { Flight } from "../../types/flightTypes";
import type { Passenger } from "../../types/passengerTypes";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuPlus } from "react-icons/lu";
import { TicketCard } from "../shared/ticketCard/TicketCard";
import { TicketFormModal } from "../shared/ticketFormModal/TicketFormModal";
import { TicketCancelModal } from "../shared/ticketCancelModal/TicketCancelModal";
import { TicketFilters } from "../ticketFilters/TicketFilters";
import { initialState, ticketFilterReducer } from "./reducer";
import { TicketFilterActionType } from "./action";
import { getFlights } from "../../service/flightService";
import { getPassengers } from "../../service/passengerService";
import {
  cancelTicket,
  createTicket,
  getTickets,
  getTicketsByFlight,
  getTicketsByPassenger,
} from "../../service/ticketService";

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

export const TicketList = () => {
  const [state, dispatch] = useReducer(ticketFilterReducer, initialState);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const loadedTickets = await getTickets();
        setAllTickets(loadedTickets);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const loadedFlights = await getFlights();
        setFlights(loadedFlights);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFlights();
  }, []);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const loadedPassengers = await getPassengers();
        setPassengers(loadedPassengers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPassengers();
  }, []);

  const handleOpenTicketCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenCancelModal = (ticketId: string) => {
    setTicketToCancel(ticketId);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setTicketToCancel("");
  };

  const handleCloseTicketModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTicket = async (
    flightId: string,
    passengerId: string,
    seatNumber: string,
    ticketClass: string,
  ) => {
    try {
      await createTicket(flightId, passengerId, seatNumber, ticketClass);
      dispatch({ type: TicketFilterActionType.RESET_TICKET_FILTERS });
      const loadedTickets = await getTickets();
      setAllTickets(loadedTickets);
      handleCloseTicketModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeFilter = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch({
      type: TicketFilterActionType.SET_TICKET_FILTER,
      payload: { value: e.target.value, name: e.target.name },
    });
  };

  const handleResetFilter = async () => {
    dispatch({ type: TicketFilterActionType.RESET_TICKET_FILTERS });
    try {
      const loadedTickets = await getTickets();
      setAllTickets(loadedTickets);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      if (state.filterBy === "flight" && state.filterValue !== "") {
        const loadedTickets = await getTicketsByFlight(state.filterValue);
        setAllTickets(loadedTickets);
      } else if (state.filterBy === "passenger" && state.filterValue !== "") {
        const loadedTickets = await getTicketsByPassenger(state.filterValue);
        setAllTickets(loadedTickets);
      } else {
        const loadedTickets = await getTickets();
        setAllTickets(loadedTickets);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const flightOptions = [
    { value: "", label: "Select..." },
    ...flights.map((flight) => ({
      value: flight.id,
      label: flight.flightNumber,
    })),
  ];

  const passengerOptions = [
    { value: "", label: "Select..." },
    ...passengers.map((passenger) => ({
      value: passenger.id,
      label: passenger.lastName + ", " + passenger.firstName,
    })),
  ];

  const filterValueOptions =
    state.filterBy === "flight" ? flightOptions : passengerOptions;

  const handleCancelTicket = async () => {
    try {
      await cancelTicket(ticketToCancel);
      dispatch({ type: TicketFilterActionType.RESET_TICKET_FILTERS });
      const loadedTickets = await getTickets();
      setAllTickets(loadedTickets);
      handleCloseCancelModal();
    } catch (error) {
      console.error(error);
    }
  };

  const cancelledTicket = allTickets.find(
    (ticket) => ticket.id === ticketToCancel,
  );

  return (
    <>
      <PageHeader>
        <TitleBlock>
          <Title>Tickets</Title>
          <Subtitle>{allTickets.length} tickets</Subtitle>
        </TitleBlock>
        <Button
          label="Book ticket"
          variant={ButtonVariant.PRIMARY}
          handleButton={handleOpenTicketCreateModal}
        >
          <LuPlus />
        </Button>
      </PageHeader>

      <TicketFilters
        filterBy={state.filterBy}
        filterValue={state.filterValue}
        filterValueOptions={filterValueOptions}
        handleChange={handleChangeFilter}
        handleReset={handleResetFilter}
        handleSearch={handleSearch}
      />

      {isModalOpen && (
        <TicketFormModal
          handleClose={handleCloseTicketModal}
          handleSave={handleSaveTicket}
        />
      )}

      {isCancelModalOpen && cancelledTicket && (
        <TicketCancelModal
          seatNumber={cancelledTicket.seatNumber}
          flightNumber={
            cancelledTicket.flightNumber === ""
              ? "deleted flight"
              : cancelledTicket.flightNumber
          }
          handleClose={handleCloseCancelModal}
          handleCancel={handleCancelTicket}
        />
      )}

      <Container>
        {allTickets.map((ticket) => {
          const isDeletedFlight = ticket.flightNumber === "";
          const isDeletedPassenger = ticket.passportNumber === "";

          return (
            <TicketCard
              key={ticket.id}
              passengerName={
                isDeletedPassenger ? "Deleted passenger" : ticket.passengerName
              }
              isDeletedPassenger={isDeletedPassenger}
              isDeletedFlight={isDeletedFlight}
              flightNumber={
                isDeletedFlight ? "Deleted flight" : ticket.flightNumber
              }
              origin={ticket.origin}
              destination={ticket.destination}
              status={ticket.status}
              seatNumber={ticket.seatNumber}
              ticketClass={ticket.ticketClass}
              price={ticket.price}
              createdAt={ticket.createdAt}
              handleCancel={() => handleOpenCancelModal(ticket.id)}
              cancelDisabled={ticket.status === "Cancelled"}
            />
          );
        })}
      </Container>
    </>
  );
};
