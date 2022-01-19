import { Handler } from "express";
import { handleAsync } from "@backend/api/common/utilities/requestHelper";
import { container } from "tsyringe";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency } from "@backend/application/dependency";

const requestLogger: Handler = handleAsync(async ({ method, url, query, body }) => {
  container
    .resolve<ILogger>(Dependency.logger)
    .log("server", `Received ${method} ${url}`, query, body);

  return "next";
});

export { requestLogger };
