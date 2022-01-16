import {
  IBehavior,
  IRequest,
  IRequestName,
  IRequestValidator,
} from "@backend/application/common/interfaces/cqrs";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency } from "@backend/application/dependency";
import { container } from "tsyringe";

const validatorBehavior: IBehavior = {
  handle: async (request, next) => {
    const logger = container.resolve<ILogger>(Dependency.logger);

    const validators = container
      .resolveAll<IRequestValidator<IRequest<IRequestName>>>(Dependency.requestValidator)
      .filter((v) => v.requestName === request.requestName);

    if (!validators.length) {
      logger.log(
        "validation",
        `Skipping validation for request ${request.requestName}, no validators were resolved`
      );
      return await next();
    }

    logger.log(
      "validation",
      `Resolved ${validators.length} validators for request ${request.requestName}`
    );

    for (const validator of validators) {
      await validator.validate(request);
    }

    logger.log("validation", `Validation passed for request ${request.requestName}`);

    return await next();
  },
};

export { validatorBehavior };
