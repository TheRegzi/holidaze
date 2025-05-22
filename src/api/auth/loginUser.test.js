import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { loginUser } from "./loginUser";
import { API_LOGIN } from "../../utils/constants";

vi.mock("../../utils/headers", () => ({
  getHeaders: vi.fn(),
}));

import { getHeaders } from "../../utils/headers";

let mockFetch;

describe("loginUser", () => {
  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
    getHeaders.mockClear();
    getHeaders.mockReturnValue({
      "Content-Type": "application/json",
      "X-Noroff-API-Key": "mock-holidaze-api-key",
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should successfully log in a user and return data", async () => {
    const mockUserData = {
      name: "testuser",
      email: "test@example.com",
      accessToken: "mockAccessToken123",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUserData),
    });

    const email = "example@email.com";
    const password = "correctpassword";
    const result = await loginUser({ email, password });

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_LOGIN}?_holidaze=true`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
    );
    expect(getHeaders).toHaveBeenCalled();
    expect(result).toEqual(mockUserData);
  });

  it("should throw an error for failed login with a specific message", async () => {
    const errorMessage = "Invalid email or password";
    const mockErrorResponse = { message: errorMessage };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockErrorResponse),
    });

    const email = "wrong@example.com";
    const password = "wrongpassword";

    await expect(loginUser({ email, password })).rejects.toThrow(errorMessage);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
