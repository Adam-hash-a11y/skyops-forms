import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { NotFound } from "../components/notFound/NotFound";
import { RootLayout } from "../components/rootLayout/RootLayout";
import { FlightsList } from "../components/flighList/FlightList";
import { PassengerList } from "../components/passengerList/PassengerList";
import { GlobalStyle } from "./GlobalStyle";
import { TicketList } from "../components/ticketList/TicketList";
import { FlightDetailsPage } from "../components/flightDetailsPage/FlightDetailsPage";
import { PassengerDetailsPage } from "../components/passengerDetailsPage/PassengerDetailsPage";
import { loginToApi } from "../service/axios";

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    void loginToApi().then(() => setIsLoggedIn(true));
  }, []);

  if (!isLoggedIn) return <p>Connecting...</p>;

  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="flights" element={<FlightsList />} />
          <Route path="flights/:flightNumber" element={<FlightDetailsPage />} />
          <Route path="passengers" element={<PassengerList />} />
          <Route
            path="passengers/:passportNumber"
            element={<PassengerDetailsPage />}
          />
          <Route path="tickets" element={<TicketList />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};
