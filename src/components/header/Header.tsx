import styled from "styled-components";

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  padding: 0.75rem 2rem;
  background-color: #0f172a;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
`;

export const Header = () => {
  return (
    <HeaderWrapper>
      <Title>Welcome to SkyOps</Title>
    </HeaderWrapper>
  );
};
