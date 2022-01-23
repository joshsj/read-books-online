import { AuditableDto } from "@backend/application/common/dtos/auditableDto";
import { UserDto } from "@backend/application/common/dtos/userDto";
import { Ticket } from "@backend/domain/entities/ticket";

type TicketDto = Pick<Ticket, "_id" | "information"> &
  AuditableDto<"created"> &
  Partial<AuditableDto<"allocated">>;

const TicketDto = {
  fromTicket: ({ _id, information, created, allocated }: Ticket): TicketDto => ({
    _id,
    information,
    created: {
      at: created.at,
      by: UserDto.fromUser(created.by),
    },
    allocated: allocated
      ? {
          at: allocated.at,
          by: UserDto.fromUser(allocated.by),
        }
      : undefined,
  }),
};

export { TicketDto };
