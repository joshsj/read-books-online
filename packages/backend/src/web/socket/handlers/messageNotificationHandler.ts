import { MessageNotification } from "@backend/application/message/notifications/message";
import { INotificationHandler } from "@core/cqrs/types/notification";
import { Server } from "socket.io";

class MessageNotificationHandler implements INotificationHandler<MessageNotification> {
  handles = "messageNotification" as const;

  constructor(private readonly server: Server) {}

  async handle(notification: MessageNotification) {
    console.log(notification);
  }
}

export { MessageNotificationHandler };
