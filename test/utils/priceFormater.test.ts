import { describe, expect, it } from "vitest";
import { priceFormatter } from "../../src/utils/priceFormater";

describe("priceFormatter", () => {
  describe("format", () => {
    it("should show a whole price in euro with 2 decimals", () => {
      //ARRANGE
      const price = 120;

      //ACT
      const result = priceFormatter.format(price);

      //ASSERT
      expect(result).toBe("€120.00");
    });

    it("should show a thousands comma and 2 decimals for a big price", () => {
      //ARRANGE
      const price = 1234.5;

      //ACT
      const result = priceFormatter.format(price);

      //ASSERT
      expect(result).toBe("€1,234.50");
    });
  });
});
