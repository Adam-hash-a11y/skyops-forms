import { describe, expect, it } from "vitest";
import {
  hasAtLeastOneSeat,
  isDepartureBeforeArrival,
  isSameOriginDestination,
  isValidAirline,
  isValidArrivalTime,
  isValidDepartureTime,
  isValidDestination,
  isValidFlightNumber,
  isValidOrigin,
  isValidSeatCount,
  isValidStatus,
} from "../../src/validators/flightForm.validator";

describe("flightForm.validator", () => {
  describe("isValidFlightNumber", () => {
    it("should accept SKYOPS- followed by 3 or more digits", () => {
      //ARRANGE
      const threeDigits = "SKYOPS-105";
      const fiveDigits = "SKYOPS-10042";

      //ACT
      const resultThree = isValidFlightNumber(threeDigits);
      const resultFive = isValidFlightNumber(fiveDigits);

      //ASSERT
      expect(resultThree).toBe("");
      expect(resultFive).toBe("");
    });

    it("should return the error when the prefix, the digits or the case are wrong", () => {
      //ARRANGE
      const message = "Flight number must start with SKYOPS-XXX";

      //ACT
      const tooFewDigits = isValidFlightNumber("SKYOPS-10");
      const noPrefix = isValidFlightNumber("105");
      const lowerCase = isValidFlightNumber("skyops-105");
      const empty = isValidFlightNumber("");

      //ASSERT
      expect(tooFewDigits).toBe(message);
      expect(noPrefix).toBe(message);
      expect(lowerCase).toBe(message);
      expect(empty).toBe(message);
    });
  });

  describe("isValidAirline", () => {
    it("should accept an airline with 5 characters and refuse one with 4", () => {
      //ARRANGE
      const fiveChars = "SkyAi";
      const fourChars = "SkyA";

      //ACT
      const resultFive = isValidAirline(fiveChars);
      const resultFour = isValidAirline(fourChars);

      //ASSERT
      expect(resultFive).toBe("");
      expect(resultFour).toBe("Airline must be at least 5 characters");
    });
  });

  describe("isValidOrigin and isValidDestination", () => {
    it("should accept exactly 3 uppercase letters", () => {
      //ARRANGE
      const code = "TUN";

      //ACT
      const origin = isValidOrigin(code);
      const destination = isValidDestination(code);

      //ASSERT
      expect(origin).toBe("");
      expect(destination).toBe("");
    });

    it("should return the error for lowercase, wrong length or digits", () => {
      //ARRANGE
      const originMessage = "Origin must be 3 uppercase letters";
      const destinationMessage = "Destination must be 3 uppercase letters";

      //ACT
      const lowerCase = isValidOrigin("tun");
      const tooShort = isValidOrigin("TU");
      const tooLong = isValidDestination("TUNI");
      const digits = isValidDestination("T1N");

      //ASSERT
      expect(lowerCase).toBe(originMessage);
      expect(tooShort).toBe(originMessage);
      expect(tooLong).toBe(destinationMessage);
      expect(digits).toBe(destinationMessage);
    });
  });

  describe("isSameOriginDestination", () => {
    it("should be true when both are the same valid code", () => {
      //ARRANGE
      const origin = "TUN";
      const destination = "TUN";

      //ACT
      const result = isSameOriginDestination(origin, destination);

      //ASSERT
      expect(result).toBe(true);
    });

    it("should be false when the codes are different", () => {
      //ARRANGE
      const origin = "TUN";
      const destination = "FRA";

      //ACT
      const result = isSameOriginDestination(origin, destination);

      //ASSERT
      expect(result).toBe(false);
    });

    it("should be false while the codes are still incomplete or lowercase", () => {
      //ARRANGE
      const incomplete = isSameOriginDestination("TU", "TU");
      const lowerCase = isSameOriginDestination("tun", "tun");

      //ACT
      const empty = isSameOriginDestination("", "");

      //ASSERT
      expect(incomplete).toBe(false);
      expect(lowerCase).toBe(false);
      expect(empty).toBe(false);
    });
  });

  describe("isValidStatus", () => {
    it("should refuse an empty status and accept a chosen one", () => {
      //ARRANGE
      const empty = "";
      const chosen = "Scheduled";

      //ACT
      const resultEmpty = isValidStatus(empty);
      const resultChosen = isValidStatus(chosen);

      //ASSERT
      expect(resultEmpty).toBe("Status is required");
      expect(resultChosen).toBe("");
    });
  });

  describe("isValidDepartureTime and isValidArrivalTime", () => {
    it("should accept a valid ISO date", () => {
      //ARRANGE
      const value = "2026-06-01T08:00";

      //ACT
      const departure = isValidDepartureTime(value);
      const arrival = isValidArrivalTime(value);

      //ASSERT
      expect(departure).toBe("");
      expect(arrival).toBe("");
    });

    it("should return the error for empty text and for text that is not a date", () => {
      //ARRANGE
      const departureMessage = "departure time must be a valid date";
      const arrivalMessage = "arrival time must be a valid date";

      //ACT
      const departureEmpty = isValidDepartureTime("");
      const departureText = isValidDepartureTime("tomorrow");
      const arrivalEmpty = isValidArrivalTime("");
      const arrivalText = isValidArrivalTime("tomorrow");

      //ASSERT
      expect(departureEmpty).toBe(departureMessage);
      expect(departureText).toBe(departureMessage);
      expect(arrivalEmpty).toBe(arrivalMessage);
      expect(arrivalText).toBe(arrivalMessage);
    });
  });

  describe("isDepartureBeforeArrival", () => {
    it("should be true when departure is before arrival", () => {
      //ARRANGE
      const departure = "2026-06-01T08:00";
      const arrival = "2026-06-01T10:00";

      //ACT
      const result = isDepartureBeforeArrival(departure, arrival);

      //ASSERT
      expect(result).toBe(true);
    });

    it("should be false when departure is after or equal to arrival", () => {
      //ARRANGE
      const departure = "2026-06-01T10:00";
      const earlier = "2026-06-01T08:00";

      //ACT
      const after = isDepartureBeforeArrival(departure, earlier);
      const equal = isDepartureBeforeArrival(departure, departure);

      //ASSERT
      expect(after).toBe(false);
      expect(equal).toBe(false);
    });

    it("should be false when one of the dates is empty or invalid", () => {
      //ARRANGE
      const valid = "2026-06-01T08:00";

      //ACT
      const emptyDeparture = isDepartureBeforeArrival("", valid);
      const invalidArrival = isDepartureBeforeArrival(valid, "tomorrow");

      //ASSERT
      expect(emptyDeparture).toBe(false);
      expect(invalidArrival).toBe(false);
    });
  });

  describe("isValidSeatCount", () => {
    it("should accept 0 and whole positive numbers", () => {
      //ARRANGE
      const zero = 0;
      const positive = 150;

      //ACT
      const resultZero = isValidSeatCount(zero);
      const resultPositive = isValidSeatCount(positive);

      //ASSERT
      expect(resultZero).toBe("");
      expect(resultPositive).toBe("");
    });

    it("should return the error for negative, decimal and NaN values", () => {
      //ARRANGE
      const message = "Seats must be a postive number bigger than 0";

      //ACT
      const negative = isValidSeatCount(-1);
      const decimal = isValidSeatCount(2.5);
      const notANumber = isValidSeatCount(NaN);

      //ASSERT
      expect(negative).toBe(message);
      expect(decimal).toBe(message);
      expect(notANumber).toBe(message);
    });
  });

  describe("hasAtLeastOneSeat", () => {
    it("should be true when at least one class has a seat", () => {
      //ARRANGE
      const first = 0;
      const business = 0;
      const economy = 1;

      //ACT
      const result = hasAtLeastOneSeat(first, business, economy);

      //ASSERT
      expect(result).toBe(true);
    });

    it("should be false when all three classes have zero seats", () => {
      //ARRANGE
      const seats = 0;

      //ACT
      const result = hasAtLeastOneSeat(seats, seats, seats);

      //ASSERT
      expect(result).toBe(false);
    });
  });
});
