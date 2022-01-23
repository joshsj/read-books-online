import { Role, TicketDto } from "@client/models";
import { store, UserStore } from "./store";

const userLogic = {
  hasRoles: (_roles: Role[], user?: UserStore) => {
    const resolvedUser = user ?? store.user;

    console.log(resolvedUser);

    if (!(_roles.length && resolvedUser)) {
      return;
    }

    return _roles.every((r) => resolvedUser.roles.includes(r));
  },
};

const ticketLogic = {
  canAllocate: (ticket: TicketDto, user?: UserStore) => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return;
    }

    return (
      !ticket.allocated &&
      ticket.created.by._id !== resolvedUser._id &&
      userLogic.hasRoles(["employee"], user)
    );
  },
};

export { userLogic, ticketLogic };
