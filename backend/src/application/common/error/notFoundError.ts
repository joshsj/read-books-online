import { BaseError } from "./baseError";

class NotFoundError extends BaseError<"notFoundError"> {
  name: "notFoundError" = "notFoundError";
}

export { NotFoundError };
