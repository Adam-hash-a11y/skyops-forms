import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import type { Flight } from "../../types/flightTypes";
import type { Ticket } from "../../types/ticketTypes";
import { TicketCard } from "../shared/ticketCard/TicketCard";
import { TicketCancelModal } from "../shared/ticketCancelModal/TicketCancelModal";
import { getFlight } from "../../service/flightService";
import { cancelTicket, getTicketsByFlight } from "../../service/ticketService";

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

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketToCancel, setTicketToCancel] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [flight, setFlight] = useState<Flight>();

  useEffect(() => {
    const fetchFlightAndTickets = async () => {
      try {
        if (flightNumber) {
          const loadedFlight = await getFlight(flightNumber);
          setFlight(loadedFlight);
          const loadedTickets = await getTicketsByFlight(loadedFlight.id);
          setTickets(loadedTickets);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFlightAndTickets();
  }, [flightNumber]);

  const handleOpenCancelModal = (ticketId: string) => {
    setTicketToCancel(ticketId);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setTicketToCancel("");
  };

  const handleCancelTicket = async () => {
    try {
      await cancelTicket(ticketToCancel);
      if (flight) {
        const loadedTickets = await getTicketsByFlight(flight.id);
        setTickets(loadedTickets);
      }
      handleCloseCancelModal();
    } catch (error) {
      console.error(error);
    }
  };

  const cancelledTicket = tickets.find(
    (ticket) => ticket.id === ticketToCancel,
  );

  if (!flight) return null;

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

      <SectionHeading>Tickets on this flight ({tickets.length})</SectionHeading>

      {isCancelModalOpen && cancelledTicket && (
        <TicketCancelModal
          seatNumber={cancelledTicket.seatNumber}
          flightNumber={flight.flightNumber}
          handleClose={handleCloseCancelModal}
          handleCancel={handleCancelTicket}
        />
      )}

      {tickets.length === 0 && (
        <EmptyTickets>
          <EmptyTitle>No tickets yet</EmptyTitle>
          <EmptyText>Book the first ticket for this flight.</EmptyText>
        </EmptyTickets>
      )}

      <Container>
        {tickets.map((ticket) => {
          const isDeletedPassenger = ticket.passportNumber === "";

          return (
            <TicketCard
              key={ticket.id}
              passengerName={
                isDeletedPassenger ? "Deleted passenger" : ticket.passengerName
              }
              isDeletedPassenger={isDeletedPassenger}
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
