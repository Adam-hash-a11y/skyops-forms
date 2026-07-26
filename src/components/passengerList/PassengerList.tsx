import { useState } from "react";
import { passengers, type Passenger } from "../../data/passengerData";

export const PassengerList = () => {
  const [allPassengers, setAllPassengers] = useState<Passenger[]>([
    ...passengers,
  ]);
  const [filter, setFilter] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const displayedPassengers = allPassengers.filter((item) =>
    filter === "" ? true : item.firstName.includes(filter),
  );
  return (
    <>
      <h2>passenger List</h2>
      <pre>State :{JSON.stringify(allPassengers)}</pre>
      <pre>variable : {JSON.stringify(passengers)}</pre>
      <input
        type="text"
        placeholder="filter passenger"
        value={filter}
        onChange={handleChange}
      />
      {displayedPassengers.map((passenger, index) => (
        <div key={index}>
          <p>
            {passenger.firstName} - {passenger.lastName}
          </p>
          <p>{passenger.nationality}</p>
          <p>{passenger.dateOfBirth}</p>
          <p>{passenger.passportNumber}</p>
          <p>{passenger.phoneNumber}</p>
          <p>{passenger.email}</p>
        </div>
      ))}
    </>
  );
};
