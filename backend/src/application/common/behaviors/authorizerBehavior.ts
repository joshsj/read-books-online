import { IBehavior, IRequestAuthorizer } from "@/application/common/interfaces/cqrs";
import { Dependency } from "@/application/dependency";
import { container } from "tsyringe";
import { ILogger } from "@/application/common/interfaces/logger";

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

    logger.log("authorization", `Resolved ${authorizers.length} authorizers for request ${request.requestName}`);

    for (const authorizer of authorizers) {
      await authorizer.authorize(request);
    }

    logger.log("authorization", `Passed for request ${request.requestName}`);

    return await next();
  },
};

export { authorizerBehavior };
