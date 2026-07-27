import {
  RESET_PASSENGER,
  SET_FIELD,
  SUMBIT_PASSENGER,
  type Action,
} from "./action";
import { passengers } from "../../data/passengerData";
import {
  isValidDateOfBirth,
  isValidEmail,
  isValidFirstname,
  isValidLastName,
  isValidNationality,
  isValidPassportNumber,
  isValidPhoneNumber,
} from "../../validators/passengerForm.validator";

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

export const passengerReducer = (state: State, action: Action) => {
  switch (action.type) {
    case SET_FIELD: {
      const newState = {
        ...state,
        [action.field]: action.value,
      };

      const newErrors = { ...newState.errors };

      newErrors.firstName = isValidFirstname(newState.firstName);
      newErrors.lastName = isValidLastName(newState.lastName);
      newErrors.email = isValidEmail(newState.email);
      newErrors.dateOfBirth = isValidDateOfBirth(newState.dateOfBirth);
      newErrors.nationality = isValidNationality(newState.nationality);
      newErrors.passportNumber = isValidPassportNumber(newState.passportNumber);
      newErrors.phoneNumber = isValidPhoneNumber(newState.phoneNumber);
      return {
        ...newState,
        disabled:
          newErrors.firstName !== "" ||
          newErrors.lastName !== "" ||
          newErrors.passportNumber !== "" ||
          newErrors.nationality !== "" ||
          newErrors.dateOfBirth !== "" ||
          newErrors.email !== "" ||
          newErrors.phoneNumber !== "",
        errors: newErrors,
      };
    }

    case SUMBIT_PASSENGER: {
      passengers.push({
        firstName: state.firstName,
        lastName: state.lastName,
        passportNumber: state.passportNumber,
        email: state.email,
        nationality: state.nationality,
        dateOfBirth: state.dateOfBirth,
        phoneNumber: state.phoneNumber,
      });

      return initialState;
    }

    case RESET_PASSENGER: {
      return initialState;
    }

    default:
      return state;
  }
};
