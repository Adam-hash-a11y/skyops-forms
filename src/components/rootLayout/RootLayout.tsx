import { Outlet } from "react-router-dom";
import { Header } from "../header/Header";
import styled from "styled-components";

const RootWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

export const RootLayout = () => {
  return (
    <RootWrapper>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
    </RootWrapper>
  );
};
