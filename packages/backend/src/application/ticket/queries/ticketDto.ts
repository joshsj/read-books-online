import { UserDto, userDto } from "@backend/application/common/dtos/userDto";
import { Ticket } from "@backend/domain/entities/ticket";

type TicketDto = Pick<Ticket, "_id" | "information" | "createdAt"> & { createdBy: UserDto };

const TicketDto = {
  fromTicket: ({ _id, information, createdAt, createdBy }: Ticket): TicketDto => ({
    _id,
    information,
    createdAt,
    createdBy: userDto.fromUser(createdBy),
  }),
};

export { TicketDto };
