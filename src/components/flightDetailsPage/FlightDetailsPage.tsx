import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { flights } from "../../data/flightData";
import { tickets } from "../../data/ticketData";
import { passengers } from "../../data/passengerData";
import { TicketCard } from "../shared/ticketCard/TicketCard";
import { TicketCancelModal } from "../shared/ticketCancelModal/TicketCancelModal";

const BackLink = styled(Link)`
  font-size: 13px;
  font-weight: 600;
  color: #1b63d6;
  text-decoration: none;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 0;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
`;

const Subtitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #566377;
`;

const SectionHeading = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px 2%;
`;

const EmptyTickets = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border: 1px dashed #c9d2df;
  border-radius: 10px;
  padding: 48px 24px;
  color: #566377;
`;

const EmptyTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #162033;
  margin-bottom: 5px;
`;

const EmptyText = styled.div`
  font-size: 14px;
  font-weight: 400;
`;

export const FlightDetailsPage = () => {
  const { flightNumber } = useParams();

  const [allTickets, setAllTickets] = useState(tickets);
  const [ticketToCancel, setTicketToCancel] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const flight = flights.find((flight) => flight.flightNumber === flightNumber);

  const handleOpenCancelModal = (ticketId: string) => {
    setTicketToCancel(ticketId);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setTicketToCancel("");
  };

  const handleCancelTicket = () => {
    const newTickets = [...allTickets];
    const index = newTickets.findIndex(
      (ticket) => ticket.id === ticketToCancel,
    );

    if (index === -1) return;

    newTickets[index] = { ...newTickets[index], status: "Cancelled" };

    setAllTickets(newTickets);
    handleCloseCancelModal();
  };

  const cancelledTicket = allTickets.find(
    (ticket) => ticket.id === ticketToCancel,
  );

  if (!flight) return null;

  const flightTickets = allTickets.filter(
    (ticket) => ticket.flightNumber === flight.flightNumber,
  );

  return (
    <>
      <BackLink to="/flights">← All flights</BackLink>
      <PageHeader>
        <TitleBlock>
          <Title>{flight.flightNumber}</Title>
          <Subtitle>
            {flight.airline} · {flight.origin} → {flight.destination}
          </Subtitle>
        </TitleBlock>
      </PageHeader>

      <SectionHeading>
        Tickets on this flight ({flightTickets.length})
      </SectionHeading>

      {isCancelModalOpen && cancelledTicket && (
        <TicketCancelModal
          seatNumber={cancelledTicket.seatNumber}
          flightNumber={flight.flightNumber}
          handleClose={handleCloseCancelModal}
          handleCancel={handleCancelTicket}
        />
      )}

      {flightTickets.length === 0 && (
        <EmptyTickets>
          <EmptyTitle>No tickets yet</EmptyTitle>
          <EmptyText>Book the first ticket for this flight.</EmptyText>
        </EmptyTickets>
      )}

      <Container>
        {flightTickets.map((ticket) => {
          const ticketPassenger = passengers.find(
            (passenger) => passenger.passportNumber === ticket.passportNumber,
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
              isDeletedFlight={false}
              flightNumber={flight.flightNumber}
              origin={flight.origin}
              destination={flight.destination}
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
