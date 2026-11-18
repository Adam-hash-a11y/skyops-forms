import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("../../src/service/axios");

import { api } from "../../src/service/axios";
import {
  createPassenger,
  deletePassenger,
  getPassenger,
  getPassengers,
  searchPassengers,
  updatePassenger,
} from "../../src/service/passengerService";

const apiPassenger = {
  _id: "p1",
  firstName: "Lena",
  lastName: "Banks",
  passportNumber: "DE7731902",
  nationality: "DE",
  dateOfBirth: "1990-05-20T00:00:00.000Z",
  email: "lena.banks@example.com",
  phoneNumber: "+4915112345678",
};

const mappedPassenger = {
  id: "p1",
  firstName: "Lena",
  lastName: "Banks",
  passportNumber: "DE7731902",
  nationality: "DE",
  dateOfBirth: "1990-05-20",
  email: "lena.banks@example.com",
  phoneNumber: "+4915112345678",
};

describe("passengerService", () => {
  describe("reading passengers", () => {
    it("should call GET /passengers and return the passengers mapped for the app", async () => {
      //ARRANGE
      vi.mocked(api.get).mockResolvedValue({
        data: { passengers: [apiPassenger] },
      });

      //ACT
      const result = await getPassengers();

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/passengers");
      expect(result).toEqual([mappedPassenger]);
    });

    it("should call GET /passengers/DE7731902 and return one passenger with the date of birth cut to 10 characters", async () => {
      //ARRANGE
      vi.mocked(api.get).mockResolvedValue({ data: apiPassenger });

      //ACT
      const result = await getPassenger("DE7731902");

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/passengers/DE7731902");
      expect(result).toEqual(mappedPassenger);
    });
  });

  describe("writing passengers", () => {
    it("should call DELETE /passengers/DE7731902", async () => {
      //ARRANGE
      vi.mocked(api.delete).mockResolvedValue({ data: {} });

      //ACT
      await deletePassenger("DE7731902");

      //ASSERT
      expect(api.delete).toHaveBeenCalledTimes(1);
      expect(api.delete).toHaveBeenCalledWith("/passengers/DE7731902");
    });

    it("should call POST /passengers with the 7 values", async () => {
      //ARRANGE
      vi.mocked(api.post).mockResolvedValue({ data: {} });

      //ACT
      await createPassenger(
        "Lena",
        "Banks",
        "DE7731902",
        "DE",
        "1990-05-20",
        "lena.banks@example.com",
        "+4915112345678",
      );

      //ASSERT
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith("/passengers", {
        firstName: "Lena",
        lastName: "Banks",
        passportNumber: "DE7731902",
        nationality: "DE",
        dateOfBirth: "1990-05-20",
        email: "lena.banks@example.com",
        phoneNumber: "+4915112345678",
      });
    });

    it("should call PATCH /passengers/DE7731902 with a body that has no passport number", async () => {
      //ARRANGE
      vi.mocked(api.patch).mockResolvedValue({ data: {} });

      //ACT
      await updatePassenger(
        "DE7731902",
        "Lena",
        "Banks",
        "FR",
        "1990-05-20",
        "lena.banks@example.com",
        "+4915112345678",
      );

      //ASSERT
      expect(api.patch).toHaveBeenCalledTimes(1);
      expect(api.patch).toHaveBeenCalledWith("/passengers/DE7731902", {
        firstName: "Lena",
        lastName: "Banks",
        nationality: "FR",
        dateOfBirth: "1990-05-20",
        email: "lena.banks@example.com",
        phoneNumber: "+4915112345678",
      });
    });
  });

  describe("searching passengers", () => {
    it("should send nationality and sortBy as they are and the names trimmed", async () => {
      //ARRANGE
      vi.mocked(api.get).mockResolvedValue({
        data: { passengers: [apiPassenger] },
      });

      //ACT
      const result = await searchPassengers(
        "DE",
        " Lena ",
        " Banks ",
        "firstName",
      );

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/passengers", {
        params: {
          nationality: "DE",
          firstName: "Lena",
          lastName: "Banks",
          sortBy: "firstName",
        },
      });
      expect(result).toEqual([mappedPassenger]);
    });

    it("should not send any param when the filters are empty or only spaces", async () => {
      //ARRANGE
      vi.mocked(api.get).mockResolvedValue({ data: { passengers: [] } });

      //ACT
      const result = await searchPassengers("", "   ", "   ", "");

      //ASSERT
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith("/passengers", { params: {} });
      expect(result).toEqual([]);
    });
  });

  describe("failures", () => {
    it("should pass the error on to the caller when the API call is rejected", async () => {
      //ARRANGE
      vi.mocked(api.get).mockRejectedValue(new Error("Server not reachable"));

      //ACT
      const promise = getPassengers();

      //ASSERT
      await expect(promise).rejects.toThrow("Server not reachable");
    });
  });
});
