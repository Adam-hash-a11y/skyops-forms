import { describe, expect, it } from "vitest";
import { formatUtcDate, formatUtcTime } from "../../src/utils/formatDateTime";

describe("formatDateTime", () => {
  describe("formatUtcTime", () => {
    it("should show the time in 24-hour format with UTC", () => {
      //ARRANGE
      const date = "2026-06-01T08:00:00.000Z";

      //ACT
      const result = formatUtcTime(date);

      //ASSERT
      expect(result).toBe("08:00 UTC");
    });
  });

  describe("formatUtcDate", () => {
    it("should show the date as day, short month and year", () => {
      //ARRANGE
      const date = "2026-06-01T08:00:00.000Z";

      //ACT
      const result = formatUtcDate(date);

      //ASSERT
      expect(result).toBe("01 Jun 2026");
    });
  });

  describe("UTC and not the computer time zone", () => {
    it("should keep the same day and time for a late-night UTC value", () => {
      //ARRANGE
      const date = "2026-06-01T23:30:00.000Z";

      //ACT
      const time = formatUtcTime(date);
      const day = formatUtcDate(date);

      //ASSERT
      expect(time).toBe("23:30 UTC");
      expect(day).toBe("01 Jun 2026");
    });
  });
});
