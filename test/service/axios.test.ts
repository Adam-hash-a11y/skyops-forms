import { describe, expect, it, vi } from "vitest";
import { AxiosError } from "axios";
import "@testing-library/jest-dom/vitest";

import { api, loginToApi } from "../../src/service/axios";

describe("axios", () => {
  describe("response interceptor", () => {
    it("should pass a successful response through unchanged", async () => {
      //ARRANGE
      api.defaults.adapter = async (config) => ({
        data: { ok: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      });

      //ACT
      const response = await api.get("/flights");

      //ASSERT
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ ok: true });
    });

    it("should replace the error message with the message sent by the backend", async () => {
      //ARRANGE
      api.defaults.adapter = async (config) => {
        throw new AxiosError(
          "Request failed",
          "ERR_BAD_REQUEST",
          config,
          null,
          {
            data: { message: "Duplicate flight number" },
            status: 409,
            statusText: "Conflict",
            headers: {},
            config,
          },
        );
      };

      //ACT
      const promise = api.get("/flights");

      //ASSERT
      await expect(promise).rejects.toThrow("Duplicate flight number");
    });

    it("should keep the original error message when the backend sends no message", async () => {
      //ARRANGE
      api.defaults.adapter = async (config) => {
        throw new AxiosError(
          "Request failed",
          "ERR_BAD_RESPONSE",
          config,
          null,
          {
            data: {},
            status: 500,
            statusText: "Internal Server Error",
            headers: {},
            config,
          },
        );
      };

      //ACT
      const promise = api.get("/flights");

      //ASSERT
      await expect(promise).rejects.toThrow("Request failed");
    });

    it("should use 'Server not reachable' when there is no response at all", async () => {
      //ARRANGE
      api.defaults.adapter = async (config) => {
        throw new AxiosError("Network Error", "ERR_NETWORK", config);
      };

      //ACT
      const promise = api.get("/flights");

      //ASSERT
      await expect(promise).rejects.toThrow("Server not reachable");
    });
  });

  describe("loginToApi", () => {
    it("should call GET /login and send the token as a Bearer header on the next request", async () => {
      //ARRANGE
      const adapter = vi.fn(async (config) => ({
        data: { token: "abc123" },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      }));
      api.defaults.adapter = adapter;

      //ACT
      await loginToApi();
      await api.get("/flights");

      //ASSERT
      expect(adapter).toHaveBeenCalledTimes(2);
      expect(adapter.mock.calls[0][0].url).toBe("/login");
      expect(adapter.mock.calls[1][0].headers.get("Authorization")).toBe(
        "Bearer abc123",
      );
    });
  });
});
