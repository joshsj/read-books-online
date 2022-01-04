import { BaseError } from "./baseError";

class ValidationError extends BaseError<"validationError"> {
  name: "validationError" = "validationError";

  constructor(problem?: string | ReadonlyArray<string>) {
    if (!problem) {
      super();
      return;
    }

    if (typeof problem === "string") {
      super(problem);
      return;
    }

    super(
      problem.length
        ? `Failed to validate fields: ${problem.join(", ")}`
        : undefined
    );
  }
}

export { ValidationError };
