import { Dependency, Logger } from "@/dependency";
import { ErrorRequestHandler } from "express";
import { container } from "tsyringe";

// Function must be declared with all 4 arguments to be understood by Express
const errorHandler: ErrorRequestHandler = (err, {}, res, {}) => {
  const log = container.resolve<Logger>(Dependency.logger);

  // TODO: check error type
  log("server", "Error", err);

  res.status(500).send("Internal error occurred");
};

export { errorHandler };
