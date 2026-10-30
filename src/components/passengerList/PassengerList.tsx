import { useReducer, useState } from "react";
import { passengers, type Passenger } from "../../data/passengerData";
import styled from "styled-components";
import { PassengerCard } from "../passengerCard/PassengerCard";
import { Button, ButtonVariant } from "../shared/button/Button";
import { LuPlus } from "react-icons/lu";
import { PassengerFormModal } from "../shared/passengerFormModal/PassengerFormModal";
import { DeleteModal } from "../shared/deleteModal/DeleteModal";
import { PassengerFilters } from "../passengerFilters/PassengerFilters";
import { initialState, passengerFilterReducer } from "./reducer";
import { RESET_PASSENGER_FILTERS, SET_PASSENGER_FILTER } from "./action";

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

  const [allPassengers, setAllPassengers] = useState<Passenger[]>([
    ...passengers,
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passengerToEdit, setPassengerToEdit] = useState("");
  const [passengerToDelete, setPassengerToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenPassengerCreateModal = () => {
    setPassengerToEdit("");
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

  const handleSavePassenger = (savedPassenger: Passenger) => {
    const newPassengers = [...allPassengers];

    if (passengerToEdit) {
      const index = newPassengers.findIndex(
        (passenger) => passenger.passportNumber === passengerToEdit,
      );

      if (index === -1) return;

      newPassengers[index] = savedPassenger;
    } else {
      newPassengers.push(savedPassenger);
    }

    setAllPassengers(newPassengers);
    handleClosePassengerModal();
  };

  const handleOpenDeleteModal = (passportNumber: string) => {
    setPassengerToDelete(passportNumber);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPassengerToDelete("");
  };

  const handleDeletePassenger = () => {
    const remainingPassengers = allPassengers.filter(
      (passenger) => passenger.passportNumber !== passengerToDelete,
    );

    setAllPassengers(remainingPassengers);
    handleCloseDeleteModal();
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

  const handleResetFilter = () => {
    dispatch({ type: RESET_PASSENGER_FILTERS });
  };

  const displayedPassengers = allPassengers.filter((passenger) => {
    const firstNameFilter = passenger.firstName
      .toLowerCase()
      .includes(state.firstName.trim().toLowerCase());
    const lastNameFilter = passenger.lastName
      .toLowerCase()
      .includes(state.lastName.trim().toLowerCase());

    const nationalityFilter =
      state.nationality === ""
        ? true
        : passenger.nationality === state.nationality;

    return firstNameFilter && lastNameFilter && nationalityFilter;
  });

  if (state.sortBy === "firstName") {
    displayedPassengers.sort((a, b) => {
      if (a.firstName < b.firstName) return -1;
      if (a.firstName > b.firstName) return 1;
      return 0;
    });
  }

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

      <Container>
        {displayedPassengers.map((passenger) => {
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
              // handleBook={}
            />
          );
        })}
      </Container>
    </>
  );
};
