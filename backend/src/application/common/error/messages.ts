import { ApiErrorType } from "./apiError";

const q = (s: string) => `'${s}'`;

export const defaults: { [K in ApiErrorType]: string } = {
  validation: "Invalid request",
  authentication: "Failed to authenticate",
  authorization: "Failed to authorize",
  missing: "Resource could not be found",
};

export const incorrectPassword = (username: string) => `Incorrect password for user ${q(username)}`;

export const userNotFound = (username: string) => `User with username ${q(username)} not found`;

export const failedToCreateAuthToken = "Failed to create authentication token";

export const invalidToken = "Invalid authorization token provided";
