import { Dependency, Logger } from "@/dependency";
import { ApiError, ApiErrorType } from "@/error";
import { ErrorRequestHandler } from "express";
import { container } from "tsyringe";

const defaultErrorData = [
  "Unknown error occurred",
  500,
  "Internal error occurred",
] as const;

const statusCodes: { [K in ApiErrorType]: number } = {
  validation: 400,
};

// Function must be declared with all 4 arguments to be understood by Express
const errorHandler: ErrorRequestHandler = (err, {}, res, {}) => {
  const log = container.resolve<Logger>(Dependency.logger);

  const [logMessage, status, message] =
    err instanceof ApiError
      ? ["API error occurred", statusCodes[err.type], err.message]
      : defaultErrorData;

  log("server", logMessage, err);
  res.status(status).send(message);
};

export { errorHandler };
