import { ILogger } from "@/application/common/interfaces";
import { Dependency } from "@/application/dependency";
import { ValidationError } from "@/application/common/error/validationError";
import { ErrorRequestHandler } from "express";
import { container } from "tsyringe";

// Function must be declared with all 4 arguments to be understood by Express
const errorHandler: ErrorRequestHandler = (err, {}, res, {}) => {
  const log = container.resolve<ILogger>(Dependency.logger);

  if (err instanceof ValidationError) {
    res.status(400).send(err.message);
    log("server", "Entity Validation error occurred");
    return;
  }
  // TODO: add BaseError handling

  log(
    "server",
    "Unknown error occurred",
    err instanceof Error ? err.message : err
  );
  res.status(500).send("Internal error occurred");
};

export { errorHandler };
