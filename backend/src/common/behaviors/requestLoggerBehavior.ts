import { IBehavior } from "@/cqrs/types";
import { Dependency, Logger } from "@/dependency";
import { container } from "tsyringe";

const requestLoggerBehavior: IBehavior = {
  handle: async (request, next) => {
    const log = container.resolve<Logger>(Dependency.logger);

    log("cqrs", `Received ${request.requestName}`);

    const result = await next();

    log("cqrs", `Returning result for ${request.requestName}`);

    return result;
  },
};

export { requestLoggerBehavior };
