import { ValidationError } from "@/application/common/error/validationError";
import { ILogger, IValidator } from "@/application/common/interfaces";
import {
  IBehavior,
  IRequest,
  IRequestName,
} from "@/application/common/interfaces/cqrs";
import { Dependency } from "@/application/dependency";
import { container } from "tsyringe";

const validatorBehavior: IBehavior = {
  handle: async (request, next) => {
    const log = container.resolve<ILogger>(Dependency.logger);

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

    if (errors.length) {
      throw new ValidationError(errors);
    }

    log("cqrs", `Validation passed for request ${request.requestName}`);

    return await next();
  },
};

export { validatorBehavior };
