import { Routes, Route } from "react-router-dom";
import { FlightForm } from "../components/flightForm/FlightForm";
import { Counter } from "../components/counter/counter";
import { PassengerForm } from "../components/passengerForm/PassengerForm";
import { NotFound } from "../components/notFound/NotFound";
import { RootLayout } from "../components/rootLayout/RootLayout";
import { Home } from "../components/home/Home";

export const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="flight" element={<FlightForm />} />
        <Route path="counter" element={<Counter />} />
        <Route path="passenger" element={<PassengerForm />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
