import validator from "validator";

export const isValidFirstname = (value: string) => {
  if (value.length >= 3) {
    return "";
  } else {
    return "First name must be at least 3 characters";
  }
};

export const isValidLastName = (value: string) => {
  if (value.length >= 3) {
    return "";
  } else {
    return "Last name must be at least 3 characters";
  }
};

export const isValidPassportNumber = (value: string) => {
  if (value.length >= 6) {
    return "";
  } else {
    return "Passport number must be at least 6 characters";
  }
};
export const isValidNationality = (value: string) => {
  if (value.length > 0) {
    return "";
  } else {
    return "Nationality is required";
  }
};

export const isValidDateOfBirth = (value: string) => {
  if (validator.isISO8601(value) && new Date(value) < new Date()) {
    return "";
  } else {
    return "Date of birth must be a valid past date";
  }
};

export const isValidEmail = (value: string) => {
  if (validator.isEmail(value)) {
    return "";
  } else {
    return "Email must be valid";
  }
};

export const isValidPhoneNumber = (value: string) => {
  if (value.length >= 8) {
    return "";
  } else {
    return "Phone number must be at least 8 characters";
  }
};
