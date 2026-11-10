import styled from "styled-components";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { FormType } from "../shared/flightFormModal/types";
import { Button, ButtonVariant } from "../shared/button/Button";
import { TicketFilterBy } from "../../types/ticketTypes";
import { theme } from "../../theme/theme";

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  filterBy: string;
  filterValue: string;
  filterValueOptions: SelectOption[];
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleReset: () => void;
  handleSearch: () => void;
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

const filterByOptions = [
  { value: "", label: "All tickets" },
  { value: TicketFilterBy.FLIGHT, label: "Flight" },
  { value: TicketFilterBy.PASSENGER, label: "Passenger" },
];

export const TicketFilters: React.FunctionComponent<Props> = ({
  filterBy,
  filterValue,
  filterValueOptions,
  handleSelectChange,
  handleReset,
  handleSearch,
}) => {
  return (
    <FilterBar>
      <FormInput
        id="FilterByFilter"
        name="filterBy"
        type={FormType.SELECT}
        label="Filter by"
        value={filterBy}
        options={filterByOptions}
        handleSelectChange={handleSelectChange}
      />
      {filterBy !== "" && (
        <FormInput
          id="FilterValueFilter"
          name="filterValue"
          type={FormType.SELECT}
          label={filterBy === TicketFilterBy.FLIGHT ? "Flight" : "Passenger"}
          value={filterValue}
          options={filterValueOptions}
          handleSelectChange={handleSelectChange}
        />
      )}
      <FilterButtons>
        <Button
          label="Search"
          handleButton={handleSearch}
          variant={ButtonVariant.PRIMARY}
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
