import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  type Ticket,
  TicketFilterBy,
  TicketStatus,
} from "../../types/ticketTypes";
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

export const TicketList = () => {
  const { t } = useTranslation();
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
        toast.error((error as Error).message);
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
        toast.error((error as Error).message);
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
        toast.error((error as Error).message);
      }
    };
    fetchPassengers();
  }, []);

  const handleOpenTicketCreateModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleOpenCancelModal = useCallback((ticketId: string) => {
    setTicketToCancel(ticketId);
    setIsCancelModalOpen(true);
  }, []);

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
      toast.success(t("toast.ticketBooked"));
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({
        type: TicketFilterActionType.SET_TICKET_FILTER,
        payload: { value: e.target.value, name: e.target.name },
      });
    },
    [],
  );

  const handleResetFilter = async () => {
    dispatch({ type: TicketFilterActionType.RESET_TICKET_FILTERS });
    try {
      const loadedTickets = await getTickets();
      setAllTickets(loadedTickets);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleSearch = async () => {
    try {
      if (
        state.filterBy === TicketFilterBy.FLIGHT &&
        state.filterValue !== ""
      ) {
        const loadedTickets = await getTicketsByFlight(state.filterValue);
        setAllTickets(loadedTickets);
      } else if (
        state.filterBy === TicketFilterBy.PASSENGER &&
        state.filterValue !== ""
      ) {
        const loadedTickets = await getTicketsByPassenger(state.filterValue);
        setAllTickets(loadedTickets);
      } else {
        toast.error(t("toast.selectFlightOrPassenger"));
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const flightOptions = useMemo(() => {
    return [
      { value: "", label: t("common.select") },
      ...flights.map((flight) => ({
        value: flight.id,
        label: flight.flightNumber,
      })),
    ];
  }, [flights, t]);

  const passengerOptions = useMemo(() => {
    return [
      { value: "", label: t("common.select") },
      ...passengers.map((passenger) => ({
        value: passenger.id,
        label: passenger.lastName + ", " + passenger.firstName,
      })),
    ];
  }, [passengers, t]);

  const filterValueOptions =
    state.filterBy === TicketFilterBy.FLIGHT ? flightOptions : passengerOptions;

  const handleCancelTicket = async () => {
    try {
      await cancelTicket(ticketToCancel);
      dispatch({ type: TicketFilterActionType.RESET_TICKET_FILTERS });
      const loadedTickets = await getTickets();
      setAllTickets(loadedTickets);
      handleCloseCancelModal();
      toast.success(t("toast.ticketCancelled"));
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const cancelledTicket = allTickets.find(
    (ticket) => ticket.id === ticketToCancel,
  );

  return (
    <>
      <PageHeader>
        <TitleBlock>
          <Title>{t("tickets.title")}</Title>
          <Subtitle>
            {t("tickets.subtitle", { total: allTickets.length })}
          </Subtitle>
        </TitleBlock>
        <Button
          label={t("tickets.book")}
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
        handleSelectChange={handleSelectChange}
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
              ? t("common.deletedFlightLower")
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
                isDeletedPassenger
                  ? t("common.deletedPassenger")
                  : ticket.passengerName
              }
              isDeletedPassenger={isDeletedPassenger}
              isDeletedFlight={isDeletedFlight}
              flightNumber={
                isDeletedFlight
                  ? t("common.deletedFlight")
                  : ticket.flightNumber
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
