import styled from "styled-components";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { FormType } from "../shared/flightFormModal/types";
import { Button, ButtonVariant } from "../shared/button/Button";

interface Props {
  status: string;
  origin: string;
  destination: string;
  sortBy: string;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  handleReset: () => void;
}

const FilterBar = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  background-color: #ffffff;
  border: 1px solid #dce2eb;
  padding: 16px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const ResetFilters = styled.div`
  margin-top: 20px;
`;

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "Scheduled", label: "Scheduled" },
  { value: "Delayed", label: "Delayed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Landed", label: "Landed" },
];

const sortByOptions = [
  { value: "", label: "Default order" },
  { value: "departureTime", label: "Departure time" },
];

export const FlightFilters: React.FunctionComponent<Props> = ({
  status,
  origin,
  destination,
  sortBy,
  handleChange,
  handleReset,
}) => {
  return (
    <FilterBar>
      <FormInput
        id="status"
        name="status"
        type={FormType.SELECT}
        label="Status"
        value={status}
        options={statusOptions}
        handleChange={handleChange}
      />
      <FormInput
        id="origin"
        name="origin"
        type={FormType.TEXT}
        label="Origin"
        value={origin}
        placeholder="IATA code, e.g. TUN"
        handleChange={handleChange}
      />
      <FormInput
        id="destination"
        name="destination"
        type={FormType.TEXT}
        label="Destination"
        value={destination}
        placeholder="IATA code, e.g. FRA"
        handleChange={handleChange}
      />
      <FormInput
        id="sortBy"
        name="sortBy"
        type={FormType.SELECT}
        label="Sort by"
        value={sortBy}
        options={sortByOptions}
        handleChange={handleChange}
      />
      <ResetFilters>
        <Button
          label="Reset filters"
          handleButton={handleReset}
          variant={ButtonVariant.FILTER}
        />
      </ResetFilters>
    </FilterBar>
  );
};
