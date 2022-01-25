import { TicketState, Role, TicketDto, CreateTicketRequest } from "@client/models";
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
  request: () => Promise<RBOErrorDto | void>,
  successMessage: string,
  confirmMessage?: string
): Promise<boolean> => {
  if (confirmMessage) {
    const confirmation = await confirm(confirmMessage);

    if (!confirmation) {
      return false;
    }
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
  canCreate: (user?: UserStore): boolean => (user ?? store.user)?.roles.includes("client") ?? false,

  create: async (request: CreateTicketRequest) =>
    execTicketAction(interactor, () => client.ticket.create(request), "Ticket created"),

  canCancel: (ticket: TicketDto, user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return false;
    }

    return (
      ticket.states.every((s) => s === "unallocated") && ticket.created.by._id === resolvedUser._id
    );
  },

  cancel: async ({ _id }: TicketDto) =>
    execTicketAction(
      interactor,
      () => client.ticket.delete(_id),
      "Ticket cancelled",
      "Are you sure you want to cancel this ticket?"
    ),

  canAllocate: (ticket: TicketDto, user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return false;
    }

    return (
      ticket.states.at(-1) === "unallocated" &&
      ticket.created.by._id !== resolvedUser._id &&
      userBusiness.hasRoles(["employee"], user)
    );
  },

  allocate: async ({ _id }: TicketDto) =>
    execTicketAction(
      interactor,
      () =>
        client.ticket.allocation.create({
          requestName: "allocateTicketRequest",
          ticketId: _id,
        }),
      "Allocation successful",
      "Are you sure you want to allocate this ticket to yourself?"
    ),

  canApprove: (ticket: TicketDto, user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return false;
    }

    const validStates: TicketState[] = ["allocated", "requiresNewInformation"];

    return (
      validStates.includes(ticket.states.at(-1)!) && ticket.allocated!.to._id === resolvedUser._id
    );
  },

  approve: async (ticket: TicketDto): Promise<boolean> => {
    const { from } = await interactor.modal(
      {
        title: "Confirmation",
        mainButtonText: "Approve",
        altButtonText: "Request Additional Information",
        altButtonVariant: "danger",
      },
      undefined,
      h("div", { class: "content" }, [h("blockquote", {}, ticket.information)])
    );

    if (from === "close") {
      return false;
    }

    const response = await client.ticket.approval.put({
      requestName: "approveTicketRequest",
      ticketId: ticket._id,
      requiresAdditionalInformation: from === "alt",
    });

    if (isRBOError(response)) {
      interactor.notify(response);
      return false;
    }

    interactor.notify({ message: "Approval successful", variant: "success" });
    return true;
  },

  canProvideNewInfo: (ticket: TicketDto, user?: UserStore) => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return false;
    }

    return (
      ticket.states.at(-1)! === "requiresNewInformation" &&
      ticket.created.by._id === resolvedUser._id
    );
  },
});

const useBusiness = () => {
  const interactor = useInteractor();

  return { userBusiness, ticketBusiness: createTicketBusiness(interactor) };
};

type Business = ReturnType<typeof useBusiness>;

export { useBusiness, Business };
