import { Id, Role, TicketDto } from "@client/models";
import { client, isRBOError } from "@frontend/client";
import { store, UserStore } from "@frontend/store";
import { Interactor, useInteractor } from "./interactor";

const userBusiness = {
  hasRoles: (_roles: Role[], user?: UserStore) => {
    const resolvedUser = user ?? store.user;

    if (!(_roles.length && resolvedUser)) {
      return;
    }

    return _roles.every((r) => resolvedUser.roles.includes(r));
  },
};

const createTicketBusiness = ({ notify, confirm }: Interactor) => ({
  canAllocate: (ticket: TicketDto, user?: UserStore) => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return;
    }

    return (
      !ticket.allocated &&
      ticket.created.by._id !== resolvedUser._id &&
      userBusiness.hasRoles(["employee"], user)
    );
  },

  allocate: async (ticketId: Id): Promise<boolean> => {
    const confirmation = await confirm(
      "Are you sure you want to allocate this ticket to yourself?"
    );

    if (!confirmation) {
      return false;
    }

    const response = await client.ticket.allocation.create({
      requestName: "allocateTicketRequest",
      ticketId,
    });

    if (isRBOError(response)) {
      notify(response);
      return false;
    }

    notify({ message: "Allocation successful", variant: "success" });
    return true;
  },
});

const useBusiness = () => {
  const interactor = useInteractor();

  return { userBusiness, ticketBusiness: createTicketBusiness(interactor) };
};

type Business = ReturnType<typeof useBusiness>;

export { useBusiness, Business };
