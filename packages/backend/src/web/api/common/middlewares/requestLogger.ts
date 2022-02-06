import { handleAsync } from "@backend/web/api/common/utilities/request";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency } from "@backend/application/dependency";
import { Handler } from "express";

const requestLogger: Handler = handleAsync(
  async ({ method, url, query, body }, {}, { getPerRequestContainer }) => {
    getPerRequestContainer()
      .resolve<ILogger>(Dependency.logger)
      .log("server", `Received ${method} ${url}`, query, body);

    return { state: "next" };
  }
);

export { requestLogger };
