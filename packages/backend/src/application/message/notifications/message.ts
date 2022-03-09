import { Notification } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { Message } from "@backend/domain/entities/message";
import { array, InferType, object } from "yup";

const MessageNotification = object({
  recipientIds: array().of(Id.defined()).defined(),
})
  .concat(Message.pick(["content"]))
  .concat(Notification("messageNotification"));

type MessageNotification = InferType<typeof MessageNotification>;

export { MessageNotification };
