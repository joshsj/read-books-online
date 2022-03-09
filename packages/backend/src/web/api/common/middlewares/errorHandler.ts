import { RBOError, RBOErrorType } from "@backend/application/common/error/rboError";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency } from "@backend/application/dependency";
import { RBOErrorDto } from "@backend/application/common/dtos/errorDto";
import { getPerRequestContainer } from "@backend/web/api/common/utilities/container";
import { ErrorRequestHandler } from "express";

type ErrorData = RBOErrorDto & { code: number; logData: any; logRest: any[] };

const statusCode: { [K in RBOErrorType]: number } = {
  fatal: 500,
  validation: 400,
  authentication: 401,
  authorization: 403,
  missing: 404,
};

const getRBOErrorData = ({ type, message, stack }: RBOError): ErrorData => ({
  rboError: true,
  type,
  message,
  code: statusCode[type],
  logData: `${type} error occurred`,
  logRest: [message, stack],
});

const getErrorData = (err: any): ErrorData => {
  const [logData, ...logRest] =
    err instanceof Error ? ["Unknown error occurred", err.message, err.stack] : [err];

  return {
    rboError: true,
    type: "internal",
    code: 500,
    logData,
    logRest,
    message: "Internal error occurred",
  };
};

// Function must be declared with all 4 arguments to be understood by Express
const errorHandler: ErrorRequestHandler = (err, {}, res, {}) => {
  const data = err instanceof RBOError ? getRBOErrorData(err) : getErrorData(err);

  getPerRequestContainer(res)
    .resolve<ILogger>(Dependency.logger)
    .log("server", data.logData, ...data.logRest);

  const dto: RBOErrorDto = {
    rboError: true,
    type: data.type,
    message: data.message,
  };

  res.status(data.code).json(dto).end();
};

export { errorHandler };
