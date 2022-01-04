import { ILogger } from "@/application/common/interfaces";
import { IBehavior } from "@/application/common/interfaces/cqrs";
import { Dependency } from "@/application/dependency";
import { container } from "tsyringe";

const requestLoggerBehavior: IBehavior = {
  handle: async (request, next) => {
    const log = container.resolve<ILogger>(Dependency.logger);

    log("cqrs", `Received ${request.requestName}`);

    const result = await next();

    log(
      "cqrs",
      `${result ? "Returning result" : "No result"} for ${request.requestName}`
    );

    return result;
  },
};

export { requestLoggerBehavior };
