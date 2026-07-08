import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";

const Main = styled.main`
  min-height: 70vh;
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

export const RootLayout = () => {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </>
  );
};
