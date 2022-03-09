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
import { DelayedDependency, Request } from "@backend/application/common/utilities/cqrs";
import { Id, newId } from "@backend/domain/common/id";
import { Message } from "@backend/domain/entities/message";
import { isAssociatedToTicket } from "@backend/domain/entities/user";
import { ICommandHandler } from "@core/cqrs/types/request";
import { ICQRS } from "@core/cqrs/types/service";
import { ensure } from "@core/utilities";
import { InferType, object } from "yup";
import { MessageNotification } from "../notifications/message";

const SendMessageRequest = object({
  ticketId: Id.defined(),
})
  .concat(Message.pick(["content"]))
  .concat(Request("sendMessageRequest"));
type SendMessageRequest = InferType<typeof SendMessageRequest>;

class SendMessageRequestValidator implements IRequestValidator<SendMessageRequest> {
  requestName = "sendMessageRequest" as const;

  constructor(private readonly ticketRepository: ITicketRepository) {}

  async validate(request: unknown) {
    ensure(SendMessageRequest.isValidSync(request), new RBOError("validation"));

    ensure(
      await this.ticketRepository.exists(request.ticketId),
      new RBOError("missing", notFound(request.ticketId, "Ticket"))
    );
  }
}

class SendMessageRequestAuthorizer implements IRequestAuthorizer<SendMessageRequest> {
  requestName = "sendMessageRequest" as const;

  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly identityService: IIdentityService
  ) {}

  async authorize(request: SendMessageRequest) {
    const ticket = (await this.ticketRepository.get(request.ticketId))!;
    const currentUser = await this.identityService.getCurrentUser();

    ensure(
      isAssociatedToTicket(currentUser, ticket),
      new RBOError("authorization", messagingNotAssociatedToTicket)
    );
  }
}

class SendMessageCommandHandler implements ICommandHandler<SendMessageRequest> {
  handles = "sendMessageRequest" as const;

  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly ticketRepository: ITicketRepository,
    private readonly identityService: IIdentityService,
    private readonly cqrs: DelayedDependency<ICQRS>
  ) {}

  async handle({ ticketId, content }: SendMessageRequest) {
    const ticket = (await this.ticketRepository.get(ticketId))!;
    const from = await this.identityService.getCurrentUser();

    const message: Message = {
      _id: newId(),
      at: new Date(),
      content,
      from,
      ticket,
    };

    await this.messageRepository.insert(message);

    const recipientIds = [
      ticket.allocated?.to._id,
      ticket.authorized?.by?._id,
      ticket.created.by._id,
    ].filter((x): x is string => (x ? x !== from._id : false));

    if (!recipientIds.length) {
      return;
    }

    const notification: MessageNotification = {
      notificationName: "messageNotification",
      recipientIds,
      content,
    };

    await this.cqrs().publish(notification);
  }
}

export {
  SendMessageCommandHandler,
  SendMessageRequest,
  SendMessageRequestAuthorizer,
  SendMessageRequestValidator,
};
