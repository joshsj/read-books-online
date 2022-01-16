import { ILogger } from "@backend/application/common/interfaces/logger";
import { IBehavior } from "@core/cqrs/types";
import { Dependency } from "@backend/application/dependency";
import { container } from "tsyringe";

const requestLoggerBehavior: IBehavior = {
  handle: async (request, next) => {
    const logger = container.resolve<ILogger>(Dependency.logger);

    logger.log("cqrs", `Received request`, request);

    const result = await next();

    logger.log("cqrs", `Responding to ${request.requestName}`, result);

    return result;
  },
};

export { requestLoggerBehavior };
