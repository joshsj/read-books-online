import { AuditableDto } from "@backend/application/common/dtos/auditableDto";
import { UserDto } from "@backend/application/common/dtos/userDto";
import { Ticket } from "@backend/domain/entities/ticket";

type TicketDto = Pick<Ticket, "_id" | "information" | "reviewState"> &
  AuditableDto<"created"> &
  Partial<AuditableDto<"allocated" | "reviewed">>;

const TicketDto = {
  fromTicket: ({
    _id,
    information,
    created,
    allocated,
    reviewed,
    reviewState,
  }: Ticket): TicketDto => ({
    _id,
    information,

    created: {
      at: created.at,
      by: UserDto.fromUser(created.by),
    },

    allocated: allocated ? { at: allocated.at, by: UserDto.fromUser(allocated.by) } : undefined,

    reviewState,
    reviewed: reviewed ? { at: reviewed.at, by: UserDto.fromUser(reviewed.by) } : undefined,
  }),
};

export { TicketDto };
