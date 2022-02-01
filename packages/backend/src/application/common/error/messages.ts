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

export const cannotViewUser = "You cannot view this user";
export const updatingUserNonAuthorizer =
  "You cannot update another user if you are not an authorizer";
export const updatingUserRolesNonAuthorizer =
  "You cannot change a user's roles if you are not an authorizer";

export const allocatingOwnTicket = "You cannot be allocated to your own ticket";
export const allocatingAllocatedTicket =
  "You cannot allocate a ticket which has already been allocated";
export const cancellingOtherTicket = "You cannot delete a ticket which was created by another user";
export const cancellingAllocatedTicket =
  "You cannot delete a ticket which has already been allocated";
export const reviewingOtherTicket = "You cannot review which is allocated to another employee";
export const reviewingCompletedTicket =
  "You cannot complete a ticket which has already been completed";
export const reviewingNonAllocatedTicket =
  "You cannot review a ticket which has not been allocated";
export const completingTicketNotRequired = "This ticket does not require additional information";
export const completingOtherTicket =
  "You cannot provide additional information to a ticket created by another user";
export const authorizingAuthorizedTicket =
  "You cannot authorize an ticket which has already been authorized";
export const authorizingNonCompleteTicket = "You cannot authorize an non-completed ticket";
export const authorizingOwnCreatedTicket = "You cannot authorized a ticket which you created";
export const authorizingOwnAllocatedTicket =
  "You cannot authorized a ticket to which you are allocated";
export const submittingPriceToPricedTicket =
  "You cannot submit the price of a ticket which is already priced";
export const submittingPriceNonComplete = "You cannot submit the price for a non-completed ticket";
export const submittingPriceOtherTicket =
  "You cannot submit the price of a ticket which is allocated to another employee";
