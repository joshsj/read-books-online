import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import { Dependency } from "@backend/application/dependency";
import { MessageNotification } from "@backend/application/message/notifications/message";
import { Id } from "@backend/domain/common/id";
import { INotificationHandler } from "@core/cqrs/types/notification";
import { DependencyContainer } from "tsyringe";
import { Socket } from "../common/utilities/types";

class MessageNotificationHandler implements INotificationHandler<MessageNotification> {
  handles = "messageNotification" as const;

  constructor(private readonly sockets: Socket[]) {}

  async handle({ recipientIds, content }: MessageNotification) {
    for (const socket of this.sockets) {
      if (!socket.data.container) {
        continue;
      }

      for (const recipientId of recipientIds) {
        if (!(await this.isRecipient(socket.data.container, recipientId))) {
          continue;
        }

        socket.send({ msg: content });
      }
    }
  }

  private async isRecipient(container: DependencyContainer, recipientId: Id): Promise<boolean> {
    const socketUserId = await container
      .resolve<IIdentityService>(Dependency.identityService)
      .getCurrentUserId();

    return recipientId === socketUserId;
  }
}

export { MessageNotificationHandler };
