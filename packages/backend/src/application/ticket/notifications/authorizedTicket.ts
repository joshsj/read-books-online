import { Notification } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { AuthorizationState } from "@backend/domain/constants/ticketStates";
import { INotificationHandler } from "@core/cqrs/types/notification";
import { InferType, object } from "yup";
import { BaseTicketNotificationHandler } from "./baseTicketNotificationHandler";

const AuthorizeTicketNotification = object({
  ticketId: Id,
  state: AuthorizationState.required(),
}).concat(Notification("authorizeTicketNotification"));
type AuthorizeTicketNotification = InferType<typeof AuthorizeTicketNotification>;

class AuthorizeTicketNotificationHandler
  extends BaseTicketNotificationHandler
  implements INotificationHandler<AuthorizeTicketNotification>
{
  handles = "authorizeTicketNotification" as const;

  async handle({ ticketId, state }: AuthorizeTicketNotification) {
    await super.notify(
      ticketId,
      state,
      `Your ticket has been marked as '${state}'.`,
      state === "Purchase Approved"
        ? "You should see on our site soon!"
        : "We apologize for being unable to stock this item."
    );
  }
}

export { AuthorizeTicketNotification, AuthorizeTicketNotificationHandler };
