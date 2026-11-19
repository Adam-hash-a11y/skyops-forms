import { describe, expect, it } from "vitest";
import {
  initialState,
  passengerReducer,
} from "../../src/components/shared/passengerFormModal/reducer";
import { PassengerFormActionType } from "../../src/components/shared/passengerFormModal/action";

const validState = {
  ...initialState,
  firstName: "Lena",
  lastName: "Banks",
  passportNumber: "DE7731902",
  nationality: "DE",
  dateOfBirth: "1992-11-02",
  email: "name@example.com",
  phoneNumber: "+4915194300275",
};

describe("passengerReducer", () => {
  describe("initial state", () => {
    it("should start with empty fields, no errors, nothing touched and the button disabled", () => {
      //ARRANGE
      const state = initialState;

      //ASSERT
      expect(state.firstName).toBe("");
      expect(state.email).toBe("");
      expect(state.errors.firstName).toBe("");
      expect(state.touched.firstName).toBe(false);
      expect(state.disabled).toBe(true);
    });
  });

  describe("SET_FIELD", () => {
    it("should store the typed value in the right field", () => {
      //ARRANGE
      const action = {
        type: PassengerFormActionType.SET_FIELD,
        field: "firstName",
        value: "Lena",
      } as const;

      //ACT
      const result = passengerReducer(initialState, action);

      //ASSERT
      expect(result.firstName).toBe("Lena");
    });

    it("should not mark the field as touched while the user is typing", () => {
      //ARRANGE
      const action = {
        type: PassengerFormActionType.SET_FIELD,
        field: "firstName",
        value: "Le",
      } as const;

      //ACT
      const result = passengerReducer(initialState, action);

      //ASSERT
      expect(result.touched.firstName).toBe(false);
    });

    it("should enable the button and give no errors when the whole form is valid", () => {
      //ARRANGE
      const action = {
        type: PassengerFormActionType.SET_FIELD,
        field: "firstName",
        value: "Lena",
      } as const;

      //ACT
      const result = passengerReducer(validState, action);

      //ASSERT
      expect(result.disabled).toBe(false);
      expect(result.errors.firstName).toBe("");
      expect(result.errors.lastName).toBe("");
      expect(result.errors.passportNumber).toBe("");
      expect(result.errors.nationality).toBe("");
      expect(result.errors.dateOfBirth).toBe("");
      expect(result.errors.email).toBe("");
      expect(result.errors.phoneNumber).toBe("");
    });

    it("should show the first name error and disable the button when the first name is too short", () => {
      //ARRANGE
      const action = {
        type: PassengerFormActionType.SET_FIELD,
        field: "firstName",
        value: "Le",
      } as const;

      //ACT
      const result = passengerReducer(validState, action);

      //ASSERT
      expect(result.errors.firstName).toBe(
        "First name must be at least 3 characters",
      );
      expect(result.disabled).toBe(true);
    });

    it("should show the nationality error and disable the button when no nationality is selected", () => {
      //ARRANGE
      const action = {
        type: PassengerFormActionType.SET_FIELD,
        field: "nationality",
        value: "",
      } as const;

      //ACT
      const result = passengerReducer(validState, action);

      //ASSERT
      expect(result.errors.nationality).toBe("Nationality is required");
      expect(result.disabled).toBe(true);
    });

    it("should show the age error and disable the button when the passenger is under 18", () => {
      //ARRANGE
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
      const action = {
        type: PassengerFormActionType.SET_FIELD,
        field: "dateOfBirth",
        value: tenYearsAgo.toISOString().slice(0, 10),
      } as const;

      //ACT
      const result = passengerReducer(validState, action);

      //ASSERT
      expect(result.errors.dateOfBirth).toBe(
        "You must be at least 18 years old",
      );
      expect(result.disabled).toBe(true);
    });

    it("should show the email error and disable the button when the email is not valid", () => {
      //ARRANGE
      const action = {
        type: PassengerFormActionType.SET_FIELD,
        field: "email",
        value: "lena.example.com",
      } as const;

      //ACT
      const result = passengerReducer(validState, action);

      //ASSERT
      expect(result.errors.email).toBe("Email must be valid");
      expect(result.disabled).toBe(true);
    });

    it("should show the phone error and disable the button when the phone number is too short", () => {
      //ARRANGE
      const action = {
        type: PassengerFormActionType.SET_FIELD,
        field: "phoneNumber",
        value: "1234567",
      } as const;

      //ACT
      const result = passengerReducer(validState, action);

      //ASSERT
      expect(result.errors.phoneNumber).toBe(
        "Phone number must be at least 8 characters",
      );
      expect(result.disabled).toBe(true);
    });
  });

  describe("SET_PASSENGER_TOUCHED", () => {
    it("should mark only that field as touched and show its error", () => {
      //ARRANGE
      const action = {
        type: PassengerFormActionType.SET_PASSENGER_TOUCHED,
        field: "firstName",
      } as const;

      //ACT
      const result = passengerReducer(initialState, action);

      //ASSERT
      expect(result.touched.firstName).toBe(true);
      expect(result.touched.lastName).toBe(false);
      expect(result.errors.firstName).toBe(
        "First name must be at least 3 characters",
      );
      expect(result.errors.lastName).toBe("");
    });

    it("should mark the field as touched and keep its error empty when the value is valid", () => {
      //ARRANGE
      const action = {
        type: PassengerFormActionType.SET_PASSENGER_TOUCHED,
        field: "email",
      } as const;

      //ACT
      const result = passengerReducer(validState, action);

      //ASSERT
      expect(result.touched.email).toBe(true);
      expect(result.errors.email).toBe("");
    });
  });

  describe("RESET_PASSENGER", () => {
    it("should give back the initial state", () => {
      //ARRANGE
      const action = {
        type: PassengerFormActionType.RESET_PASSENGER,
      } as const;

      //ACT
      const result = passengerReducer(validState, action);

      //ASSERT
      expect(result).toEqual(initialState);
    });
  });
});
