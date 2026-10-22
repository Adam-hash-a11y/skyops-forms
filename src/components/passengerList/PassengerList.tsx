import { useState } from "react";
import { passengers, type Passenger } from "../../data/passengerData";
import styled from "styled-components";

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
import { PassengerCard } from "../passengerCard/PassengerCard";

export const PassengerList = () => {
  const [allPassengers, setAllPassengers] = useState<Passenger[]>([
    ...passengers,
  ]);

  return (
    <>
      <PageHeader>
        <TitleBlock>
          <Title>Passengers</Title>
          <Subtitle>{allPassengers.length} passengers · registered</Subtitle>
        </TitleBlock>
      </PageHeader>

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
            />
          );
        })}
      </Container>
    </>
  );
};
