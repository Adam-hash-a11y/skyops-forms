import { describe, expect, it } from "vitest";
import {
  mapPassengerFromApi,
  mapPassengerToApi,
  mapPassengerUpdateToApi,
} from "../../src/mappers/passengerMapper";

const apiPassenger = {
  _id: "p123",
  firstName: "Adam",
  lastName: "Ben Ali",
  passportNumber: "X123456",
  nationality: "TN",
  dateOfBirth: "1990-03-15T00:00:00.000Z",
  email: "adam@example.com",
  phoneNumber: "21234567",
};

describe("passengerMapper", () => {
  describe("mapPassengerFromApi", () => {
    it("should turn _id into id and copy the other fields", () => {
      //ARRANGE
      const passenger = apiPassenger;

      //ACT
      const result = mapPassengerFromApi(passenger);

      //ASSERT
      expect(result).toEqual({
        id: "p123",
        firstName: "Adam",
        lastName: "Ben Ali",
        passportNumber: "X123456",
        nationality: "TN",
        dateOfBirth: "1990-03-15",
        email: "adam@example.com",
        phoneNumber: "21234567",
      });
    });

    it("should cut the date of birth to 10 characters", () => {
      //ARRANGE
      const passenger = apiPassenger;

      //ACT
      const result = mapPassengerFromApi(passenger);

      //ASSERT
      expect(result.dateOfBirth).toBe("1990-03-15");
    });
  });

  describe("mapPassengerToApi and mapPassengerUpdateToApi", () => {
    it("should include the passport number when creating and leave it out when updating", () => {
      //ARRANGE
      const firstName = "Adam";
      const lastName = "Ben Ali";

      //ACT
      const created = mapPassengerToApi(
        firstName,
        lastName,
        "X123456",
        "TN",
        "1990-03-15",
        "adam@example.com",
        "21234567",
      );
      const updated = mapPassengerUpdateToApi(
        firstName,
        lastName,
        "TN",
        "1990-03-15",
        "adam@example.com",
        "21234567",
      );

      //ASSERT
      expect(created).toEqual({
        firstName: "Adam",
        lastName: "Ben Ali",
        passportNumber: "X123456",
        nationality: "TN",
        dateOfBirth: "1990-03-15",
        email: "adam@example.com",
        phoneNumber: "21234567",
      });
      expect(updated).toEqual({
        firstName: "Adam",
        lastName: "Ben Ali",
        nationality: "TN",
        dateOfBirth: "1990-03-15",
        email: "adam@example.com",
        phoneNumber: "21234567",
      });
    });
  });
});
