import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ILogger } from "@backend/application/common/interfaces/logger";
import { Dependency } from "@backend/application/dependency";
import { middlewareAsync } from "../utilities/request";
import { Socket } from "../utilities/types";

const authenticator = middlewareAsync(async ({ data: { container } }: Socket) => {
  const logger = container!.resolve<ILogger>(Dependency.logger);

  logger.log("authentication", "Attempting authentication");

  await container!.resolve<IIdentityService>(Dependency.identityService).authenticate();

  logger.log("authentication", "Passed");
});

export { authenticator };
