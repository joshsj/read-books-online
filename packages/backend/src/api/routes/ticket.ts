import { authenticator } from "@backend/api/common/middlewares/authenticator";
import { handleAsync } from "@backend/api/common/utilities/request";
import { Dependency } from "@backend/application/dependency";
import { CancelTicketRequest } from "@backend/application/ticket/commands/cancelTicket";
import { GetTicketRequest } from "@backend/application/ticket/queries/getTicket";
import { GetTicketsRequest } from "@backend/application/ticket/queries/getTickets";
import { ICQRS } from "@core/cqrs/types";
import { Router } from "express";

const ticketRoutes = Router().use(authenticator);

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

ticketRoutes.put(
  "",
  handleAsync(async ({ body }, {}, { getPerRequestContainer }) => {
    await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(body);

    return { state: "created" };
  })
);

ticketRoutes.delete(
  "/:id",
  handleAsync(async ({ params }, {}, { getPerRequestContainer }) => {
    const request: CancelTicketRequest = {
      requestName: "cancelTicketRequest",
      ticketId: params.id!,
    };

    await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(request);

    return { state: "noContent" };
  })
);

ticketRoutes.post(
  "/allocation",
  handleAsync(async ({ body }, {}, { getPerRequestContainer }) => {
    await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(body);

    return { state: "created" };
    1;
  })
);

ticketRoutes.put(
  "/review",
  handleAsync(async ({ body }, {}, { getPerRequestContainer }) => {
    await getPerRequestContainer().resolve<ICQRS>(Dependency.cqrs).send(body);

    return { state: "ok", value: undefined };
  })
);

export { ticketRoutes };
