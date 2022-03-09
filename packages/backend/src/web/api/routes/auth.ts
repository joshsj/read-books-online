import { handleAsync } from "@backend/web/api/common/utilities/request";
import { AccountDto } from "@backend/application/common/dtos/accountDto";
import { TokenDto } from "@backend/application/common/dtos/tokenDto";
import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { ILogger } from "@backend/application/common/interfaces/logger";
import {
  AssertSchema,
  assertSchema as _assertSchema,
} from "@backend/application/common/utilities/schema";
import { Dependency } from "@backend/application/dependency";
import { Router } from "express";

const assertSchema: AssertSchema = _assertSchema;

const routes = Router();

routes.get(
  "",
  handleAsync(async ({}, {}, { getPerRequestContainer, setRefreshTokenCookie }) => {
    const container = getPerRequestContainer();

    const logger = container.resolve<ILogger>(Dependency.logger);
    logger.log("authentication", "Attempting login using refresh token");

    const { authenticationTokenValue: token, refreshToken } = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .login("refresh");

    logger.log("authentication", "Login successful using refresh token");

    setRefreshTokenCookie(
      container.resolve<IConfiguration>(Dependency.configuration).server.cookie.refreshTokenKey,
      refreshToken.value,
      refreshToken.expires
    );

    const tokenDto: TokenDto = { token };

    return { state: "ok", value: tokenDto };
  })
);

routes.post(
  "",
  handleAsync(
    async ({ body: accountDto }, {}, { getPerRequestContainer, setRefreshTokenCookie }) => {
      assertSchema(accountDto, AccountDto);

      const container = getPerRequestContainer();

      const logger = container.resolve<ILogger>(Dependency.logger);
      logger.log("authentication", "Attempting login using credentials");

      const { authenticationTokenValue: token, refreshToken } = await container
        .resolve<IIdentityService>(Dependency.identityService)
        .login(accountDto);

      logger.log("authentication", "Login successful using credentials");

      setRefreshTokenCookie(
        container.resolve<IConfiguration>(Dependency.configuration).server.cookie.refreshTokenKey,
        refreshToken.value,
        refreshToken.expires
      );

      const tokenDto: TokenDto = { token };

      return { state: "ok", value: tokenDto };
    }
  )
);

routes.delete(
  "",
  handleAsync(async ({}, {}, { getPerRequestContainer, setRefreshTokenCookie }) => {
    const container = getPerRequestContainer();

    const logger = container.resolve<ILogger>(Dependency.logger);
    logger.log("authentication", "Logging out");

    await container.resolve<IIdentityService>(Dependency.identityService).logout();

    setRefreshTokenCookie(
      container.resolve<IConfiguration>(Dependency.configuration).server.cookie.refreshTokenKey,
      "expired",
      new Date(0)
    );

    return { state: "noContent" };
  })
);

export { routes as authRoutes };
