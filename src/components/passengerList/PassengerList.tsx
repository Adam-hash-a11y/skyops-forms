import { useState } from "react";
import { passengers, type Passenger } from "../../data/passengerData";
import styled from "styled-components";
import { Button, ButtonVariant } from "../shared/button/Button";
import { DeleteModal } from "../shared/deleteModal/DeleteModal";
import { FaTrash } from "react-icons/fa6";

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Card = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background: white;
`;

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
`;

const PassengerName = styled.p`
  font-weight: 700;
  margin: 0;
`;

const Nationality = styled.p`
  color: #475569;
  margin: 0 0 6px 0;
`;

const Meta = styled.p`
  color: #64748b;
  font-size: 13px;
  margin: 0;
`;

export const PassengerList = () => {
  const [allPassengers, setAllPassengers] = useState<Passenger[]>([
    ...passengers,
  ]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState("");

  const handleModalOpen = (index: number) => {
    setOpenIndex(index);
  };

  const handleModalClose = () => {
    setOpenIndex(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const displayedPassengers = allPassengers.filter((item) =>
    filter === "" ? true : item.firstName.includes(filter),
  );
  const handleDelete = (index: number) => {
    setAllPassengers((prev) => prev.filter((_item, i) => i !== index));
    setOpenIndex(null);
  };

  return (
    <>
      <Title>Passenger List</Title>
      <input
        type="text"
        placeholder="filter passenger"
        value={filter}
        onChange={handleChange}
      />
      {displayedPassengers.map((passenger, index) => (
        <Card key={index}>
          <CardTopRow>
            <PassengerName>
              {passenger.firstName} {passenger.lastName}
            </PassengerName>
            <Button
              handleButton={() => handleModalOpen(index)}
              label="Delete"
              variant={ButtonVariant.DANGER}
            >
              <FaTrash />
            </Button>
          </CardTopRow>
          <Nationality>{passenger.nationality}</Nationality>
          <Meta>DOB: {passenger.dateOfBirth}</Meta>
          <Meta>Passport: {passenger.passportNumber}</Meta>
          <Meta>Phone: {passenger.phoneNumber}</Meta>
          <Meta>Email: {passenger.email}</Meta>
          {openIndex === index && (
            <DeleteModal
              itemKey={index}
              label="Flight"
              isOpen={true}
              handleClose={handleModalClose}
              handleDelete={() => handleDelete(index)}
            />
          )}
        </Card>
      ))}
    </>
  );
};
