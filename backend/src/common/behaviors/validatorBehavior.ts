import { IBehavior, IRequest, IRequestName } from "@/library/cqrs/types";
import { Dependency, IValidator, Logger } from "@/dependency";
import { throwApiError } from "@/error";
import { container } from "tsyringe";

const validatorBehavior: IBehavior = {
  handle: async (request, next) => {
    const log = container.resolve<Logger>(Dependency.logger);

    const validators = container
      .resolveAll<IValidator<IRequest<IRequestName>>>(Dependency.validator)
      .filter((v) => v.requestName === request.requestName);

    if (!validators.length) {
      log(
        "cqrs",
        `Skipping validation for request ${request.requestName}, no validators were resolved`
      );
      return await next();
    }

    log(
      "cqrs",
      `Resolved ${validators.length} validators for request ${request.requestName}`
    );

    const errors = validators.flatMap((v) => v.validate(request));

    errors.length
      ? throwApiError(
          "validation",
          `Validation failed for request ${
            request.requestName
          } with errors ${errors.join(", ")}`
        )
      : log("cqrs", `Validation passed for request ${request.requestName}`);

    return await next();
  },
};

export { validatorBehavior };
