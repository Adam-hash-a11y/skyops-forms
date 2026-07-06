import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { FlightForm } from "./components/flightForm/FlightForm.tsx";
import { PassengerForm } from "./components/passengerForm/PassengerForm.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NotFound } from "./components/notFound/NotFound.tsx";
import { Counter } from "./components/counter/counter.tsx";

const router = createBrowserRouter([
  { path: "/flight", element: <FlightForm /> },
  { path: "/counter", element: <Counter /> },
  { path: "/passenger", element: <PassengerForm /> },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
