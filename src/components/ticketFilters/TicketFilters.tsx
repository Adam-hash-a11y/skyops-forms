import styled from "styled-components";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { FormType } from "../shared/flightFormModal/types";
import { Button, ButtonVariant } from "../shared/button/Button";

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
  gap: 16px;
  background-color: #ffffff;
  border: 1px solid #dce2eb;
  padding: 16px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const FilterButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 20px;
`;

const filterByOptions = [
  { value: "", label: "All tickets" },
  { value: "flight", label: "Flight" },
  { value: "passenger", label: "Passenger" },
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
          label={filterBy === "flight" ? "Flight" : "Passenger"}
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
