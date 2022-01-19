import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { Dependency } from "@backend/application/dependency";
import { AccountDto, TokenDto } from "@backend/api/common/models/auth";
import {
  AssertSchema,
  assertSchema as _assertSchema,
} from "@backend/application/common/utilities/schema";
import { handleAsync } from "@backend/api/common/utilities/request";
import { Router } from "express";
import { ILogger } from "@backend/application/common/interfaces/logger";

const assertSchema: AssertSchema = _assertSchema;

const routes = Router();

routes.get(
  "",
  handleAsync(async ({}, {}, { getPerRequestContainer }) => {
    const container = getPerRequestContainer();

    const logger = container.resolve<ILogger>(Dependency.logger);
    logger.log("authentication", "Attempting login using refresh token");

    const token = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .login("refresh");

    logger.log("authentication", "Login successful using refresh token");

    const tokenDto: TokenDto = { token };

    return { state: "ok", result: tokenDto };
  })
);

routes.post(
  "",
  handleAsync(async ({ body: accountDto }, {}, { getPerRequestContainer }) => {
    assertSchema(accountDto, AccountDto);

    const container = getPerRequestContainer();

    const logger = container.resolve<ILogger>(Dependency.logger);
    logger.log("authentication", "Attempting login using credentials");

    const token = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .login(accountDto.username, accountDto.password);

    logger.log("authentication", "Login successful using credentials");

    const tokenDto: TokenDto = { token };

    return { state: "ok", result: tokenDto };
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
