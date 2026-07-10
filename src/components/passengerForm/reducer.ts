import validator from "validator";
import { SET_FIELD_PASSENGER, SET_PASSENGER_ERROR } from "./action";

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
  isDisabled: boolean;
}

export const intialstatePassenger: State = {
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
  isDisabled: true,
};

export const PassengerReducer = (state: State, action: any) => {
  switch (action.type) {
    case SET_FIELD_PASSENGER: {
      //   const isDisabledbtn =
      //     state.firstName.length === 0 ||
      //     state.lastName.length === 0 ||
      //     state.passportNumber.length === 0 ||
      //     state.dateOfBirth.length === 0 ||
      //     state.nationality.length === 0 ||
      //     state.phoneNumber.length === 0;
      // this works with the old state not one passed inside the action
      //"I compute the next state first, validate against that, and return it — instead of validating against stale state."
      //   return {
      //     ...state,
      //     isDisabled: isDisabledbtn,
      //     [action.payload.name]: action.payload.value,
      //   };
      const newState = {
        ...state,
        [action.payload.name]: action.payload.value,
      };

      const isDisabledbtn =
        newState.firstName.length === 0 ||
        newState.lastName.length === 0 ||
        newState.passportNumber.length === 0 ||
        newState.dateOfBirth.length === 0 ||
        newState.nationality.length === 0 ||
        newState.phoneNumber.length === 0;

      return {
        ...newState,
        isDisabled: isDisabledbtn,
      };
    }

    case SET_PASSENGER_ERROR: {
      const newErrors = { ...state.errors };
      if (state.firstName.length >= 3) {
        newErrors.firstName = "";
      } else {
        newErrors.firstName = "firstname must be at least 3 charachters";
      }
      if (state.lastName.length >= 3) {
        newErrors.lastName = "";
      } else {
        newErrors.lastName = "lastName must be at least 3 charachters";
      }
      if (state.passportNumber.length >= 6) {
        newErrors.passportNumber = "";
      } else {
        newErrors.passportNumber = "passport  must be at least 3 charachters";
      }
      if (
        state.nationality.length === 2 &&
        state.nationality === state.nationality.toUpperCase()
      ) {
        newErrors.nationality = "";
      } else {
        newErrors.nationality = "Nationality must be 2 Letter and in caps lad";
      }
      if (validator.isISO8601(state.dateOfBirth)) {
        newErrors.dateOfBirth = "";
      } else {
        newErrors.dateOfBirth = "must be valid date";
      }
      if (validator.isEmail(state.email)) {
        newErrors.email = "";
      } else {
        newErrors.email = "must be a valid email";
      }
      if (
        Number.isInteger(Number(state.phoneNumber)) &&
        state.phoneNumber.length >= 8
      ) {
        newErrors.phoneNumber = "";
      } else {
        newErrors.phoneNumber = "must be a valid phoneNumber";
      }

      return { ...state, errors: newErrors };
    }

    default:
      return state;
  }
};
