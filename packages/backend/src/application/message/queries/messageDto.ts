import { BriefUserDto } from "@backend/application/common/dtos/userDto";
import { Id } from "@backend/domain/common/id";
import { Message } from "@backend/domain/entities/message";

type MessageDto = Pick<Message, "content" | "at"> & {
  from: BriefUserDto;
  ticketId: Id;
};

const MessageDto = {
  fromMessage: ({ at, content, from, ticket }: Message): MessageDto => ({
    at,
    content,
    from: BriefUserDto.fromUser(from),
    ticketId: ticket._id,
  }),
};

export { MessageDto };
