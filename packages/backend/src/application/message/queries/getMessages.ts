import {
  messagingNotAssociatedToTicket,
  notFound,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRequestAuthorizer, IRequestValidator } from "@backend/application/common/interfaces/cqrs";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import {
  IMessageRepository,
  ITicketRepository,
} from "@backend/application/common/interfaces/repository";
import { Request } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { isAssociatedToTicket } from "@backend/domain/entities/user";
import { IQueryHandler } from "@core/cqrs/types/request";
import { ensure } from "@core/utilities";
import { InferType, object } from "yup";
import { MessageDto } from "./messageDto";

const GetMessagesRequest = object({
  ticketId: Id.defined(),
}).concat(Request("getMessagesRequest"));
type GetMessagesRequest = InferType<typeof GetMessagesRequest>;

class GetMessagesRequestValidator implements IRequestValidator<GetMessagesRequest> {
  requestName = "getMessagesRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async validate(request: unknown) {
    ensure(GetMessagesRequest.isValidSync(request), new RBOError("validation"));

    ensure(
      await this.ticketRepository.exists(request.ticketId),
      new RBOError("missing", notFound(request.ticketId, "Ticket"))
    );
  }
}

class GetMessagesRequestAuthorizer implements IRequestAuthorizer<GetMessagesRequest> {
  requestName = "getMessagesRequest" as const;

  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly identityService: IIdentityService
  ) {}

  async authorize(request: GetMessagesRequest) {
    const ticket = (await this.ticketRepository.get(request.ticketId))!;
    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      isAssociatedToTicket(currentUser, ticket),
      new RBOError("authorization", messagingNotAssociatedToTicket)
    );
  }
}

class GetMessagesQueryHandler implements IQueryHandler<GetMessagesRequest, MessageDto[]> {
  handles = "getMessagesRequest" as const;

  constructor(private readonly messageRepository: IMessageRepository) {}

  async handle({ ticketId }: GetMessagesRequest) {
    const messages = await this.messageRepository.getByTicketId(ticketId);

    return messages.map(MessageDto.fromMessage);
  }
}

export {
  GetMessagesQueryHandler,
  GetMessagesRequest,
  GetMessagesRequestAuthorizer,
  GetMessagesRequestValidator,
};
