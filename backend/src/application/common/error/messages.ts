import { Id } from "@/domain/common/id";
import { ApiErrorType } from "./apiError";

const q = (s: string) => `'${s}'`;

export const defaults: { [K in ApiErrorType]: string } = {
  fatal: "Internal error occurred",
  validation: "Invalid request",
  authentication: "Failed to authenticate",
  authorization: "Failed to authorize",
  missing: "Resource could not be found",
};

export const incorrectPassword = (username: string) => `Incorrect password for user ${q(username)}`;

export const userNotFound = (username?: string) => "User not found" + (username ? ` with username ${q(username)}` : "");

export const failedToCreateAuthToken = "Failed to create authentication token";

export const invalidAuthToken = "Invalid authorization token provided";

export const noRefreshToken = "Refresh token not provided";
export const invalidRefreshToken = "Invalid refresh token";
export const expiredRefreshToken = "Refresh token has expired";

export const entityNotFound = (id: Id) => `Entity with ID ${q(id)} was not found`;
