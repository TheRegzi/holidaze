import { vi, it, expect } from "vitest";
import { logoutUser } from "./logoutUser";

it("should logout the user", () => {
  const removeItem = vi.fn();
  window.localStorage = { removeItem };
  logoutUser();
  expect(removeItem).toHaveBeenCalledWith("user");
  expect(removeItem).toHaveBeenCalledWith("accessToken");
  expect(removeItem).toHaveBeenCalledTimes(2);
});
