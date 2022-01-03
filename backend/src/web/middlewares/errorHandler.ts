import { ILogger } from "@/application/common/interfaces";
import { Dependency } from "@/application/dependency";
import { EntityValidationError } from "@/domain/error/entityValidationError";
import { ErrorRequestHandler } from "express";
import { container } from "tsyringe";

// Function must be declared with all 4 arguments to be understood by Express
const errorHandler: ErrorRequestHandler = (err, {}, res, {}) => {
  const log = container.resolve<ILogger>(Dependency.logger);

  if (err instanceof EntityValidationError) {
    res.status(400).send(err.message);
    log("server", "Entity Validation error occurred");
    return;
  }

  log("server", "Unknown error occurred");
  res.status(500).send("Internal error occurred");
};

export { errorHandler };
