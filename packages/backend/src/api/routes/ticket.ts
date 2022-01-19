import { Dependency } from "@backend/application/dependency";
import { handleAsync } from "@backend/api/common/utilities/request";
import { ICQRS } from "@core/cqrs/types";
import { Router } from "express";
import { authenticator } from "@backend/api/common/middlewares/authenticator";

const routes = Router().use(authenticator);

routes.post(
  "",
  handleAsync(async ({ body }, {}, { getPerRequestContainer }) => {
    await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(body);

    return { state: "created" };
  })
);

export { routes as ticketRoutes };
