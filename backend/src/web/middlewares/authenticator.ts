import { ApiError } from "@/application/common/error/apiError";
import { invalidToken } from "@/application/common/error/messages";
import { IConfiguration } from "@/application/common/interfaces/configuration";
import { ILogger } from "@/application/common/interfaces/logger";
import { Dependency } from "@/application/dependency";
import { ensure } from "@/common/utilities";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Handler } from "express";
import { container } from "tsyringe";

const authenticator: Handler = handleAsync(async ({}, {}, { getToken, setAuthenticated, verifyToken }) => {
  const log = container.resolve<ILogger>(Dependency.logger);
  const configuration = container.resolve<IConfiguration>(Dependency.configuration);

  const token = getToken();
  ensure(!!token, new ApiError("authorization", invalidToken));

  log("authentication", `Attempting with token ${token}`);

  const verified = await verifyToken(token, configuration);
  ensure(verified !== false, new ApiError("authentication", invalidToken));

  log("authentication", "Passed");

  setAuthenticated();
});

export { authenticator };
