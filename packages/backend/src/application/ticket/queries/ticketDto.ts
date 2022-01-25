import { AuthorizerDto } from "@backend/application/common/dtos/authorizerDto";
import { UserDto } from "@backend/application/common/dtos/userDto";
import { AuthorizationState } from "@backend/domain/constants/authorizationState";
import { TicketState } from "@backend/domain/constants/ticketState";
import { getTicketStates, Ticket } from "@backend/domain/entities/ticket";

type TicketDto = Pick<Ticket, "_id" | "information"> & {
  states: TicketState[];
  created: { at: Date; by: UserDto };
  allocated?: { at: Date; to: UserDto };
  reviewed?: NonNullable<Ticket["reviewed"]>;
  authorized?: { at: Date; by?: AuthorizerDto; state: AuthorizationState };
};

const TicketDto = {
  fromTicket: (ticket: Ticket): TicketDto => {
    const { _id, information, created, allocated, reviewed, authorized } = ticket;

    return {
      _id,
      information,
      states: getTicketStates(ticket),
      created: { at: created.at, by: UserDto.fromUser(created.by) },
      allocated: allocated ? { at: allocated.at, to: UserDto.fromUser(allocated.to) } : undefined,
      reviewed: reviewed ?? undefined,
      authorized: authorized
        ? {
            at: authorized.at,
            by: authorized.by ? AuthorizerDto.fromAuthorizer(authorized.by) : undefined,
            state: authorized.state,
          }
        : undefined,
    };
  },
};

export { TicketDto };
