import validator from "validator";
import i18n from "../i18n/i18n";

export const isValidFirstname = (value: string): string =>
  value.length >= 3 ? "" : i18n.t("validation.passenger.firstName");

export const isValidLastName = (value: string): string =>
  value.length >= 3 ? "" : i18n.t("validation.passenger.lastName");

export const isValidPassportNumber = (value: string): string =>
  value.length >= 6 ? "" : i18n.t("validation.passenger.passportNumber");

export const isValidNationality = (value: string): string =>
  value.length > 0 ? "" : i18n.t("validation.passenger.nationality");

export const isValidDateOfBirth = (value: string): string => {
  if (!validator.isISO8601(value)) {
    return i18n.t("validation.passenger.dateOfBirthInvalid");
  }

  const date = new Date(value);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 18);

  return date <= minDate
    ? ""
    : i18n.t("validation.passenger.dateOfBirthUnderage");
};

export const isValidEmail = (value: string): string =>
  validator.isEmail(value) ? "" : i18n.t("validation.passenger.email");

export const isValidPhoneNumber = (value: string): string =>
  value.length >= 8 ? "" : i18n.t("validation.passenger.phoneNumber");
