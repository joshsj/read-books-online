import { BaseError } from "./baseError";

class ValidationError extends BaseError<"validationError"> {
  name: "validationError" = "validationError";

  constructor(problem: string | ReadonlyArray<string>) {
    super(
      typeof problem === "string"
        ? problem
        : problem.length
        ? `Failed to validate fields: ${problem.join(", ")}`
        : undefined
    );
  }
}

export { ValidationError };
