import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import type { Flight } from "../../types/flightTypes";
import type { Ticket } from "../../types/ticketTypes";
import { TicketCard } from "../shared/ticketCard/TicketCard";
import { TicketCancelModal } from "../shared/ticketCancelModal/TicketCancelModal";
import { getFlight } from "../../service/flightService";
import { cancelTicket, getTicketsByFlight } from "../../service/ticketService";
import { NotFound } from "../notFound/NotFound";
import { TicketStatus } from "../../types/ticketTypes";
import { theme } from "../../theme/theme";

const BackLink = styled(Link)`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.primary.main};
  text-decoration: none;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: ${theme.spacing[20]} 0;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[10]};
`;

const Title = styled.h2`
  font-size: ${theme.fontSizes.title};
  font-weight: ${theme.fontWeights.semibold};
`;

const Subtitle = styled.div`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.secondary};
`;

const SectionHeading = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  margin-top: ${theme.spacing[8]};
  margin-bottom: ${theme.spacing[20]};
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[20]} 2%;
`;

const EmptyTickets = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${theme.colors.background.paper};
  border: 1px dashed ${theme.colors.border.dashed};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[48]} ${theme.spacing[24]};
  color: ${theme.colors.text.secondary};
`;

const EmptyTitle = styled.div`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[5]};
`;

const EmptyText = styled.div`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.regular};
`;

export const FlightDetailsPage = () => {
  const { flightNumber } = useParams();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketToCancel, setTicketToCancel] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [flight, setFlight] = useState<Flight>();

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        if (flightNumber) {
          const loadedFlight = await getFlight(flightNumber);
          setFlight(loadedFlight);
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    fetchFlight();
  }, [flightNumber]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (flight) {
          const loadedTickets = await getTicketsByFlight(flight.id);
          setTickets(loadedTickets);
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    fetchTickets();
  }, [flight]);

  const handleOpenCancelModal = useCallback((ticketId: string) => {
    setTicketToCancel(ticketId);
    setIsCancelModalOpen(true);
  }, []);

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
      toast.success("Ticket cancelled");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const cancelledTicket = tickets.find(
    (ticket) => ticket.id === ticketToCancel,
  );

  if (!flight) return <NotFound />;

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
              cancelDisabled={ticket.status === TicketStatus.CANCELLED}
            />
          );
        })}
      </Container>
    </>
  );
};
