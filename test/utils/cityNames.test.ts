import { describe, expect, it } from "vitest";
import { getCityName } from "../../src/utils/cityNames";

describe("cityNames", () => {
  describe("getCityName", () => {
    it("should return the city name for a known code", () => {
      //ARRANGE
      const tunis = "TUN";
      const dusseldorf = "DUS";

      //ACT
      const resultTunis = getCityName(tunis);
      const resultDusseldorf = getCityName(dusseldorf);

      //ASSERT
      expect(resultTunis).toBe("Tunis");
      expect(resultDusseldorf).toBe("Düsseldorf");
    });

    it("should return Paris for both Paris airports", () => {
      //ARRANGE
      const charlesDeGaulle = "CDG";
      const orly = "ORY";

      //ACT
      const resultCdg = getCityName(charlesDeGaulle);
      const resultOry = getCityName(orly);

      //ASSERT
      expect(resultCdg).toBe("Paris");
      expect(resultOry).toBe("Paris");
    });

    it("should return the same text when the code is unknown or empty", () => {
      //ARRANGE
      const unknown = "XXX";
      const empty = "";

      //ACT
      const resultUnknown = getCityName(unknown);
      const resultEmpty = getCityName(empty);

      //ASSERT
      expect(resultUnknown).toBe("XXX");
      expect(resultEmpty).toBe("");
    });
  });
});
