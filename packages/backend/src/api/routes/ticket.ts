import { Dependency } from "@backend/application/dependency";
import { handleAsync } from "@backend/api/common/utilities/request";
import { ICQRS } from "@core/cqrs/types";
import { Router } from "express";

const routes = Router();

routes.post(
  "",
  handleAsync(async ({ body }, {}, { getPerRequestContainer }) => {
    const container = getPerRequestContainer();

    await container.resolve<ICQRS>(Dependency.cqrs).send(body);

    return { state: "created" };
  })
);

export { routes as ticketRoutes };
