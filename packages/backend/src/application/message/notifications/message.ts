import { Notification } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { InferType, object } from "yup";

const MessageNotification = object({
  messageId: Id.defined(),
}).concat(Notification("messageNotification"));

type MessageNotification = InferType<typeof MessageNotification>;

export { MessageNotification };
