import { UserDto } from "@backend/application/common/dtos/userDto";
import { TicketState } from "@backend/domain/constants/ticketState";
import { getTicketStates, Ticket } from "@backend/domain/entities/ticket";

type TicketDto = Pick<Ticket, "_id" | "information"> & {
  states: TicketState[];
  created: { at: Date; by: UserDto };
  allocated?: { at: Date; to: UserDto };
  approved?: NonNullable<Ticket["approved"]>;
};

const TicketDto = {
  fromTicket: (ticket: Ticket): TicketDto => {
    const { _id, information, created, allocated, approved } = ticket;

    return {
      _id,
      information,
      states: getTicketStates(ticket),
      created: { at: created.at, by: UserDto.fromUser(created.by) },
      allocated: allocated ? { at: allocated.at, to: UserDto.fromUser(allocated.to) } : undefined,
      approved: approved ?? undefined,
    };
  },
};

export { TicketDto };
