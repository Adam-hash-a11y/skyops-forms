import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FormInput } from "../shared/formInput/FlightFormInput";
import { FormType } from "../shared/flightFormModal/types";
import { Button } from "../shared/button/Button";
import { ButtonVariant } from "../shared/button/Button.types";
import { NATIONALITY_CODES } from "../../constants/nationalities";
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
  const { t } = useTranslation();

  const nationalityOptions = [
    { value: "", label: t("passengerFilters.all") },
    ...NATIONALITY_CODES.map((code) => ({
      value: code,
      label: t("nationality." + code),
    })),
  ];

  const sortByOptions = [
    { value: "", label: t("passengerFilters.defaultOrder") },
    { value: "firstName", label: t("passengerFilters.firstName") },
  ];

  return (
    <FilterBar>
      <FormInput
        id="FirstNameFilter"
        name="firstName"
        type={FormType.TEXT}
        label={t("passengerFilters.firstName")}
        value={firstName}
        placeholder={t("passengerFilters.firstNamePlaceholder")}
        handleInputChange={handleInputChange}
      />
      <FormInput
        id="LastNameFilter"
        name="lastName"
        type={FormType.TEXT}
        label={t("passengerFilters.lastName")}
        value={lastName}
        placeholder={t("passengerFilters.lastNamePlaceholder")}
        handleInputChange={handleInputChange}
      />
      <FormInput
        id="NationalityFilter"
        name="nationality"
        type={FormType.SELECT}
        label={t("passengerFilters.nationality")}
        value={nationality}
        options={nationalityOptions}
        handleSelectChange={handleSelectChange}
      />
      <FormInput
        id="SortByFilter"
        name="sortBy"
        type={FormType.SELECT}
        label={t("passengerFilters.sortBy")}
        value={sortBy}
        options={sortByOptions}
        handleSelectChange={handleSelectChange}
      />
      <FilterButtons>
        <Button
          label={t("common.search")}
          handleButton={handleSearch}
          variant={ButtonVariant.PRIMARY}
        />
        <Button
          label={t("common.resetFilters")}
          handleButton={handleReset}
          variant={ButtonVariant.FILTER}
        />
      </FilterButtons>
    </FilterBar>
  );
};
