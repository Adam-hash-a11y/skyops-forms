import { useCallback, useEffect, useReducer, useState } from "react";
import { type Passenger } from "../../types/passengerTypes";
import styled from "styled-components";
import { PassengerCard } from "../passengerCard/PassengerCard";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuPlus } from "react-icons/lu";
import { PassengerFormModal } from "../shared/passengerFormModal/PassengerFormModal";
import { DeleteModal } from "../shared/deleteModal/DeleteModal";
import { PassengerFilters } from "../passengerFilters/PassengerFilters";
import { initialState, passengerFilterReducer } from "./reducer";
import { PassengerFilterActionType } from "./action";
import { TicketFormModal } from "../shared/ticketFormModal/TicketFormModal";
import { createTicket } from "../../service/ticketService";
import {
  createPassenger,
  deletePassenger,
  getPassengers,
  searchPassengers,
  updatePassenger,
} from "../../service/passengerService";
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

export const PassengerList = () => {
  const [state, dispatch] = useReducer(passengerFilterReducer, initialState);
  const [allPassengers, setAllPassengers] = useState<Passenger[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passengerToEdit, setPassengerToEdit] = useState("");
  const [passengerToDelete, setPassengerToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [passengerToBook, setPassengerToBook] = useState("");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const passengers = await getPassengers();
        setAllPassengers(passengers);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    fetchPassengers();
  }, []);

  const handleOpenTicketCreateModal = (passportNumber: string) => {
    setPassengerToBook(passportNumber);
    setIsTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalOpen(false);
    setPassengerToBook("");
  };

  const handleOpenPassengerCreateModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleClosePassengerModal = () => {
    setIsModalOpen(false);
    setPassengerToEdit("");
  };

  const handleEditPassenger = (passportNumber: string) => {
    setPassengerToEdit(passportNumber);
    setIsModalOpen(true);
  };

  const editedPassenger = allPassengers.find(
    (passenger) => passenger.passportNumber === passengerToEdit,
  );

  const handleSavePassenger = async (
    firstName: string,
    lastName: string,
    passportNumber: string,
    nationality: string,
    dateOfBirth: string,
    email: string,
    phoneNumber: string,
  ) => {
    try {
      if (passengerToEdit) {
        await updatePassenger(
          passengerToEdit,
          firstName,
          lastName,
          nationality,
          dateOfBirth,
          email,
          phoneNumber,
        );
        toast.success("Passenger updated");
      } else {
        await createPassenger(
          firstName,
          lastName,
          passportNumber,
          nationality,
          dateOfBirth,
          email,
          phoneNumber,
        );
        toast.success("Passenger created");
      }
      dispatch({ type: PassengerFilterActionType.RESET_PASSENGER_FILTERS });
      const passengers = await getPassengers();
      setAllPassengers(passengers);
      handleClosePassengerModal();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleSaveTicket = async (
    flightId: string,
    passengerId: string,
    seatNumber: string,
    ticketClass: string,
  ) => {
    try {
      await createTicket(flightId, passengerId, seatNumber, ticketClass);
      dispatch({ type: PassengerFilterActionType.RESET_PASSENGER_FILTERS });
      const passengers = await getPassengers();
      setAllPassengers(passengers);
      handleCloseTicketModal();
      toast.success("Ticket booked");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleOpenDeleteModal = (passportNumber: string) => {
    setPassengerToDelete(passportNumber);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPassengerToDelete("");
  };

  const handleDeletePassenger = async () => {
    try {
      await deletePassenger(passengerToDelete);
      setAllPassengers((prev) =>
        prev.filter(
          (passenger) => passenger.passportNumber !== passengerToDelete,
        ),
      );
      handleCloseDeleteModal();
      toast.success("Passenger deleted");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const deletedPassenger = allPassengers.find(
    (passenger) => passenger.passportNumber === passengerToDelete,
  );
  const deletedPassengerName = deletedPassenger
    ? deletedPassenger.firstName +
      " " +
      deletedPassenger.lastName +
      " (" +
      deletedPassenger.passportNumber +
      ")"
    : "";

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: PassengerFilterActionType.SET_PASSENGER_FILTER,
        payload: { value: e.target.value, name: e.target.name },
      });
    },
    [],
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({
        type: PassengerFilterActionType.SET_PASSENGER_FILTER,
        payload: { value: e.target.value, name: e.target.name },
      });
    },
    [],
  );

  const handleResetFilter = async () => {
    dispatch({ type: PassengerFilterActionType.RESET_PASSENGER_FILTERS });
    try {
      const passengers = await getPassengers();
      setAllPassengers(passengers);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleSearch = async () => {
    try {
      const passengers = await searchPassengers(
        state.nationality,
        state.firstName,
        state.lastName,
        state.sortBy,
      );
      setAllPassengers(passengers);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <PageHeader>
        <TitleBlock>
          <Title>Passengers</Title>
          <Subtitle>{allPassengers.length} passengers · registered</Subtitle>
        </TitleBlock>
        <Button
          label="New passenger"
          variant={ButtonVariant.PRIMARY}
          handleButton={handleOpenPassengerCreateModal}
        >
          <LuPlus />
        </Button>
      </PageHeader>

      <PassengerFilters
        firstName={state.firstName}
        lastName={state.lastName}
        nationality={state.nationality}
        sortBy={state.sortBy}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleReset={handleResetFilter}
        handleSearch={handleSearch}
      />

      {isModalOpen && (
        <PassengerFormModal
          passenger={editedPassenger}
          handleClose={handleClosePassengerModal}
          handleSave={handleSavePassenger}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          handleClose={handleCloseDeleteModal}
          title="Delete passenger"
          action="Delete"
          itemName={deletedPassengerName}
          deleteButtonLabel="Delete passenger"
          handleDelete={handleDeletePassenger}
          entityName={EntityName.PASSENGER}
        />
      )}

      {isTicketModalOpen && (
        <TicketFormModal
          passportNumber={passengerToBook}
          handleClose={handleCloseTicketModal}
          handleSave={handleSaveTicket}
        />
      )}

      <Container>
        {allPassengers.map((passenger) => {
          return (
            <PassengerCard
              key={passenger.passportNumber}
              firstName={passenger.firstName}
              lastName={passenger.lastName}
              passportNumber={passenger.passportNumber}
              nationality={passenger.nationality}
              dateOfBirth={passenger.dateOfBirth}
              email={passenger.email}
              phoneNumber={passenger.phoneNumber}
              handleEdit={() => handleEditPassenger(passenger.passportNumber)}
              handleDelete={() =>
                handleOpenDeleteModal(passenger.passportNumber)
              }
              handleBook={() =>
                handleOpenTicketCreateModal(passenger.passportNumber)
              }
            />
          );
        })}
      </Container>
    </>
  );
};
