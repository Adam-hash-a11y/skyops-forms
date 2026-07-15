import { Route, Routes } from "react-router-dom";
import { PassengerForm } from "../components/passengerForm/PassengerForm";
import { FlightList } from "../components/flightList/FlightList";
import { FlightForm } from "../components/flightForm/FlightForm";
import { NotFound } from "../components/notFound/NotFound";
import { RootLayout } from "../components/rootLayout/RootLayout";
import { Home } from "../components/home/Home";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
`;
export const App = () => {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/flight" element={<FlightForm />} />
          <Route path="/passenger" element={<PassengerForm />} />
          <Route path="/flightlist" element={<FlightList />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};
