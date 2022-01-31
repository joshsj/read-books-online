import { BriefUserDto } from "@backend/application/common/dtos/userDto";
import { AuthorizationState, TicketState } from "@backend/domain/constants/ticketStates";
import { getTicketStates, Ticket } from "@backend/domain/entities/ticket";

type TicketDto = Pick<Ticket, "_id" | "information" | "format"> & {
  states: TicketState[];
  created: { at: Date; by: BriefUserDto };
  allocated?: { at: Date; to: BriefUserDto };
  reviewed?: NonNullable<Ticket["reviewed"]>;
  priced?: NonNullable<Ticket["priced"]>;
  authorized?: { at: Date; by?: BriefUserDto; state: AuthorizationState };
};

const TicketDto = {
  fromTicket: (ticket: Ticket): TicketDto => {
    const { _id, format, information, created, allocated, reviewed, priced, authorized } = ticket;

    return {
      _id,
      format,
      information,
      states: getTicketStates(ticket),
      created: { at: created.at, by: BriefUserDto.fromUser(created.by) },
      allocated: allocated
        ? { at: allocated.at, to: BriefUserDto.fromUser(allocated.to) }
        : undefined,
      reviewed: reviewed ?? undefined,
      priced: priced ?? undefined,
      authorized: authorized
        ? {
            at: authorized.at,
            by: authorized.by ? BriefUserDto.fromUser(authorized.by) : undefined,
            state: authorized.state,
          }
        : undefined,
    };
  },
};

export { TicketDto };
