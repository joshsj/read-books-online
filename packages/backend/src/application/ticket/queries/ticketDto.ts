import { UserDto } from "@backend/application/common/dtos/userDto";
import { ReviewState } from "@backend/domain/constants/reviewState";
import { Ticket } from "@backend/domain/entities/ticket";

type TicketDto = Pick<Ticket, "_id" | "information"> & {
  created: { at: Date; by: UserDto };
  allocated?: { at: Date; to: UserDto };
  reviewed?: { at: Date; state: ReviewState };
};

const TicketDto = {
  fromTicket: ({ _id, information, created, allocated, reviewed }: Ticket): TicketDto => ({
    _id,
    information,
    created: { at: created.at, by: UserDto.fromUser(created.by) },
    allocated: allocated ? { at: allocated.at, to: UserDto.fromUser(allocated.to) } : undefined,
    reviewed,
  }),
};

export { TicketDto };
