import { IIdentityService } from "@/application/common/interfaces/identityService";
import { ILogger } from "@/application/common/interfaces/logger";
import { Dependency } from "@/application/dependency";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Handler } from "express";

const authenticator: Handler = handleAsync(async ({}, {}, { getPerRequestContainer }) => {
  const container = getPerRequestContainer();

  const log = container.resolve<ILogger>(Dependency.logger);
  const identityService = container.resolve<IIdentityService>(Dependency.identityService);

  await identityService.authenticate();

  log("authentication", "Passed");
});

export { authenticator };
