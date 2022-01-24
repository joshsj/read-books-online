import { authenticator } from "@backend/api/common/middlewares/authenticator";
import { handleAsync } from "@backend/api/common/utilities/request";
import { Dependency } from "@backend/application/dependency";
import { GetTicketRequest } from "@backend/application/ticket/queries/getTicket";
import { GetTicketsRequest } from "@backend/application/ticket/queries/getTickets";
import { ICQRS } from "@core/cqrs/types";
import { Router } from "express";

const allocationRoutes = Router();

allocationRoutes.post(
  "",
  handleAsync(async ({ body }, {}, { getPerRequestContainer }) => {
    await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(body);

    return { state: "created" };
  })
);

const ticketRoutes = Router().use(authenticator).use("/allocation", allocationRoutes);

ticketRoutes.get(
  "",
  handleAsync(async ({}, {}, { getPerRequestContainer, getParsedQuery }) => {
    const request: GetTicketsRequest = {
      requestName: "getTicketsRequest",
      ...getParsedQuery(),
    };

    const value = await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(request);

    return { state: "ok", value };
  })
);

ticketRoutes.get(
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

ticketRoutes.post(
  "",
  handleAsync(async ({ body }, {}, { getPerRequestContainer }) => {
    await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(body);

    return { state: "created" };
  })
);

export { ticketRoutes };
