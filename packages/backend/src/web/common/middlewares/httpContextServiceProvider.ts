import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import { Dependency } from "@backend/application/dependency";
import { HttpContextService } from "@backend/infrastructure/httpContextService";
import { handleAsync } from "@backend/web/common/utilities/requestHelper";
import { Handler } from "express";
import { container } from "tsyringe";

let contexts = 0;

const httpContextServiceProvider: Handler = handleAsync(
  async (req, res, { setPerRequestContainer }) => {
    const requestContainer = container.createChildContainer();

    requestContainer.register<IHttpContextService>(Dependency.httpContextService, {
      useFactory: () => new HttpContextService({ id: contexts, req, res }),
    });

    ++contexts;

    setPerRequestContainer(requestContainer);

    return "next";
  }
);

export { httpContextServiceProvider };
