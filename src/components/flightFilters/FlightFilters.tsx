import styled from "styled-components";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const statusOptions = [
    { value: "", label: t("flightFilters.allStatuses") },
    { value: FlightStatus.SCHEDULED, label: t("status.Scheduled") },
    { value: FlightStatus.DELAYED, label: t("status.Delayed") },
    { value: FlightStatus.CANCELLED, label: t("status.Cancelled") },
    { value: FlightStatus.LANDED, label: t("status.Landed") },
  ];

  const sortByOptions = [
    { value: "", label: t("flightFilters.defaultOrder") },
    { value: "departureTime", label: t("flightFilters.departureTime") },
  ];

  return (
    <FilterBar>
      <FormInput
        id="status"
        name="status"
        type={FormType.SELECT}
        label={t("flightFilters.status")}
        value={status}
        options={statusOptions}
        handleSelectChange={handleSelectChange}
      />
      <FormInput
        id="origin"
        name="origin"
        type={FormType.TEXT}
        label={t("flightFilters.origin")}
        value={origin}
        placeholder={t("flightFilters.originPlaceholder")}
        handleInputChange={handleInputChange}
      />
      <FormInput
        id="destination"
        name="destination"
        type={FormType.TEXT}
        label={t("flightFilters.destination")}
        value={destination}
        placeholder={t("flightFilters.destinationPlaceholder")}
        handleInputChange={handleInputChange}
      />
      <FormInput
        id="sortBy"
        name="sortBy"
        type={FormType.SELECT}
        label={t("flightFilters.sortBy")}
        value={sortBy}
        options={sortByOptions}
        handleSelectChange={handleSelectChange}
      />
      <FilterButtons>
        <Button
          label={t("common.search")}
          handleButton={handleSearch}
          variant={ButtonVariant.PRIMARY}
          disabled={searchDisabled}
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
