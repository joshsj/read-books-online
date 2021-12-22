import { ILogger } from "@/application/common/interfaces";
import { IBehavior } from "@/common/cqrs/types";
import { Dependency } from "@/dependency";
import { container } from "tsyringe";

const requestLoggerBehavior: IBehavior = {
  handle: async (request, next) => {
    const log = container.resolve<ILogger>(Dependency.logger);

    log("cqrs", `Received ${request.requestName}`);

    const result = await next();

    log("cqrs", `Returning result for ${request.requestName}`);

    return result;
  },
};

export { requestLoggerBehavior };
