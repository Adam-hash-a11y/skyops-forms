import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import type { Ticket } from "../../types/ticketTypes";
import type { Passenger } from "../../types/passengerTypes";
import { TicketCard } from "../shared/ticketCard/TicketCard";
import { TicketCancelModal } from "../shared/ticketCancelModal/TicketCancelModal";
import { getPassenger } from "../../service/passengerService";
import {
  cancelTicket,
  getTicketsByPassenger,
} from "../../service/ticketService";
import { toast } from "react-toastify";
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

export const PassengerDetailsPage = () => {
  const { passportNumber } = useParams();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketToCancel, setTicketToCancel] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [passenger, setPassenger] = useState<Passenger>();

  useEffect(() => {
    const fetchPassenger = async () => {
      try {
        if (passportNumber) {
          const loadedPassenger = await getPassenger(passportNumber);
          setPassenger(loadedPassenger);
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    fetchPassenger();
  }, [passportNumber]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (passenger) {
          const loadedTickets = await getTicketsByPassenger(passenger.id);
          setTickets(loadedTickets);
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    fetchTickets();
  }, [passenger]);

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
      if (passenger) {
        const loadedTickets = await getTicketsByPassenger(passenger.id);
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

  if (!passenger) return <NotFound />;

  return (
    <>
      <BackLink to="/passengers">← All passengers</BackLink>
      <PageHeader>
        <TitleBlock>
          <Title>{passenger.firstName + " " + passenger.lastName}</Title>
          <Subtitle>
            {passenger.passportNumber} · {passenger.nationality}
          </Subtitle>
        </TitleBlock>
      </PageHeader>

      <SectionHeading>
        Tickets of this passenger ({tickets.length})
      </SectionHeading>

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

      {tickets.length === 0 && (
        <EmptyTickets>
          <EmptyTitle>No tickets yet</EmptyTitle>
          <EmptyText>This passenger has no tickets.</EmptyText>
        </EmptyTickets>
      )}

      <Container>
        {tickets.map((ticket) => {
          const isDeletedFlight = ticket.flightNumber === "";

          return (
            <TicketCard
              key={ticket.id}
              passengerName={passenger.firstName + " " + passenger.lastName}
              isDeletedPassenger={false}
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
              cancelDisabled={ticket.status === TicketStatus.CANCELLED}
            />
          );
        })}
      </Container>
    </>
  );
};
