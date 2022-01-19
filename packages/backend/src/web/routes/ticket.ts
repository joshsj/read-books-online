import { Dependency } from "@backend/application/dependency";
import { handleAsync } from "@backend/web/common/utilities/requestHelper";
import { ICQRS } from "@core/cqrs/types";
import { Router } from "express";

const routes = Router();

routes.post(
  "",
  handleAsync(async ({ body }, {}, { getPerRequestContainer, created }) => {
    const container = getPerRequestContainer();

    await container.resolve<ICQRS>(Dependency.cqrs).send(body);

    created();
  })
);

export { routes as ticketRoutes };
