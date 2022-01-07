import { IHttpContextService } from "@/application/common/interfaces/httpContextService";
import { Dependency } from "@/application/dependency";
import { HttpContextService } from "@/infrastructure/httpContextService";
import { handleAsync } from "@/web/common/utilities/requestHelper";
import { Handler } from "express";
import { container } from "tsyringe";

const httpContextServiceProvider: Handler = handleAsync(async (req, res, { setPerRequestContainer }) => {
  const requestContainer = container.createChildContainer();

  requestContainer.register<IHttpContextService>(Dependency.httpContextService, {
    useFactory: () => new HttpContextService(req, res),
  });

  setPerRequestContainer(requestContainer);
});

export { httpContextServiceProvider };
