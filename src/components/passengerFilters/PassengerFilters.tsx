import styled from "styled-components";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { FormType } from "../shared/flightFormModal/types";
import { Button, ButtonVariant } from "../shared/button/Button";
import { theme } from "../../theme/theme";

interface Props {
  firstName: string;
  lastName: string;
  nationality: string;
  sortBy: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  handleInputChange,
  handleSelectChange,
  handleReset,
  handleSearch,
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
        handleInputChange={handleInputChange}
      />
      <FormInput
        id="LastNameFilter"
        name="lastName"
        type={FormType.TEXT}
        label="Last name"
        value={lastName}
        placeholder="e.g. Fischer"
        handleInputChange={handleInputChange}
      />
      <FormInput
        id="NationalityFilter"
        name="nationality"
        type={FormType.SELECT}
        label="Nationality"
        value={nationality}
        options={nationalityOptions}
        handleSelectChange={handleSelectChange}
      />
      <FormInput
        id="SortByFilter"
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
