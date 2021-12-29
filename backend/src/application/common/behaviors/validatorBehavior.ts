import {
  IBehavior,
  IRequest,
  IRequestName,
} from "@/application/common/interfaces/cqrs/types";
import { container } from "tsyringe";
import { ILogger, IValidator } from "@/application/common/interfaces";
import { Dependency } from "@/application/dependency";
import { ApiError } from "@/web/error";

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
      throw new ApiError(
        "validation",
        `Validation failed for request ${
          request.requestName
        } with errors ${errors.join(", ")}`
      );
    }

    log("cqrs", `Validation passed for request ${request.requestName}`);

    return await next();
  },
};

export { validatorBehavior };
