import {
  CompleteTicketRequest,
  CreateTicketRequest,
  SubmitTicketPriceRequest,
  TicketDto,
} from "@client/models";
import { client, isRBOError } from "@frontend/client";
import { useInteractor } from "@frontend/plugins/interactor";
import { store, UserStore } from "@frontend/store";
import { h } from "vue";
import { simpleAction } from ".";
import { useUserBusiness } from "./user";

const useTicketBusiness = () => {
  const interactor = useInteractor();
  const userBusiness = useUserBusiness();

  return {
    canCreate: (user?: UserStore): boolean =>
      (user ?? store.user)?.roles.includes("client") ?? false,

    create: async (request: CreateTicketRequest) =>
      simpleAction(interactor, () => client.ticket.create(request), "Ticket created"),

    canCancel: (ticket: TicketDto, user?: UserStore): boolean => {
      const resolvedUser = user ?? store.user;

      if (!resolvedUser) {
        return false;
      }

      return !ticket.allocated && ticket.created.by._id === resolvedUser._id;
    },

    cancel: async ({ _id }: TicketDto) =>
      simpleAction(
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
        !ticket.allocated &&
        ticket.created.by._id !== resolvedUser._id &&
        userBusiness.hasRoles(["employee"], user)
      );
    },

    allocate: async ({ _id }: TicketDto) =>
      simpleAction(
        interactor,
        () =>
          client.ticket.allocation.create({
            requestName: "allocateTicketRequest",
            ticketId: _id,
          }),
        "Allocation successful",
        "Are you sure you want to allocate this ticket to yourself?"
      ),

    canReview: (ticket: TicketDto, user?: UserStore): boolean => {
      const resolvedUser = user ?? store.user;

      if (!resolvedUser) {
        return false;
      }

      return (
        !!ticket.allocated &&
        ticket.reviewed?.state !== "Information Complete" &&
        ticket.allocated.to._id === resolvedUser._id
      );
    },

    review: async (ticket: TicketDto): Promise<boolean> => {
      const { from } = await interactor.modal(
        {
          title: "Review Ticket",
          mainButtonText: "Complete",
          altButtonText: "Incomplete",
          altButtonVariant: "danger",
        },
        undefined,
        h("div", { class: "content" }, [h("blockquote", {}, ticket.information)])
      );

      if (from === "close") {
        return false;
      }

      const response = await client.ticket.review.create({
        requestName: "reviewTicketRequest",
        ticketId: ticket._id,
        state: from === "main" ? "Information Complete" : "Information Incomplete",
      });

      if (isRBOError(response)) {
        interactor.notify(response);
        return false;
      }

      interactor.notify({ message: "Review successful", variant: "success" });
      return true;
    },

    canComplete: (ticket: TicketDto, user?: UserStore) => {
      const resolvedUser = user ?? store.user;

      if (!resolvedUser) {
        return false;
      }

      return (
        ticket.reviewed?.state === "Information Incomplete" &&
        ticket.created.by._id === resolvedUser._id
      );
    },

    complete: (request: CompleteTicketRequest) =>
      simpleAction(interactor, () => client.ticket.update(request), "Ticket updated"),

    canSubmitPrice: (ticket: TicketDto, user?: UserStore) => {
      const resolvedUser = user ?? store.user;

      if (!resolvedUser) {
        return false;
      }

      return (
        !ticket.priced &&
        ticket.reviewed?.state === "Information Complete" &&
        ticket.allocated!.to._id === resolvedUser._id
      );
    },

    submitPrice: async (request: SubmitTicketPriceRequest) =>
      simpleAction(interactor, () => client.ticket.price.create(request), "Ticket price submitted"),

    canAuthorize: (ticket: TicketDto, user?: UserStore) => {
      const resolvedUser = user ?? store.user;

      if (!resolvedUser) {
        return false;
      }

      const invalidIds = [ticket.created.by._id, ticket.allocated?.to._id];

      return !ticket.authorized && !!ticket.priced && !invalidIds.includes(resolvedUser._id);
    },

    authorize: async (ticket: TicketDto) => {
      const { from } = await interactor.modal(
        {
          title: "Authorize Ticket",
          mainButtonText: "Approve",
          altButtonText: "Deny",
          altButtonVariant: "danger",
        },
        undefined,
        () => `Cost: ${ticket.priced?.value}`
      );

      if (from === "close") {
        return false;
      }

      const response = await client.ticket.authorization.create({
        requestName: "authorizeTicketRequest",
        ticketId: ticket._id,
        state: from === "main" ? "Purchase Approved" : "Purchase Denied",
      });

      if (isRBOError(response)) {
        interactor.notify(response);
        return false;
      }

      interactor.notify({ message: "Authorization successful", variant: "success" });
      return true;
    },
  };
};

export { useTicketBusiness };
