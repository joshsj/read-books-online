import { IBehavior } from "@core/cqrs/types";
import { Dependency } from "@backend/application/dependency";
import { container } from "tsyringe";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { IRequestAuthorizer } from "@backend/application/common/interfaces/cqrs";

const authorizerBehavior: IBehavior = {
  handle: async (request, next) => {
    const logger = container.resolve<ILogger>(Dependency.logger);

    const authorizers = container.isRegistered(Dependency.requestAuthorizer)
      ? container
          .resolveAll<IRequestAuthorizer<any>>(Dependency.requestAuthorizer)
          .filter((x) => x.requestName === request.requestName)
      : [];

    if (!authorizers.length) {
      logger.log("authorization", `No authorizers found for request ${request.requestName}`);
      return await next();
    }

    logger.log(
      "authorization",
      `Resolved ${authorizers.length} authorizers for request ${request.requestName}`
    );

    for (const authorizer of authorizers) {
      await authorizer.authorize(request);
    }

    logger.log("authorization", `Passed for request ${request.requestName}`);

    return await next();
  },
};

export { authorizerBehavior };
