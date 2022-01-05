import { ApiError, ApiErrorType } from "@/application/common/error";
import { ILogger } from "@/application/common/interfaces/logger";
import { Dependency } from "@/application/dependency";
import { ApiErrorDto } from "@/web/common/models/error";
import { ErrorRequestHandler } from "express";
import { container } from "tsyringe";

const statusCode: { [K in ApiErrorType]: number } = {
  validation: 400,
};

// Function must be declared with all 4 arguments to be understood by Express
const errorHandler: ErrorRequestHandler = (err, {}, res, {}) => {
  const log = container.resolve<ILogger>(Dependency.logger);

  if (!(err instanceof ApiError)) {
    log("server", "Unknown error occurred", err);
    res.status(500).end();
    return;
  }

  const dto: ApiErrorDto = err;
  res.status(statusCode[err.type]).json(dto);
  log("server", `${err.type} error occurred`, err.message);
};

export { errorHandler };
