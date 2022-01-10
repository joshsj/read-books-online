import { RBOError, IRBOErrorType } from "@/application/common/error/rboError";
import { ILogger } from "@/application/common/interfaces/logger";
import { Dependency } from "@/application/dependency";
import { ErrorDto } from "@/web/common/models/error";
import { getPerRequestContainer } from "@/web/common/utilities/container";
import { ErrorRequestHandler } from "express";

type ErrorData = ErrorDto & { code: number; logData: any; logRest: any[] };

const statusCode: { [K in IRBOErrorType]: number } = {
  fatal: 500,
  validation: 400,
  authentication: 401,
  authorization: 403,
  missing: 404,
};

const getRBOErrorData = ({ type, message }: RBOError): ErrorData => ({
  error: true,
  type,
  message,
  code: statusCode[type],
  logData: `${type} error occurred`,
  logRest: [message],
});

const getErrorData = (err: any): ErrorData => {
  const [logData, logRest] = err instanceof Error ? ["Unknown error occurred", err.message] : [err];

  return {
    error: true,
    type: "internal",
    code: 500,
    logData,
    logRest: [logRest],
  };
};

// Function must be declared with all 4 arguments to be understood by Express
const errorHandler: ErrorRequestHandler = (err, {}, res, {}) => {
  const data = err instanceof RBOError ? getRBOErrorData(err) : getErrorData(err);

  getPerRequestContainer(res)
    .resolve<ILogger>(Dependency.logger)
    .log("server", data.logData, ...data.logRest);

  const dto: ErrorDto = {
    error: true,
    type: data.type,
    message: data.message,
  };

  res.status(data.code).json(dto).end();
};

export { errorHandler };