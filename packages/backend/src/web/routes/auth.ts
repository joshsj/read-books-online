import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { Dependency } from "@backend/application/dependency";
import { AccountDto, TokenDto } from "@backend/web/common/models/auth";
import {
  AssertSchema,
  assertSchema as _assertSchema,
} from "@backend/application/common/utilities/schema";
import { handleAsync } from "@backend/web/common/utilities/requestHelper";
import { Router } from "express";
import { ILogger } from "@backend/application/common/interfaces/logger";

const assertSchema: AssertSchema = _assertSchema;

const routes = Router();

routes.get(
  "",
  handleAsync(async ({}, {}, { getPerRequestContainer, ok }) => {
    const container = getPerRequestContainer();

    const logger = container.resolve<ILogger>(Dependency.logger);
    logger.log("authentication", "Attempting with refresh token");

    const token = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .login("refresh");

    logger.log("authentication", "Succeeded using refresh token");

    const tokenDto: TokenDto = { token };

    ok(tokenDto);
  })
);

routes.post(
  "",
  handleAsync(async ({ body: accountDto }, {}, { ok, getPerRequestContainer }) => {
    assertSchema(accountDto, AccountDto);

    const container = getPerRequestContainer();

    const logger = container.resolve<ILogger>(Dependency.logger);
    logger.log("authentication", "Attempting with credentials");

    const token = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .login(accountDto.username, accountDto.password);

    logger.log("authentication", "Succeeded using credentials");

    const tokenDto: TokenDto = { token };

    ok(tokenDto);
  })
);

export { routes as authRoutes };
