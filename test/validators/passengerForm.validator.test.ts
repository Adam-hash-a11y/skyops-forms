import { describe, expect, it } from "vitest";
import {
  isValidDateOfBirth,
  isValidEmail,
  isValidFirstname,
  isValidLastName,
  isValidNationality,
  isValidPassportNumber,
  isValidPhoneNumber,
} from "../../src/validators/passengerForm.validator";

describe("passengerForm.validator", () => {
  describe("isValidFirstname and isValidLastName", () => {
    it("should accept names with 3 characters and refuse names with 2", () => {
      //ARRANGE
      const threeChars = "Ali";
      const twoChars = "Al";

      //ACT
      const firstOk = isValidFirstname(threeChars);
      const firstBad = isValidFirstname(twoChars);
      const lastOk = isValidLastName(threeChars);
      const lastBad = isValidLastName(twoChars);

      //ASSERT
      expect(firstOk).toBe("");
      expect(firstBad).toBe("First name must be at least 3 characters");
      expect(lastOk).toBe("");
      expect(lastBad).toBe("Last name must be at least 3 characters");
    });
  });

  describe("isValidPassportNumber", () => {
    it("should accept 6 characters and refuse 5", () => {
      //ARRANGE
      const sixChars = "X12345";
      const fiveChars = "X1234";

      //ACT
      const ok = isValidPassportNumber(sixChars);
      const bad = isValidPassportNumber(fiveChars);

      //ASSERT
      expect(ok).toBe("");
      expect(bad).toBe("Passport number must be at least 6 characters");
    });
  });

  describe("isValidNationality", () => {
    it("should refuse an empty nationality and accept a chosen one", () => {
      //ARRANGE
      const empty = "";
      const chosen = "TN";

      //ACT
      const resultEmpty = isValidNationality(empty);
      const resultChosen = isValidNationality(chosen);

      //ASSERT
      expect(resultEmpty).toBe("Nationality is required");
      expect(resultChosen).toBe("");
    });
  });

  describe("isValidDateOfBirth", () => {
    it("should accept an adult", () => {
      //ARRANGE
      const adult = "1990-03-15";

      //ACT
      const result = isValidDateOfBirth(adult);

      //ASSERT
      expect(result).toBe("");
    });

    it("should refuse a child", () => {
      //ARRANGE
      const child = "2020-01-01";

      //ACT
      const result = isValidDateOfBirth(child);

      //ASSERT
      expect(result).toBe("You must be at least 18 years old");
    });

    it("should accept a passenger who turns 18 today", () => {
      //ARRANGE
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      const birthday = eighteenYearsAgo.toISOString();

      //ACT
      const result = isValidDateOfBirth(birthday);

      //ASSERT
      expect(result).toBe("");
    });

    it("should refuse a passenger who turns 18 tomorrow", () => {
      //ARRANGE
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      const tomorrow = new Date(eighteenYearsAgo);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const birthday = tomorrow.toISOString();

      //ACT
      const result = isValidDateOfBirth(birthday);

      //ASSERT
      expect(result).toBe("You must be at least 18 years old");
    });

    it("should return the invalid date error for empty text and text that is not a date", () => {
      //ARRANGE
      const message = "Date of birth must be a valid date";

      //ACT
      const empty = isValidDateOfBirth("");
      const text = isValidDateOfBirth("yesterday");

      //ASSERT
      expect(empty).toBe(message);
      expect(text).toBe(message);
    });
  });

  describe("isValidEmail", () => {
    it("should accept a valid email", () => {
      //ARRANGE
      const email = "adam@example.com";

      //ACT
      const result = isValidEmail(email);

      //ASSERT
      expect(result).toBe("");
    });

    it("should return the error when the @ or the domain is missing", () => {
      //ARRANGE
      const message = "Email must be valid";

      //ACT
      const noAt = isValidEmail("adam.example.com");
      const noDomain = isValidEmail("adam@");
      const empty = isValidEmail("");

      //ASSERT
      expect(noAt).toBe(message);
      expect(noDomain).toBe(message);
      expect(empty).toBe(message);
    });
  });

  describe("isValidPhoneNumber", () => {
    it("should accept 8 characters and refuse 7", () => {
      //ARRANGE
      const eightChars = "21234567";
      const sevenChars = "2123456";

      //ACT
      const ok = isValidPhoneNumber(eightChars);
      const bad = isValidPhoneNumber(sevenChars);

      //ASSERT
      expect(ok).toBe("");
      expect(bad).toBe("Phone number must be at least 8 characters");
    });
  });
});
