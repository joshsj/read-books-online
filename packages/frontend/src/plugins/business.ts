import { Id, Role, TicketDto } from "@client/models";
import { RBOErrorDto } from "@client/types";
import { client, isRBOError } from "@frontend/client";
import { store, UserStore } from "@frontend/store";
import { h } from "vue";
import { Interactor, useInteractor } from "./interactor";

const userBusiness = {
  hasRoles: (_roles: Role[], user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!(_roles.length && resolvedUser)) {
      return false;
    }

    return _roles.every((r) => resolvedUser.roles.includes(r));
  },
};

const execTicketAction = async (
  { notify, confirm }: Interactor,
  confirmMessage: string,
  request: () => Promise<RBOErrorDto | void>,
  successMessage: string
): Promise<boolean> => {
  const confirmation = await confirm(confirmMessage);

  if (!confirmation) {
    return false;
  }

  const response = await request();

  if (isRBOError(response)) {
    notify(response);
    return false;
  }

  notify({ message: successMessage, variant: "success" });
  return true;
};

const createTicketBusiness = (interactor: Interactor) => ({
  canAllocate: (ticket: TicketDto, user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return false;
    }

    return (
      !ticket.allocated &&
      ticket.created.by._id !== resolvedUser._id &&
      userBusiness.hasRoles(["employee"], user)
    );
  },

  allocate: async ({ _id }: TicketDto) =>
    execTicketAction(
      interactor,
      "Are you sure you want to allocate this ticket to yourself?",
      () =>
        client.ticket.allocation.create({
          requestName: "allocateTicketRequest",
          ticketId: _id,
        }),
      "Allocation successful"
    ),

  canCancel: (ticket: TicketDto, user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return false;
    }

    return !ticket.allocated && ticket.created.by._id === resolvedUser._id;
  },

  cancel: async ({ _id }: TicketDto) =>
    execTicketAction(
      interactor,
      "Are you sure you want to cancel this ticket?",
      () => client.ticket.delete(_id),
      "Ticket cancelled"
    ),

  canReview: (ticket: TicketDto, user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return false;
    }

    return (
      !!ticket.allocated &&
      ticket.allocated.to._id === resolvedUser._id &&
      (!ticket.reviewed || ticket.reviewed.state !== "approved")
    );
  },

  review: async (ticket: TicketDto): Promise<boolean> => {
    const { from } = await interactor.modal(
      {
        title: "Confirmation",
        mainButtonText: "Approve",
      },
      undefined,
      h("div", { class: "content" }, [
        h("p", {}, "Are you sure you want to review this ticket?"),
        h("blockquote", {}, ticket.information),
      ])
    );

    if (from !== "main") {
      return false;
    }

    const response = await client.ticket.review.put({
      requestName: "reviewTicketRequest",
      ticketId: ticket._id,
      reviewState: "approved",
    });

    if (isRBOError(response)) {
      interactor.notify(response);
      return false;
    }

    interactor.notify({ message: "Review successful", variant: "success" });
    return true;
  },
});

const useBusiness = () => {
  const interactor = useInteractor();

  return { userBusiness, ticketBusiness: createTicketBusiness(interactor) };
};

type Business = ReturnType<typeof useBusiness>;

export { useBusiness, Business };
