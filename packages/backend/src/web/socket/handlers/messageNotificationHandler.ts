import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { IMessageRepository } from "@backend/application/common/interfaces/repository";
import { Dependency } from "@backend/application/dependency";
import { MessageNotification } from "@backend/application/message/notifications/message";
import { MessageDto } from "@backend/application/message/queries/messageDto";
import { Id, isId } from "@backend/domain/common/id";
import { INotificationHandler } from "@core/cqrs/types/notification";
import { DependencyContainer } from "tsyringe";
import { Socket } from "../common/utilities/types";

class MessageNotificationHandler implements INotificationHandler<MessageNotification> {
  handles = "messageNotification" as const;

  constructor(
    private readonly sockets: Socket[],
    private readonly messageRepository: IMessageRepository
  ) {}

  async handle({ messageId }: MessageNotification) {
    const message = (await this.messageRepository.get(messageId))!;
    const messageDto = MessageDto.fromMessage(message);

    const recipientIds = [
      message.ticket.created?.by._id,
      message.ticket.allocated?.to._id,
      message.ticket.authorized?.by?._id,
    ].filter(isId);

    this.sockets
      .filter(({ data: { container } }) => container && this.isRecipient(container, recipientIds))
      .forEach((s) => s.send(messageDto));
  }

  private async isRecipient(container: DependencyContainer, recipientIds: Id[]): Promise<boolean> {
    const socketUserId = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .getCurrentUserId();

    return recipientIds.includes(socketUserId);
  }
}

export { MessageNotificationHandler };
