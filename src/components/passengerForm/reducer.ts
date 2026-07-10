import validator from "validator";
import { SET_ERROR, SET_FIELD } from "./action";

interface State {
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  errors: {
    firstName: string;
    lastName: string;
    passportNumber: string;
    nationality: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
  };
  disabled: boolean;
}

export const initialState: State = {
  firstName: "",
  lastName: "",
  passportNumber: "",
  nationality: "",
  dateOfBirth: "",
  email: "",
  phoneNumber: "",
  errors: {
    firstName: "",
    lastName: "",
    passportNumber: "",
    nationality: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
  },
  disabled: true,
};

export const passengerReducer = (state: State, action: any) => {
  switch (action.type) {
    case SET_FIELD: {
      const newState = {
        ...state,
        [action.field]: action.value,
      };

      return {
        ...newState,
        disabled:
          newState.firstName.length === 0 ||
          newState.lastName.length === 0 ||
          newState.passportNumber.length === 0 ||
          newState.nationality.length === 0 ||
          newState.dateOfBirth.length === 0 ||
          newState.email.length === 0 ||
          newState.phoneNumber.length === 0,
      };
    }

    case SET_ERROR: {
      const newErrors = { ...state.errors };

      if (state.firstName.length >= 3) {
        newErrors.firstName = "";
      } else {
        newErrors.firstName = "First name must be at least 3 characters";
      }

      if (state.lastName.length >= 3) {
        newErrors.lastName = "";
      } else {
        newErrors.lastName = "Last name must be at least 3 characters";
      }

      if (state.passportNumber.length >= 6) {
        newErrors.passportNumber = "";
      } else {
        newErrors.passportNumber =
          "Passport number must be at least 6 characters";
      }

      if (state.nationality.length > 0) {
        newErrors.nationality = "";
      } else {
        newErrors.nationality = "Nationality is required";
      }

      if (
        validator.isISO8601(state.dateOfBirth) &&
        new Date(state.dateOfBirth) < new Date()
      ) {
        newErrors.dateOfBirth = "";
      } else {
        newErrors.dateOfBirth = "Date of birth must be a valid past date";
      }

      if (validator.isEmail(state.email)) {
        newErrors.email = "";
      } else {
        newErrors.email = "Email must be valid";
      }

      if (state.phoneNumber.length >= 8) {
        newErrors.phoneNumber = "";
      } else {
        newErrors.phoneNumber = "Phone number must be at least 8 characters";
      }

      return {
        ...state,
        errors: newErrors,
      };
    }

    default:
      return state;
  }
};
