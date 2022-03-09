import { AccountDto } from "@backend/application/common/dtos/accountDto";
import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ILogger } from "@backend/application/common/interfaces/logger";
import {
  AssertSchema,
  assertSchema as _assertSchema,
} from "@backend/application/common/utilities/schema";
import { Dependency } from "@backend/application/dependency";
import { handleAsync } from "@backend/web/api/common/utilities/request";
import { Router } from "express";

const assertSchema: AssertSchema = _assertSchema;

const routes = Router();

routes.get(
  "/:token",
  handleAsync(async ({ params }, {}, { getPerRequestContainer }) => {
    const { token } = params;

    const container = getPerRequestContainer();

    container
      .resolve<IHttpContextService>(Dependency.httpContextService)
      .getCurrent().refreshTokenValue = token;

    const logger = container.resolve<ILogger>(Dependency.logger);
    logger.log("authentication", "Attempting login using refresh token");

    const tokensDto = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .login("refresh");

    logger.log("authentication", "Login successful using refresh token");

    return { state: "ok", value: tokensDto };
  })
);

routes.post(
  "",
  handleAsync(async ({ body: accountDto }, {}, { getPerRequestContainer }) => {
    assertSchema(accountDto, AccountDto);

    const container = getPerRequestContainer();

    const logger = container.resolve<ILogger>(Dependency.logger);
    logger.log("authentication", "Attempting login using credentials");

    const tokensDto = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .login(accountDto);

    logger.log("authentication", "Login successful using credentials");

    return { state: "ok", value: tokensDto };
  })
);

routes.delete(
  "",
  handleAsync(async ({}, {}, { getPerRequestContainer }) => {
    const container = getPerRequestContainer();

    const logger = container.resolve<ILogger>(Dependency.logger);
    logger.log("authentication", "Logging out");

    await container.resolve<IIdentityService>(Dependency.identityService).logout();

    return { state: "noContent" };
  })
);

export { routes as authRoutes };
