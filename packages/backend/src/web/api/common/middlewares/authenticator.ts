import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency } from "@backend/application/dependency";
import { handleAsync } from "@backend/web/api/common/utilities/request";
import { Handler } from "express";

const authenticator: Handler = handleAsync(async ({}, {}, { getPerRequestContainer }) => {
  const container = getPerRequestContainer();

  const logger = container.resolve<ILogger>(Dependency.logger);
  const identityService = container.resolve<IIdentityService>(Dependency.identityService);

  await identityService.authenticate();

  logger.log("authentication", "Passed");

  return { state: "next" };
});

export { authenticator };
