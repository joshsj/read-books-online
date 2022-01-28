import { Notification } from "@backend/application/common/utilities/cqrs";
import { Id } from "@backend/domain/common/id";
import { ReviewState } from "@backend/domain/constants/ticketStates";
import { INotificationHandler } from "@core/cqrs/types/notification";
import { InferType, object } from "yup";
import { BaseTicketNotificationHandler } from "./baseTicketNotificationHandler";

const IncompleteTicketNotification = object({ ticketId: Id }).concat(
  Notification("incompleteTicketNotification")
);
type IncompleteTicketNotification = InferType<typeof IncompleteTicketNotification>;

class IncompleteTicketNotificationHandler
  extends BaseTicketNotificationHandler
  implements INotificationHandler<IncompleteTicketNotification>
{
  handles = "incompleteTicketNotification" as const;

  async handle({ ticketId }: IncompleteTicketNotification) {
    const state: Extract<ReviewState, "Information Incomplete"> = "Information Incomplete";

    await super.notify(
      ticketId,
      state,
      `Your ticket has been marked as '${state}'.`,
      "Please provide additional information so we can continue processing it."
    );
  }
}

export { IncompleteTicketNotification, IncompleteTicketNotificationHandler };
