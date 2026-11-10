import styled from "styled-components";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { FormType } from "../shared/flightFormModal/types";
import { Button, ButtonVariant } from "../shared/button/Button";
import { FlightStatus } from "../../types/flightTypes";
import { theme } from "../../theme/theme";

interface Props {
  status: FlightStatus | "";
  origin: string;
  destination: string;
  sortBy: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleReset: () => void;
  handleSearch: () => void;
  searchDisabled: boolean;
}

const FilterBar = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing[16]};
  background-color: ${theme.colors.background.paper};
  border: 1px solid ${theme.colors.border.main};
  padding: ${theme.spacing[16]} ${theme.spacing[20]};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing[20]};
`;

const FilterButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing[10]};
  margin-top: ${theme.spacing[20]};
`;

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: FlightStatus.SCHEDULED, label: "Scheduled" },
  { value: FlightStatus.DELAYED, label: "Delayed" },
  { value: FlightStatus.CANCELLED, label: "Cancelled" },
  { value: FlightStatus.LANDED, label: "Landed" },
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
  handleInputChange,
  handleSelectChange,
  handleReset,
  handleSearch,
  searchDisabled,
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
        handleSelectChange={handleSelectChange}
      />
      <FormInput
        id="origin"
        name="origin"
        type={FormType.TEXT}
        label="Origin"
        value={origin}
        placeholder="IATA code, e.g. TUN"
        handleInputChange={handleInputChange}
      />
      <FormInput
        id="destination"
        name="destination"
        type={FormType.TEXT}
        label="Destination"
        value={destination}
        placeholder="IATA code, e.g. FRA"
        handleInputChange={handleInputChange}
      />
      <FormInput
        id="sortBy"
        name="sortBy"
        type={FormType.SELECT}
        label="Sort by"
        value={sortBy}
        options={sortByOptions}
        handleSelectChange={handleSelectChange}
      />
      <FilterButtons>
        <Button
          label="Search"
          handleButton={handleSearch}
          variant={ButtonVariant.PRIMARY}
          disabled={searchDisabled}
        />
        <Button
          label="Reset filters"
          handleButton={handleReset}
          variant={ButtonVariant.FILTER}
        />
      </FilterButtons>
    </FilterBar>
  );
};
