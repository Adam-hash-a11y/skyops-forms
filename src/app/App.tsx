import { Routes, Route } from "react-router-dom";
import { FlightForm } from "../components/flightForm/FlightForm";
import { Counter } from "../components/counter/counter";
import { PassengerForm } from "../components/passengerForm/PassengerForm";
import { NotFound } from "../components/notFound/NotFound";
import { RootLayout } from "../components/rootLayout/RootLayout";
import { Home } from "../components/home/Home";
import { FlightsList } from "../components/flighList/FlightList";
import { createGlobalStyle } from "styled-components";
import { PassengerList } from "../components/passengerList/PassengerList";

const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "Inter", system-ui, sans-serif;
    background-color: #f4f3fb;
    color: #1e1b2e;
  }
`;
export const App = () => {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="flight" element={<FlightForm />} />
          <Route path="counter" element={<Counter />} />
          <Route path="passenger" element={<PassengerForm />} />
          <Route path="flights" element={<FlightsList />} />
          <Route path="passengers" element={<PassengerList />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};
