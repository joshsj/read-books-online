import { authenticator } from "@backend/api/common/middlewares/authenticator";
import { handleAsync } from "@backend/api/common/utilities/request";
import { Dependency } from "@backend/application/dependency";
import { GetTicketRequest } from "@backend/application/ticket/queries/getTicket";
import { ICQRS } from "@core/cqrs/types";
import { Router } from "express";

const routes = Router().use(authenticator);

routes.get(
  "/:id",
  handleAsync(async ({ params }, {}, { getPerRequestContainer }) => {
    const request: GetTicketRequest = {
      requestName: "getTicketRequest",
      ticketId: params.id!,
    };

    const value = await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(request);

    return { state: "ok", value };
  })
);

routes.post(
  "",
  handleAsync(async ({ body }, {}, { getPerRequestContainer }) => {
    await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(body);

    return { state: "created" };
  })
);

export { routes as ticketRoutes };
