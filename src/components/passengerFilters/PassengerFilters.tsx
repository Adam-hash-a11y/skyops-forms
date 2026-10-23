import styled from "styled-components";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { FormType } from "../shared/flightFormModal/types";
import { Button, ButtonVariant } from "../shared/button/Button";

interface Props {
  firstName: string;
  lastName: string;
  nationality: string;
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

const nationalityOptions = [
  { value: "", label: "All" },
  { value: "TN", label: "Tunisian" },
  { value: "FR", label: "French" },
  { value: "DE", label: "German" },
  { value: "US", label: "American" },
  { value: "GB", label: "British" },
  { value: "IT", label: "Italian" },
  { value: "ES", label: "Spanish" },
  { value: "CA", label: "Canadian" },
  { value: "MA", label: "Moroccan" },
];

const sortByOptions = [
  { value: "", label: "Default order" },
  { value: "firstName", label: "First name" },
];

export const PassengerFilters: React.FunctionComponent<Props> = ({
  firstName,
  lastName,
  nationality,
  sortBy,
  handleChange,
  handleReset,
}) => {
  return (
    <FilterBar>
      <FormInput
        id="FirstNameFilter"
        name="firstName"
        type={FormType.TEXT}
        label="First name"
        value={firstName}
        placeholder="e.g. Lena"
        handleChange={handleChange}
      />
      <FormInput
        id="LastNameFilter"
        name="lastName"
        type={FormType.TEXT}
        label="Last name"
        value={lastName}
        placeholder="e.g. Fischer"
        handleChange={handleChange}
      />
      <FormInput
        id="NationalityFilter"
        name="nationality"
        type={FormType.SELECT}
        label="Nationality"
        value={nationality}
        options={nationalityOptions}
        handleChange={handleChange}
      />
      <FormInput
        id="SortByFilter"
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
