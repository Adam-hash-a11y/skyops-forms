import { useReducer, useState } from "react";
import styled from "styled-components";
import { tickets, type Ticket } from "../../data/ticketData";
import { flights } from "../../data/flightData";
import { passengers } from "../../data/passengerData";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuPlus } from "react-icons/lu";
import { TicketCard } from "../shared/ticketCard/TicketCard";
import { TicketFormModal } from "../shared/ticketFormModal/TicketFormModal";
import { TicketFilters } from "../ticketFilters/TicketFilters";
import { initialState, ticketFilterReducer } from "./reducer";
import { RESET_TICKET_FILTERS, SET_TICKET_FILTER } from "./action";

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
  const [allTickets, setAllTickets] = useState(tickets);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenTicketCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleCancelTicket = () => {
    console.log("ticket cancelled");
  };

  const handleCloseTicketModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTicket = (savedTicket: Ticket) => {
    const newTickets = [...allTickets];
    const newTicketId = "T-" + String(allTickets.length + 1).padStart(3, "0");

    newTickets.push({
      ...savedTicket,
      id: newTicketId,
      createdAt: new Date().toISOString().slice(0, 16),
    });

    const bookedFlight = flights.find(
      (flight) => flight.flightNumber === savedTicket.flightNumber,
    );
    if (bookedFlight) {
      bookedFlight.takenSeats.push(savedTicket.seatNumber);
    }

    setAllTickets(newTickets);
    handleCloseTicketModal();
  };

  const handleChangeFilter = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch({
      type: SET_TICKET_FILTER,
      payload: { value: e.target.value, name: e.target.name },
    });
  };

  const handleResetFilter = () => {
    dispatch({ type: RESET_TICKET_FILTERS });
  };

  const flightOptions = [
    { value: "", label: "Select..." },
    ...flights.map((flight) => ({
      value: flight.flightNumber,
      label: flight.flightNumber,
    })),
  ];

  const passengerOptions = [
    { value: "", label: "Select..." },
    ...passengers.map((passenger) => ({
      value: passenger.passportNumber,
      label: passenger.lastName + ", " + passenger.firstName,
    })),
  ];

  const filterValueOptions =
    state.filterBy === "flight" ? flightOptions : passengerOptions;

  const displayedTickets = allTickets.filter((ticket) => {
    if (state.filterBy === "flight" && state.filterValue !== "") {
      return ticket.flightNumber === state.filterValue;
    }
    if (state.filterBy === "passenger" && state.filterValue !== "") {
      return ticket.passportNumber === state.filterValue;
    }
    return true;
  });

  return (
    <>
      <PageHeader>
        <TitleBlock>
          <Title>Tickets</Title>
          <Subtitle>{displayedTickets.length} tickets</Subtitle>
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
      />

      {isModalOpen && (
        <TicketFormModal
          handleClose={handleCloseTicketModal}
          handleSave={handleSaveTicket}
        />
      )}

      <Container>
        {displayedTickets.map((ticket) => {
          const ticketPassenger = passengers.find(
            (passenger) => passenger.passportNumber === ticket.passportNumber,
          );

          const ticketFlight = flights.find(
            (flight) => flight.flightNumber === ticket.flightNumber,
          );

          return (
            <TicketCard
              key={ticket.id}
              passengerName={
                ticketPassenger
                  ? ticketPassenger.firstName + " " + ticketPassenger.lastName
                  : "Deleted passenger"
              }
              isDeletedPassenger={!ticketPassenger}
              isDeletedFlight={!ticketFlight}
              flightNumber={
                ticketFlight ? ticket.flightNumber : "Deleted flight"
              }
              origin={ticketFlight ? ticketFlight.origin : "-"}
              destination={ticketFlight ? ticketFlight.destination : "-"}
              status={ticket.status}
              seatNumber={ticket.seatNumber}
              ticketClass={ticket.ticketClass}
              price={ticket.price}
              createdAt={ticket.createdAt}
              handleCancel={handleCancelTicket}
              cancelDisabled={ticket.status === "Cancelled"}
            />
          );
        })}
      </Container>
    </>
  );
};
