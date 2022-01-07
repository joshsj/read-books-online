import { ApiError, ApiErrorType } from "@/application/common/error/apiError";
import { ILogger } from "@/application/common/interfaces/logger";
import { Dependency } from "@/application/dependency";
import { ErrorDto } from "@/web/common/models/error";
import { ErrorRequestHandler } from "express";
import { container } from "tsyringe";

const statusCode: { [K in ApiErrorType]: number } = {
  validation: 400,
  authentication: 401,
  authorization: 403,
  missing: 404,
};

// Function must be declared with all 4 arguments to be understood by Express
const errorHandler: ErrorRequestHandler = (err, {}, res, {}) => {
  const log = container.resolve<ILogger>(Dependency.logger);

  const [type, message, code, logMessage, extra] =
    err instanceof ApiError
      ? [err.type, err.message, statusCode[err.type], `${err.type} error occurred`]
      : (["internal", "Internal error occurred", 500, "Unknown error occurred", err] as const);

  log("server", logMessage, extra);

  const dto: ErrorDto = { error: true, type, message };

  res.status(code).json(dto).end();
};

export { errorHandler };
