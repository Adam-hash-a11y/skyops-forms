import { Routes, Route } from "react-router-dom";
import { NotFound } from "../components/notFound/NotFound";
import { RootLayout } from "../components/rootLayout/RootLayout";
import { FlightsList } from "../components/flighList/FlightList";
import { PassengerList } from "../components/passengerList/PassengerList";
import { GlobalStyle } from "./GlobalStyle";
import { TicketList } from "../components/ticketList/TicketList";

export const App = () => {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="flights" element={<FlightsList />} />
          <Route path="passengers" element={<PassengerList />} />
          <Route path="tickets" element={<TicketList />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};
