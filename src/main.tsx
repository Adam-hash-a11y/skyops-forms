import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { FlightForm } from "./components/flightForm/FlightForm.tsx";
import { PassengerForm } from "./components/passengerForm/PassengerForm .tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NotFound } from "./components/notFound/NotFound.tsx";

const router = createBrowserRouter([
  { path: "/flight", element: <FlightForm /> },
  { path: "/passenger", element: <PassengerForm /> },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
