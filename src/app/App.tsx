import { Routes, Route } from "react-router-dom";
import { FlightForm } from "../components/flightForm/FlightForm";
import { PassengerForm } from "../components/passengerForm/PassengerForm";
import { NotFound } from "../components/notFound/NotFound";
import { RootLayout } from "../components/rootLayout/RootLayout";
import { Home } from "../components/home/Home";
import { FlightsList } from "../components/flighList/FlightList";
import { PassengerList } from "../components/passengerList/PassengerList";
import { GlobalStyle } from "./GlobalStyle";

export const App = () => {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="flight" element={<FlightForm />} />
          <Route path="passenger" element={<PassengerForm />} />
          <Route path="flights" element={<FlightsList />} />
          <Route path="passengers" element={<PassengerList />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};
