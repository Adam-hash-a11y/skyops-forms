import { useEffect, useReducer, useState } from "react";
import { type Passenger } from "../../types/passengerTypes";
import styled from "styled-components";
import { PassengerCard } from "../passengerCard/PassengerCard";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuPlus } from "react-icons/lu";
import { PassengerFormModal } from "../shared/passengerFormModal/PassengerFormModal";
import { DeleteModal } from "../shared/deleteModal/DeleteModal";
import { PassengerFilters } from "../passengerFilters/PassengerFilters";
import { initialState, passengerFilterReducer } from "./reducer";
import { RESET_PASSENGER_FILTERS, SET_PASSENGER_FILTER } from "./action";
import { TicketFormModal } from "../shared/ticketFormModal/TicketFormModal";
import { createTicket } from "../../service/ticketService";
import {
  createPassenger,
  deletePassenger,
  getPassengers,
  searchPassengers,
  updatePassenger,
} from "../../service/passengerService";

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
        console.error(error);
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

  const handleOpenPassengerCreateModal = () => {
    setIsModalOpen(true);
  };

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
      }
      dispatch({ type: RESET_PASSENGER_FILTERS });
      const passengers = await getPassengers();
      setAllPassengers(passengers);
      handleClosePassengerModal();
    } catch (error) {
      console.error(error);
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
      dispatch({ type: RESET_PASSENGER_FILTERS });
      const passengers = await getPassengers();
      setAllPassengers(passengers);
      handleCloseTicketModal();
    } catch (error) {
      console.error(error);
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
    } catch (error) {
      console.error(error);
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

  const handleChangeFilter = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch({
      type: SET_PASSENGER_FILTER,
      payload: { value: e.target.value, name: e.target.name },
    });
  };

  const handleResetFilter = async () => {
    dispatch({ type: RESET_PASSENGER_FILTERS });
    try {
      const passengers = await getPassengers();
      setAllPassengers(passengers);
    } catch (error) {
      console.error(error);
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
      console.error(error);
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
        handleChange={handleChangeFilter}
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
          entityName="passenger"
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
