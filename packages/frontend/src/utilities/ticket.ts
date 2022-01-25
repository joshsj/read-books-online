import { TicketState } from "@client/models";
import { capitalize } from "@core/utilities/string";

const PendingVariant = "info" as const;

const prettyTicketState = (state: TicketState) =>
  state === "requiresAdditionalInformation" ? "Requires Additional Information" : capitalize(state);

const variants: { [K in TicketState]?: string } = {
  approved: "success",
  requiresAdditionalInformation: "danger",
};

const approvalState = {
  displayText: (state: TicketState): string =>
    state === "allocated" ? "Pending" : prettyTicketState(state),
  variant: (state: TicketState): string => variants[state] ?? "info",
};

export { approvalState, prettyTicketState, PendingVariant };
