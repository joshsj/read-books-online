import { Id } from "@backend/domain/common/id";
import { Role } from "@backend/domain/constants/role";
import { plural } from "@core/utilities/string";
import { RBOErrorType } from "./rboError";

const q = (s: string | string[]): string =>
  typeof s === "string" ? `'${s}'` : s.map(q).join(", ");

export const defaults: { [K in RBOErrorType]: string } = {
  fatal: "Internal error occurred",
  validation: "Invalid request",
  authentication: "Failed to authenticate",
  authorization: "Failed to authorize",
  missing: "Resource could not be found",
};

export const failedToCreateAuthToken = "Failed to create authentication token";
export const invalidAuthToken = "Invalid authentication token provided";

export const noRefreshToken = "Refresh token not provided";
export const invalidRefreshToken = "Invalid refresh token";
export const expiredRefreshToken = "Refresh token has expired";

export const notFound = (id: Id, entity = "Entity") =>
  `${entity} with ID ${q(id.toString())} was not found` as const;
export const cannotView = (entity = "item") => `You cannot view this ${entity}` as const;
export const requiresRoles = (...roles: Role[]) =>
  roles.length
    ? `This operation requires the following ${plural(roles.length > 1, "role")}: ${q(roles)}`
    : "You do not have the adequate roles for this operation";

export const incorrectPassword = (username: string) =>
  `Incorrect password for user ${q(username)}` as const;

export const userAlreadyExists = (username: string) =>
  `User already exists with username ${username}`;
export const userNotFound = (username?: string) =>
  "User not found" + (username ? ` with username ${q(username)}` : "");

export const allocatingOwnTicket = "You cannot allocate your own ticket";
export const allocatingAllocatedTicket =
  "You cannot allocate a ticket which has already been allocated";
export const cancelOtherTicket = "You cannot delete a ticket which was created by another user";
export const cancelAllocatedTicket = "You cannot delete a ticket which has been allocated";
export const reviewingApprovedTicket = "You cannot review a ticket which has been approved";
export const reviewingNonAllocatedTicket =
  "You cannot review a ticket which has not been allocated";
export const reviewingOtherTicket =
  "You cannot review a ticket which is allocated to another employee";
