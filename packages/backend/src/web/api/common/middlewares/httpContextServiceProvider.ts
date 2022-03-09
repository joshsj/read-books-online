import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import { Dependency } from "@backend/application/dependency";
import { HttpContextService } from "@backend/infrastructure/httpContextService";
import { handleAsync } from "@backend/web/api/common/utilities/request";
import { Handler } from "express";
import { container } from "tsyringe";

let contexts = 0;

const httpContextServiceProvider: Handler = handleAsync(
  async (req, {}, { setPerRequestContainer }) => {
    const requestContainer = container.createChildContainer();

    const authenticationTokenValue = req.headers.authorization?.split(" ")[1];

    requestContainer.register<IHttpContextService>(Dependency.httpContextService, {
      useValue: new HttpContextService({
        type: "http",
        id: contexts,
        authenticationTokenValue,
        // FIXME
        refreshTokenValue: undefined,
      }),
    });

    ++contexts;

    setPerRequestContainer(requestContainer);

    return { state: "next" };
  }
);

export { httpContextServiceProvider };
