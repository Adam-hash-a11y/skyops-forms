import { Link } from "react-router-dom";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #64748b;
  margin-bottom: 24px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

const OptionLink = styled(Link)`
  padding: 12px 20px;
  background-color: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;

  &:hover {
    background-color: #1d4ed8;
  }
`;

export const Home = () => {
  return (
    <>
      <Title>Welcome to SkyOps</Title>
      <Subtitle>What would you like to do?</Subtitle>
      <ButtonRow>
        <OptionLink to="/flight">Flight Form</OptionLink>
        <OptionLink to="/passenger">Passenger Form</OptionLink>
      </ButtonRow>
    </>
  );
};
