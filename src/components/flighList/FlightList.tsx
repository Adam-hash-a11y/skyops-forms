import styled from "styled-components";
import type { Flight } from "../../data/flightData";
import { Button, ButtonVariant } from "../shared/button/Button";
import { useEffect, useState } from "react";
import { DeleteModal } from "../shared/deleteModal/DeleteModal";
import { EditModal } from "../shared/editModal/EditModal";
import { FaPen, FaTrash } from "react-icons/fa6";
import {
  deleteFlight,
  getFlights,
  updateFlight,
} from "../../service/flightService";

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Card = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background: white;
`;

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
`;

const FlightHeader = styled.p`
  font-weight: 700;
  margin: 0;
`;

const Route = styled.p`
  color: #475569;
  margin: 0 0 6px 0;
`;

const Meta = styled.p`
  color: #64748b;
  font-size: 13px;
  margin: 0;
`;

export const FlightsList = () => {
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filter, setFilter] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const flights = await getFlights();
        setAllFlights(flights);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFlights();
  }, []);

  const handleModalOpen = (index: number) => {
    setOpenIndex(index);
  };

  const handleModalClose = () => {
    setOpenIndex(null);
  };

  const handleEditOpen = (index: number) => {
    setEditIndex(index);
  };

  const handleEditClose = () => {
    setEditIndex(null);
  };

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const displayedFlights = allFlights.filter((item) =>
    filter === "" ? true : item.flightNumber.includes(filter),
  );

  const handleDelete = async (flightNumber: string) => {
    try {
      console.log("Deleting flight:", flightNumber);
      await deleteFlight(flightNumber);
      setAllFlights((prev) =>
        prev.filter((flight) => flight.flightNumber !== flightNumber),
      );
      setOpenIndex(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (updatedFlight: Flight) => {
    try {
      await updateFlight(
        updatedFlight.flightNumber,
        updatedFlight.airline,
        updatedFlight.origin,
        updatedFlight.destination,
        updatedFlight.departureTime,
        updatedFlight.arrivalTime,
        updatedFlight.status,
        String(updatedFlight.totalSeats),
        String(updatedFlight.bookedSeats),
      );
      setAllFlights((prev) =>
        prev.map((flight) =>
          flight.flightNumber === updatedFlight.flightNumber
            ? updatedFlight
            : flight,
        ),
      );
      setEditIndex(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Title>Flights List</Title>

      <label htmlFor="filterInput">Filter</label>
      <input
        id="filterInput"
        type="text"
        placeholder="filter by"
        value={filter}
        onChange={handleChangeFilter}
      />

      {displayedFlights.map((flight, index) => {
        const currentIndex = allFlights.indexOf(flight);

        return (
          <Card key={flight.flightNumber}>
            <CardTopRow>
              <FlightHeader>
                {flight.flightNumber} — {flight.airline}
              </FlightHeader>

              <div>
                <Button
                  handleButton={() => handleEditOpen(index)}
                  label="Edit"
                  variant={ButtonVariant.PRIMARY}
                >
                  <FaPen />
                </Button>

                <Button
                  handleButton={() => handleModalOpen(index)}
                  label="Delete"
                  variant={ButtonVariant.DANGER}
                >
                  <FaTrash />
                </Button>
              </div>
            </CardTopRow>

            <Route>
              {flight.origin} → {flight.destination}
            </Route>

            <Meta>Status: {flight.status}</Meta>

            <Meta>
              Seats: {flight.bookedSeats}/{flight.totalSeats}
            </Meta>

            {openIndex === index && (
              <DeleteModal
                itemKey={currentIndex}
                label="Flight"
                isOpen={true}
                handleClose={handleModalClose}
                handleDelete={() => handleDelete(flight.flightNumber)}
              />
            )}

            {editIndex === index && (
              <EditModal
                isOpen={true}
                flight={flight}
                handleClose={handleEditClose}
                handleSave={handleUpdate}
              />
            )}
          </Card>
        );
      })}
    </>
  );
};