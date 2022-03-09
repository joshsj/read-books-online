import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import { Dependency } from "@backend/application/dependency";
import { HttpContextService } from "@backend/infrastructure/httpContextService";
import { handleAsync } from "@backend/web/api/common/utilities/request";
import { Handler } from "express";
import { container } from "tsyringe";
import { IConfiguration } from "@backend/application/common/interfaces/configuration";

let contexts = 0;

const httpContextServiceProvider: Handler = handleAsync(
  async (req, {}, { setPerRequestContainer }) => {
    const requestContainer = container.createChildContainer();
    const configuration = container.resolve<IConfiguration>(Dependency.configuration);

    const authenticationTokenValue = req.headers.authorization?.split(" ")[1];
    const refreshTokenValue: unknown =
      req.signedCookies[configuration.server.cookie.refreshTokenKey];

    requestContainer.register<IHttpContextService>(Dependency.httpContextService, {
      useFactory: () =>
        new HttpContextService({
          type: "http",
          id: contexts,
          authenticationTokenValue,
          refreshTokenValue:
            refreshTokenValue && typeof refreshTokenValue === "string"
              ? refreshTokenValue
              : undefined,
        }),
    });

    ++contexts;

    setPerRequestContainer(requestContainer);

    return { state: "next" };
  }
);

export { httpContextServiceProvider };
